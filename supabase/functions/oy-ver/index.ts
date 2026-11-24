// ══════════════════════════════════════════════════════════
// COMPEC BİLİŞİM ÖDÜLLERİ — OY GÖNDERME UÇ NOKTASI
// ══════════════════════════════════════════════════════════
// Tarayıcı veritabanına doğrudan yazamaz; bütün oylar buradan geçer.
// Burada yapılan kontroller:
//   1. Cloudflare Turnstile doğrulaması (TURNSTILE_SECRET tanımlıysa)
//   2. İstek gövdesinin biçim kontrolü
//   3. IP adresinin tuzlanmış SHA-256 özeti (ham IP hiç saklanmaz)
//   4. Geri kalan her şey (oylama açık mı, cihaz daha önce oy kullandı mı,
//      IP limiti, adayların doğru kategoride olması) veritabanındaki
//      oy_kaydet() fonksiyonunda, tek bir atomik işlemde yapılır.
//
// Tuz (ip_tuzu) veritabanındaki "ayarlar" tablosunda üretilir ve orada kalır;
// elle bir gizli değer tanımlamaya gerek yoktur.
//
// İsteğe bağlı ortam değişkenleri (Dashboard → Edge Functions → Secrets):
//   TURNSTILE_SECRET  Cloudflare Turnstile gizli anahtarı
//   IZINLI_ORIGINLER  virgülle ayrılmış origin listesi
//   IP_SALT           veritabanındaki tuz yerine kullanılacak tuz
// ══════════════════════════════════════════════════════════

import { createClient } from 'jsr:@supabase/supabase-js@2';

const VARSAYILAN_ORIGINLER = [
    'https://bogazicibilisimodulleri.com',
    'https://www.bogazicibilisimodulleri.com',
    'http://localhost:5500',
    'http://127.0.0.1:5500',
    'http://localhost:8733',
    'http://127.0.0.1:8733',
];

function izinliOriginler(): string[] {
    const ek = Deno.env.get('IZINLI_ORIGINLER');
    return ek ? ek.split(',').map((s) => s.trim()).filter(Boolean) : VARSAYILAN_ORIGINLER;
}

function corsBasliklari(origin: string | null): Record<string, string> {
    const izinli = izinliOriginler();
    const secilen = origin && izinli.includes(origin) ? origin : izinli[0];
    return {
        'Access-Control-Allow-Origin': secilen,
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Vary': 'Origin',
    };
}

async function sha256(metin: string): Promise<string> {
    const ozet = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(metin));
    return Array.from(new Uint8Array(ozet)).map((b) => b.toString(16).padStart(2, '0')).join('');
}

function istemciIp(req: Request): string {
    const xff = req.headers.get('x-forwarded-for');
    if (xff) return xff.split(',')[0].trim();
    return req.headers.get('cf-connecting-ip') ?? 'bilinmiyor';
}

async function turnstileDogrula(token: string | undefined, ip: string): Promise<boolean> {
    const gizli = Deno.env.get('TURNSTILE_SECRET');
    if (!gizli) return true; // Turnstile kurulmamışsa kontrolü atla
    if (!token) return false;

    const govde = new FormData();
    govde.append('secret', gizli);
    govde.append('response', token);
    govde.append('remoteip', ip);

    try {
        const cevap = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
            method: 'POST',
            body: govde,
        });
        const sonuc = await cevap.json();
        return sonuc.success === true;
    } catch (_e) {
        return false;
    }
}

function yanit(govde: unknown, durum: number, origin: string | null): Response {
    return new Response(JSON.stringify(govde), {
        status: durum,
        headers: { ...corsBasliklari(origin), 'Content-Type': 'application/json' },
    });
}

Deno.serve(async (req: Request) => {
    const origin = req.headers.get('origin');

    if (req.method === 'OPTIONS') return new Response('ok', { headers: corsBasliklari(origin) });
    if (req.method !== 'POST') return yanit({ ok: false, hata: 'yontem_desteklenmiyor' }, 405, origin);

    let govde: {
        cihazId?: string;
        oylar?: Record<string, string>;
        turnstileToken?: string;
        ekran?: string;
        jeton?: string;
    };
    try {
        govde = await req.json();
    } catch (_e) {
        return yanit({ ok: false, hata: 'gecersiz_istek' }, 400, origin);
    }

    const cihazId = (govde.cihazId ?? '').toString().trim();
    const oylar = govde.oylar;

    if (!cihazId || cihazId.length < 8 || cihazId.length > 128) {
        return yanit({ ok: false, hata: 'gecersiz_cihaz' }, 400, origin);
    }
    if (!oylar || typeof oylar !== 'object' || Array.isArray(oylar)) {
        return yanit({ ok: false, hata: 'gecersiz_istek' }, 400, origin);
    }

    const anahtarlar = Object.keys(oylar);
    if (anahtarlar.length === 0 || anahtarlar.length > 60) {
        return yanit({ ok: false, hata: 'gecersiz_istek' }, 400, origin);
    }
    for (const k of anahtarlar) {
        const v = oylar[k];
        if (typeof v !== 'string' || v.length === 0 || v.length > 120 || k.length > 60) {
            return yanit({ ok: false, hata: 'gecersiz_istek' }, 400, origin);
        }
    }

    const ip = istemciIp(req);

    if (!(await turnstileDogrula(govde.turnstileToken, ip))) {
        return yanit({ ok: false, hata: 'bot_dogrulamasi_basarisiz' }, 403, origin);
    }

    const supabase = createClient(
        Deno.env.get('SUPABASE_URL')!,
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
        { auth: { persistSession: false } },
    );

    // Tuz: önce ortam değişkeni, yoksa veritabanındaki kalıcı tuz
    let tuz = Deno.env.get('IP_SALT');
    if (!tuz) {
        const { data } = await supabase.from('ayarlar').select('deger').eq('anahtar', 'ip_tuzu').single();
        tuz = (data?.deger as string) ?? '';
    }
    if (!tuz) {
        console.error('ip_tuzu bulunamadı');
        return yanit({ ok: false, hata: 'sunucu_yapilandirmasi' }, 500, origin);
    }

    const ipHash = await sha256(ip + '|' + tuz);

    const { data, error } = await supabase.rpc('oy_kaydet', {
        p_cihaz_id: cihazId,
        p_ip_hash: ipHash,
        p_user_agent: req.headers.get('user-agent') ?? '',
        p_ekran: (govde.ekran ?? '').toString().slice(0, 40),
        p_oylar: oylar,
        p_jeton: (govde.jeton ?? '').toString().slice(0, 120),
    });

    if (error) {
        console.error('oy_kaydet hatası:', error.message);
        return yanit({ ok: false, hata: 'kayit_hatasi' }, 500, origin);
    }

    const sonuc = data as { ok: boolean; hata?: string };
    return yanit(sonuc, sonuc.ok ? 200 : 409, origin);
});
