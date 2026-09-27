export const descriptions = {
  tokyo_s_shibuya_crossing: 'World\'s busiest scramble crossing + loyal Hachiko',
  tokyo_s_pokemon_shibuya: 'Explore Pokémon heaven in Shibuya PARCO',
  tokyo_s_harajuku: 'Colorful fashion street & kawaii culture',
  tokyo_s_meiji: 'Serene Shinto shrine in a lush forest',
  tokyo_s_sensoji: 'Tokyo\'s oldest temple with iconic Kaminarimon gate',
  tokyo_s_asakusa_lunch: 'Flexible lunch near Senso-ji before heading to Ueno',
  tokyo_s_hotel_dropoff_rest_day3: 'Drop things off, refresh, and rest before dinner',
  tokyo_s_gotanda_dinner_tbd: 'Quick dinner near Monkey Kart — restaurant TBD',
  tokyo_s_monkeykart: 'Race through Tokyo streets in a go-kart',
  tokyo_s_akihabara: 'Anime, manga, and electronics paradise',
  tokyo_s_uniqlo_akiba: 'Japan-exclusive finds & iconic basics',
  tokyo_s_akiba_lunch: 'Flexible lunch break before more Akihabara shopping',
  tokyo_s_fuji: 'Iconic Mt. Fuji & Chureito Pagoda views',
  tokyo_s_teamlab: 'Immersive digital art you walk through & touch',
  tokyo_s_train_kyoto: 'Transfer to Tokyo Station and board the Shinkansen to Kyoto',
  kyoto_arrive: 'Shinkansen from Tokyo — temple city awaits',
  kyoto_nishiki_snack: 'Quick bites at Kyoto\'s 400-year-old food market',
  kyoto_kiyomizudera: 'One of Japan\'s best sunset spots',
  kyoto_sannenzaka: 'Historic stone-paved slopes with traditional shops',
  kyoto_yasaka_pagoda: 'Iconic five-story pagoda photo spot',
  kyoto_gion_stroll: 'Evening walk through the geisha district',
  kyoto_hotel_dropoff_rest_day1: 'Return to the hotel, refresh, and reset before dinner',
  kyoto_tea: 'Sip matcha dressed in a beautiful kimono',
  kyoto_nishiki: 'Kyoto\'s kitchen — 400 years of street food',
  kyoto_hotel_dropoff_day2: 'Quick hotel stop to drop things off before Gion',
  kyoto_gion: 'Geisha district with traditional wooden machiya',
  kyoto_hanamikoji: 'Atmospheric stone-paved street in Gion',
  kyoto_gion_dinner_tbd: 'Flexible dinner near Gion or Pontocho',
  kyoto_hotel_dropoff_reset_day2: 'Return to the hotel and reset before the early morning',
  kyoto_fushimi: 'Thousands of vermillion torii gates',
  kyoto_samurai: 'Step into the way of the samurai & ninja',
  kyoto_arashiyama: 'Towering bamboo forest walk',
  kyoto_day3_lunch_tbd: 'Flexible lunch after Arashiyama',
  kyoto_hotel_dropoff_rest_day3: 'Return to the hotel, refresh, and rest before teamLab',
  kyoto_teamlab_evening_open: 'Keep the evening flexible after teamLab',
  osaka_dotonbori_arrival: 'Neon-lit canal district — Osaka\'s food capital',
  osaka_umeda_dinner: 'Hotel dinner — wagyu or buffet',
  osaka_umeda_explore: 'Grand Front Osaka, Osaka Station City, and Yodobashi Umeda',
  osaka_hotel_dropoff_rest_day2: 'Drop things off, rest, and freshen up before dinner',
  osaka_castle: 'Historic castle with panoramic city views',
  osaka_pokemon: 'Find rare merch in the heart of Osaka',
  osaka_karaoke: 'Belt your favorites in a private room',
  osaka_soparro: 'Intimate craft cocktail bar',
  osaka_day3_breakfast_tbd: 'Light breakfast near the hotel before the cooking class',
  osaka_ramen: 'Hand-craft your own bowl from scratch',
  osaka_kobe: 'Booked wagyu dinner in LINKS UMEDA',
  osaka_kuromon: 'Fresh seafood market — Osaka\'s kitchen',
  tokyo_n_gyoen: 'Serene national garden — your calm reset before the city rush',
  tokyo_n_hotel_checkin: 'Two confirmed rooms at HOTEL AMANEK Shinjuku Kabukicho',
  tokyo_n_open_evening_day1: 'Explore Shinjuku Golden-Gai after check-in — dinner remains flexible',
  tokyo_n_teamlab_planets: 'Immersive digital art experience in Toyosu',
  tokyo_n_toyosu_lunch: 'Flexible lunch near teamLab Planets — restaurant TBD',
  tokyo_n_uniqlo_tokyo: 'Four-floor global flagship in Ginza',
  tokyo_n_nakano_broadway: 'Anime, manga, retro toys, and collectible hunting',
  tokyo_n_ginza: 'Upscale shopping district with flagship stores',
  tokyo_n_uniqlo_ginza: 'UNIQLO\'s 12-floor flagship store',
  tokyo_n_hotel_dropoff_rest_day2: 'Drop off shopping bags and rest before dinner',
  tokyo_n_open_evening_day2: 'Flexible dinner and free evening after returning to the hotel',
  tokyo_n_hotel_dropoff_rest_day3: 'Drop off shopping bags and rest before the evening in Shinjuku',
  tokyo_n_onitsuka_shinjuku: 'Japanese sneakers and heritage styles at Lumine Est Shinjuku',
  tokyo_n_pokemon_mega: 'The biggest Pokémon store in Japan',
  tokyo_s_ikebukuro_dinner_tbd: 'Flexible dinner in Ikebukuro — restaurant TBD',
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
