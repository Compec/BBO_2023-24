// ══════════════════════════════════════════════════════════
// COMPEC BİLİŞİM ÖDÜLLERİ — SONUÇ OKUMA UÇ NOKTASI (YÖNETİCİ)
// ══════════════════════════════════════════════════════════
// Sonuçlar oylama sürerken herkese açık değildir. Bu uç nokta
// "x-admin-key" başlığında yönetici anahtarını bekler.
//
// Anahtarın SHA-256 özeti veritabanındaki ayarlar tablosunda
// (admin_anahtar_hash) tutulur; anahtarın kendisi hiçbir yerde saklanmaz.
// Değiştirmek için SQL Editor'de:
//     select public.admin_anahtari_belirle('yeni-parola');
//
// İsteğe bağlı: ADMIN_KEY ortam değişkeni tanımlanırsa o kullanılır.
// ══════════════════════════════════════════════════════════

import { createClient } from 'jsr:@supabase/supabase-js@2';

const CORS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-admin-key',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
};

function json(govde: unknown, durum = 200): Response {
    return new Response(JSON.stringify(govde), {
        status: durum,
        headers: { ...CORS, 'Content-Type': 'application/json' },
    });
}

async function sha256(metin: string): Promise<string> {
    const ozet = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(metin));
    return Array.from(new Uint8Array(ozet)).map((b) => b.toString(16).padStart(2, '0')).join('');
}

/** Zamanlama saldırılarına karşı sabit süreli karşılaştırma. */
function esitMi(a: string, b: string): boolean {
    if (a.length !== b.length || a.length === 0) return false;
    let fark = 0;
    for (let i = 0; i < a.length; i++) fark |= a.charCodeAt(i) ^ b.charCodeAt(i);
    return fark === 0;
}

function istemciIp(req: Request): string {
    const xff = req.headers.get('x-forwarded-for');
    if (xff) return xff.split(',')[0].trim();
    return req.headers.get('cf-connecting-ip') ?? 'bilinmiyor';
}

Deno.serve(async (req: Request) => {
    if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS });

    const gelen = req.headers.get('x-admin-key') ?? '';
    if (!gelen) return json({ ok: false, hata: 'yetkisiz' }, 401);

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
    if (!tuz) return json({ ok: false, hata: 'sunucu_yapilandirmasi' }, 500);

    // Sınır anahtar kontrolünden önce uygulanır; kilitliyken doğru anahtar da 429 alır.
    // Aksi halde 401/200 farkı deneme sınırını anlamsız kılardı.
    // 'admin|' öneki, bu özetin oy pusulalarındaki ip_hash ile eşleştirilmesini engeller.
    const ipHash = await sha256('admin|' + istemciIp(req) + '|' + tuz);
    const deneme = await supabase.rpc('admin_deneme_kaydet', { p_ip_hash: ipHash });
    if (deneme.error) {
        console.error('admin_deneme_kaydet hatası:', deneme.error.message);
        return json({ ok: false, hata: 'sunucu_yapilandirmasi' }, 500);
    }
    if (deneme.data !== true) return json({ ok: false, hata: 'cok_fazla_deneme' }, 429);

    const ortamAnahtari = Deno.env.get('ADMIN_KEY');
    let gecerli = false;

    if (ortamAnahtari) {
        gecerli = esitMi(gelen, ortamAnahtari);
    } else {
        const { data } = await supabase.from('ayarlar').select('deger')
            .eq('anahtar', 'admin_anahtar_hash').single();
        const beklenenHash = (data?.deger as string) ?? '';
        if (!beklenenHash) return json({ ok: false, hata: 'admin_anahtari_tanimli_degil' }, 500);
        gecerli = esitMi(await sha256(gelen), beklenenHash);
    }

    if (!gecerli) return json({ ok: false, hata: 'yetkisiz' }, 401);

    await supabase.from('admin_denemeleri').delete().eq('ip_hash', ipHash);

    const [sonuclar, ozet] = await Promise.all([
        supabase.from('sonuclar').select('*'),
        supabase.from('oylama_ozeti').select('*').single(),
    ]);

    if (sonuclar.error || ozet.error) {
        console.error(sonuclar.error?.message ?? ozet.error?.message);
        return json({ ok: false, hata: 'sorgu_hatasi' }, 500);
    }

    return json({ ok: true, ozet: ozet.data, sonuclar: sonuclar.data });
});
