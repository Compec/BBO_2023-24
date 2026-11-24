// ══════════════════════════════════════════════════════════
// COMPEC BİLİŞİM ÖDÜLLERİ — OY JETONU ÜRETME UÇ NOKTASI
// ══════════════════════════════════════════════════════════
// Oylama sayfası açıldığında buradan tek kullanımlık bir jeton alır.
// Jeton; isteği yapan IP'ye bağlıdır, tek kullanımlıktır ve oy
// gönderilirken en az 20 saniye "beklemiş" olmalıdır.
//
// Amaç: tek bir HTTP isteğiyle toplu oy basmayı imkânsız kılmak.
// Bir botun her oy için ayrı jeton alıp beklemesi, ayrıca cihaz ve
// IP limitlerini aşması gerekir.
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

Deno.serve(async (req: Request) => {
    const origin = req.headers.get('origin');
    const cors = corsBasliklari(origin);

    if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });
    if (req.method !== 'POST') {
        return new Response(JSON.stringify({ ok: false, hata: 'yontem_desteklenmiyor' }), {
            status: 405,
            headers: { ...cors, 'Content-Type': 'application/json' },
        });
    }

    const supabase = createClient(
        Deno.env.get('SUPABASE_URL')!,
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
        { auth: { persistSession: false } },
    );

    let tuz = Deno.env.get('IP_SALT');
    if (!tuz) {
        const { data } = await supabase.from('ayarlar').select('deger').eq('anahtar', 'ip_tuzu').single();
        tuz = (data?.deger as string) ?? '';
    }
    if (!tuz) {
        return new Response(JSON.stringify({ ok: false, hata: 'sunucu_yapilandirmasi' }), {
            status: 500,
            headers: { ...cors, 'Content-Type': 'application/json' },
        });
    }

    const ipHash = await sha256(istemciIp(req) + '|' + tuz);
    const { data, error } = await supabase.rpc('jeton_uret', { p_ip_hash: ipHash });

    if (error) {
        console.error('jeton_uret hatasi:', error.message);
        return new Response(JSON.stringify({ ok: false, hata: 'jeton_uretilemedi' }), {
            status: 500,
            headers: { ...cors, 'Content-Type': 'application/json' },
        });
    }

    const sonuc = data as { ok: boolean };
    return new Response(JSON.stringify(sonuc), {
        status: sonuc.ok ? 200 : 429,
        headers: { ...cors, 'Content-Type': 'application/json' },
    });
});
