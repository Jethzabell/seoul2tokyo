export const descriptions = {
  tokyo_s_shibuya_crossing: 'World\'s busiest scramble crossing + loyal Hachiko',
  tokyo_s_pokemon_shibuya: 'Explore Pokémon heaven in Shibuya PARCO',
  tokyo_s_harajuku: 'Colorful fashion street & kawaii culture',
  tokyo_s_meiji: 'Serene Shinto shrine in a lush forest',
  tokyo_s_sensoji: 'Tokyo\'s oldest temple with iconic Kaminarimon gate',
  tokyo_s_monkeykart: 'Race through Tokyo streets in a go-kart',
  tokyo_s_akihabara: 'Anime, manga, and electronics paradise',
  tokyo_s_uniqlo_akiba: 'Japan-exclusive finds & iconic basics',
  tokyo_s_fuji: 'Iconic Mt. Fuji & Chureito Pagoda views',
  tokyo_s_teamlab: 'Immersive digital art you walk through & touch',
  kyoto_arrive: 'Shinkansen from Tokyo — temple city awaits',
  kyoto_nishiki_snack: 'Quick bites at Kyoto\'s 400-year-old food market',
  kyoto_kiyomizudera: 'One of Japan\'s best sunset spots',
  kyoto_sannenzaka: 'Historic stone-paved slopes with traditional shops',
  kyoto_yasaka_pagoda: 'Iconic five-story pagoda photo spot',
  kyoto_gion_stroll: 'Evening walk through the geisha district',
  kyoto_tea: 'Sip matcha dressed in a beautiful kimono',
  kyoto_nishiki: 'Kyoto\'s kitchen — 400 years of street food',
  kyoto_gion: 'Geisha district with traditional wooden machiya',
  kyoto_hanamikoji: 'Atmospheric stone-paved street in Gion',
  kyoto_fushimi: 'Thousands of vermillion torii gates',
  kyoto_samurai: 'Step into the way of the samurai & ninja',
  kyoto_arashiyama: 'Towering bamboo forest walk',
  osaka_dotonbori_arrival: 'Neon-lit canal district — Osaka\'s food capital',
  osaka_castle: 'Historic castle with panoramic city views',
  osaka_pokemon: 'Find rare merch in the heart of Osaka',
  osaka_karaoke: 'Belt your favorites in a private room',
  osaka_soparro: 'Intimate craft cocktail bar',
  osaka_ramen: 'Hand-craft your own bowl from scratch',
  osaka_kobe: 'World-famous wagyu just 30 min from Osaka',
  osaka_kuromon: 'Fresh seafood market — Osaka\'s kitchen',
  tokyo_n_gyoen: 'Serene national garden — your calm reset before the city rush',
  tokyo_n_ginza: 'Upscale shopping district with flagship stores',
  tokyo_n_uniqlo_ginza: 'UNIQLO\'s 12-floor flagship store',
  tokyo_n_pokemon_mega: 'The biggest Pokémon store in Japan',
  tokyo_n_omoide: 'Cozy lantern-lit yakitori alley',
  tokyo_n_bar_centifolia: 'Hidden Shinjuku speakeasy with chic drinks',
};

/** Returns an icon key string based on activity id / category */
export function getIconKey(id, category) {
  if (id.includes('pokemon')) return 'pokeball';
  if (id.includes('ramen') || id.includes('omoide') || id.includes('kobe') || id.includes('kuromon') || id.includes('nishiki')) return 'food';
  if (id.includes('tea') || id.includes('kimono')) return 'tea';
  if (id.includes('bar') || id.includes('zest') || id.includes('soparro') || id.includes('karaoke')) return 'nightlife';
  if (id.includes('fuji') || id.includes('sengen') || id.includes('samurai')) return 'pagoda';
  if (id.includes('fushimi') || id.includes('meiji') || id.includes('sensoji')) return 'torii';
  if (id.includes('kiyomizu')) return 'torii';
  if (id.includes('yasaka') || id.includes('sannenzaka')) return 'pagoda';
  if (id.includes('gion')) return 'pin';
  if (id.includes('arashiyama')) return 'bamboo';
  if (id.includes('kart')) return 'kart';
  if (id.includes('gyoen')) return 'sightseeing';
  if (id.includes('ginza') || id.includes('uniqlo') || id.includes('akihabara') || id.includes('harajuku')) return 'shopping';
  if (id.includes('teamlab')) return 'sightseeing';
  if (id.includes('shibuya_crossing')) return 'sightseeing';
  const cat = (category || '').toLowerCase();
  if (cat.includes('food')) return 'food';
  if (cat.includes('nightlife')) return 'nightlife';
  if (cat.includes('cultural')) return 'tea';
  if (cat.includes('shopping')) return 'shopping';
  if (cat.includes('museum')) return 'pagoda';
  if (cat.includes('sightseeing')) return 'sightseeing';
  return 'pin';
}

export const cityOrder = ['city_tokyo_shibuya', 'city_kyoto', 'city_osaka', 'city_tokyo_shinjuku'];
