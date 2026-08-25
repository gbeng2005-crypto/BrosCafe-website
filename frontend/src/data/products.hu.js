// Hungarian copy overrides for the product catalog.
export const HU = {
  espresso: {
    desc: "Rövid, sötét, őszinte. Ezzel mérünk egy kávézót — magunkat is.",
    tip: "A pultnál állva a legjobb, olasz módra.",
    ingredients: ["18g Bros keverék", "Víz, 93°C", "27 másodperc"],
    behind: ["Bab — brazil + etióp keverékünk", "Őrlés — finom, 18g adag", "Extrakció — 27 lassú másodperc", "A csészéd — mindig előmelegítve"],
    sizes: ["Szimpla", "Dupla"],
  },
  cappuccino: {
    desc: "Karakteres espresso, selymesen gőzölt tejjel és rendes habbal.",
    tip: "Lassan a legjobb. Ha úgy szereted, kérd zabbal.",
    ingredients: ["Dupla espresso", "Gőzölt tej", "Sűrű mikrohab"],
    behind: ["Bab — brazil + etióp keverék", "Espresso — dupla shot", "Tej — 60°C-ra gőzölve", "Hab — kanalazva, nem öntve"],
    sizes: ["Normál", "Nagy"],
  },
  latte: {
    desc: "Tej, rendesen megcsinálva. Lágy, meleg, gyengéden koffeines.",
    tip: "Tökéletes egy lassú reggelhez és egy ablak melletti helyhez.",
    ingredients: ["Dupla espresso", "Sok gőzölt tej", "Latte art, ha nincs rohanás"],
    behind: ["Bab — brazil + etióp keverék", "Espresso — dupla shot", "Tej — selymes, fényes gőzölés", "Az öntés — itt történik a varázslat"],
    sizes: ["Normál", "Nagy"],
  },
  americano: {
    desc: "Tiszta és lassú. Hosszított espresso, ép ízzel.",
    tip: "Feketén remek. Tíz csendes perccel még jobb.",
    ingredients: ["Dupla espresso", "Forró víz"],
    behind: ["Bab — brazil + etióp keverék", "Espresso — dupla shot", "Víz — forrón, óvatosan öntve", "Crema — a tetején marad"],
    sizes: ["Normál", "Nagy"],
  },
  "cold-brew": {
    desc: "18 órát ázott. Sima, csokis, veszélyesen iható.",
    tip: "Kérj hozzá egy szelet narancsot, ha frissen szereted.",
    ingredients: ["Durvára őrölt Bros keverék", "Hideg víz", "Idő — 18 óra"],
    sizes: ["Normál", "Nagy"],
  },
  "iced-latte": {
    desc: "Espresso jégen, hideg tej a tetején. Nyár egy pohárban.",
    tip: "Nézd, ahogy márványosodik, mielőtt megkevered. Ez a fele élmény.",
    ingredients: ["Dupla espresso", "Jég", "Hideg tej"],
    sizes: ["Normál", "Nagy"],
  },
  "espresso-tonic": {
    desc: "Rossznak hangzik, finom. Dupla shot tonic és jég felett.",
    tip: "A legtöbbet vitatott italunk. Kóstold meg, mielőtt ítélkezel.",
    ingredients: ["Dupla espresso", "Tonic", "Jég", "Narancshéj"],
    sizes: ["Egy méret"],
  },
  "bros-sandwich": {
    desc: "Pirított kovászos kenyér, lassan készült töltelék, rendelésre frissen.",
    tip: "A szósz receptje titok. Hiába próbáltuk kiszedni belőlük.",
    ingredients: ["Kovászos kenyér", "A nap lassú tölteléke", "Zöldek", "Házi szósz"],
    sizes: ["Egy méret"],
  },
  "cinnamon-waffles": {
    desc: "Kívül ropogós, belül puha, a juharszirup teszi a dolgát.",
    tip: "A hétvégi reggelek ezért lettek kitalálva.",
    ingredients: ["Írós tészta", "Vaj", "Juharszirup", "Bogyós gyümölcsök"],
    sizes: ["Fél adag", "Egész"],
  },
  croissant: {
    desc: "Rétegzett, aranybarna, és a legtöbb nap tizenegyre elfogy.",
    tip: "Melegítsd meg. Később megköszönöd.",
    ingredients: ["Liszt", "Sok vaj", "Idő", "Türelem"],
    sizes: ["Egy méret"],
  },
  "banana-bread": {
    desc: "Sűrű, pirítós, épp elég édes. Bros klasszikus.",
    tip: "Pirítva, egy kevés sózott vajjal. Bízz bennünk.",
    ingredients: ["Túlérett banán", "Barna vaj", "Dió"],
    sizes: ["Szelet", "Két szelet (nem ítélkezünk)"],
  },
  "brownie-sundae": {
    desc: "Meleg brownie, hideg fagyi, csoki mindenhol.",
    tip: "Oszd meg. Vagy ne. Nem nézünk oda.",
    ingredients: ["Dupla csokis brownie", "Vanílafagyi", "Meleg csokiszósz"],
    sizes: ["Egy méret"],
  },
  "bros-tee": {
    desc: "Nehéz pamut, kis logó, krém olíva alapon. Gyönyörűen kopik.",
    tip: "Vegyél egy számmal nagyobbat a laza kávézós fazonhoz.",
    material: "100% bio nehéz pamut, 240g/m²",
  },
  "bros-hoodie": {
    desc: "Ezért veszekszik a csapat. Belül bolyhozott, boxy fazon.",
    tip: "Az egyik kedvencünk. Minden dropból elfogy.",
    material: "Bolyhozott polár, 400g/m², hímzett logó",
  },
  "bros-mug": {
    desc: "Pöttyös kőedény, otthoni lassú reggelekre.",
    tip: "Gyanúsan jól passzol a kávébabunkhoz.",
    material: "Kézzel mázazott kőedény, mosogatógépben mosható",
    sizes: ["350ml"],
  },
  "bros-beans": {
    desc: "Pontosan az a keverék, amit mi is szervírozunk. Brazília + Etiópia, a közelben pörkölve.",
    tip: "Kérd meg, hogy a gépedre őröljük. Együtt hangoljuk be.",
    ingredients: ["70% Brazília", "30% Etiópia", "Hetente pörkölve"],
    sizes: ["Egész bab", "Espressóhoz őrölve", "Filterhez őrölve"],
  },
};

// Localize a product for the given language (HU overrides fall back to EN fields).
export function lp(product, lang) {
  if (!product || lang !== "hu") return product;
  const h = HU[product.id];
  return h ? { ...product, ...h } : product;
}
