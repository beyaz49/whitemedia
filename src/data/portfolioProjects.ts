export type ProjectMedia = {
  src: string;
  poster: string;
  title: string;
};

export type PortfolioProject = {
  index: string;
  slug: string;
  name: string;
  category: string;
  summary: string;
  services: string[];
  logo?: string;
  logoAlt: string;
  logoShape: "wide" | "square";
  logoTreatment: "dark" | "light" | "on-dark";
  panel: "dark" | "light";
  media: ProjectMedia[];
};

const video = (clip: number, title: string): ProjectMedia => ({
  src: `/videos/clip-${clip}.mp4`,
  poster: `/work/posters/clip-${clip}.webp`,
  title,
});

export const portfolioProjects: PortfolioProject[] = [
  {
    index: "01",
    slug: "medicalpark",
    name: "Medical Park Yıldızlı",
    category: "Sağlık · Kurumsal İçerik",
    summary:
      "Medical Park Yıldızlı'nın kurumsal tanıtımını ve uzman görüşlerini, güven veren sağlık iletişimi içeriklerine dönüştürdük.",
    services: ["Reels prodüksiyonu", "Sosyal medya içeriği", "Kurgu & post prodüksiyon"],
    logo: "/logos/medicalpark.webp",
    logoAlt: "Medical Park Yıldızlı Hastanesi logosu",
    logoShape: "wide",
    logoTreatment: "light",
    panel: "dark",
    media: [
      {
        src: "/work/medicalpark-yildizli/hastane-tanitim-filmi.mp4",
        poster: "/work/medicalpark-yildizli/hastane-tanitim-filmi.webp",
        title: "Medical Park Yıldızlı Hastanesi tanıtım filmi",
      },
      {
        src: "/work/medicalpark-yildizli/can-kece-cerrahi-onkoloji.mp4",
        poster: "/work/medicalpark-yildizli/can-kece-cerrahi-onkoloji.webp",
        title: "Prof. Dr. Can Keçe — Cerrahi onkolojinin önemi",
      },
      {
        src: "/work/medicalpark-yildizli/tugce-turkcan-goz-kapagi.mp4",
        poster: "/work/medicalpark-yildizli/tugce-turkcan-goz-kapagi.webp",
        title: "Op. Dr. Tuğçe Türkcan Soğuksulu — Göz kapağı sarkması",
      },
    ],
  },
  {
    index: "02",
    slug: "yamanlar-oto-ekspertiz",
    name: "Yamanlar Oto Ekspertiz",
    category: "Oto Ekspertiz · Reklam",
    summary:
      "Ekspertiz hizmetlerini açık, güvenilir ve satış odaklı bir dille anlatan dijital içerik çalışmaları hazırladık.",
    services: ["Reklam kreatifleri", "Sosyal medya yönetimi", "İçerik prodüksiyonu"],
    logo: "/logos/yamanlar-oto-ekspertiz.webp",
    logoAlt: "Yamanlar Bağımsız Oto Ekspertiz logosu",
    logoShape: "wide",
    logoTreatment: "dark",
    panel: "light",
    media: [
      {
        src: "/work/yamanlar-oto-ekspertiz/salihli-sube-acilisi.mp4",
        poster: "/work/yamanlar-oto-ekspertiz/salihli-sube-acilisi.webp",
        title: "Salihli şubesi açılış filmi",
      },
      {
        src: "/work/yamanlar-oto-ekspertiz/izmir-subeler-lokasyon.mp4",
        poster: "/work/yamanlar-oto-ekspertiz/izmir-subeler-lokasyon.webp",
        title: "İzmir şubeleri drone lokasyon tanıtımı",
      },
    ],
  },
  {
    index: "03",
    slug: "trabzon-universitesi",
    name: "Trabzon Üniversitesi",
    category: "Eğitim · İçerik",
    summary:
      "Üniversitenin iletişim ihtiyaçlarına uygun, kurumsal çizgiyi koruyan dijital içerik ve prodüksiyon çalışmaları ürettik.",
    services: ["Kurumsal içerik", "Video prodüksiyon", "Sosyal medya iletişimi"],
    logo: "/logos/trabzon-universitesi.png",
    logoAlt: "Trabzon Üniversitesi logosu",
    logoShape: "wide",
    logoTreatment: "light",
    panel: "dark",
    media: [
      {
        src: "/work/trabzon-universitesi/iletisim-fakultesi-tanitim.mp4",
        poster: "/work/trabzon-universitesi/iletisim-fakultesi-tanitim.webp",
        title: "İletişim Fakültesi tanıtım filmi",
      },
    ],
  },
  {
    index: "21",
    slug: "kd-katik-doner",
    name: "KD Katık Döner",
    category: "Yeme İçme · Çok Şubeli Prodüksiyon",
    summary:
      "KD Katık Döner'in 6 şubesi için ürün hazırlığı, mekân ve servis deneyimini anlatan dikey video içerikleri ürettik.",
    services: ["6 şube için video çekimi", "Ürün & mutfak prodüksiyonu", "Reels, kurgu & renk"],
    logo: "/logos/kd-katik-doner.svg",
    logoAlt: "KD Katık Döner logosu",
    logoShape: "square",
    logoTreatment: "dark",
    panel: "dark",
    media: [
      {
        src: "/work/kd-katik-doner/pelitli-sube-tanitimi.mp4",
        poster: "/work/kd-katik-doner/pelitli-sube-tanitimi.webp",
        title: "Pelitli şubesi — Mekân ve lezzet filmi",
      },
      {
        src: "/work/kd-katik-doner/meydan-sube-tanitimi.mp4",
        poster: "/work/kd-katik-doner/meydan-sube-tanitimi.webp",
        title: "Meydan şubesi — Ürün hazırlığı",
      },
      {
        src: "/work/kd-katik-doner/rize-sube-tanitimi.mp4",
        poster: "/work/kd-katik-doner/rize-sube-tanitimi.webp",
        title: "Rize şubesi — Mutfaktan sunuma",
      },
      {
        src: "/work/kd-katik-doner/sogutlu-sube-tanitimi.mp4",
        poster: "/work/kd-katik-doner/sogutlu-sube-tanitimi.webp",
        title: "Söğütlü şubesi — Ürün sunumu",
      },
      {
        src: "/work/kd-katik-doner/of-sube-tanitimi.mp4",
        poster: "/work/kd-katik-doner/of-sube-tanitimi.webp",
        title: "Of şubesi — Reels filmi",
      },
      {
        src: "/work/kd-katik-doner/arakli-sube-tanitimi.mp4",
        poster: "/work/kd-katik-doner/arakli-sube-tanitimi.webp",
        title: "Araklı şubesi — Reels filmi",
      },
      {
        src: "/work/kd-katik-doner/urun-tanitim-filmi.mp4",
        poster: "/work/kd-katik-doner/urun-tanitim-filmi.webp",
        title: "KD Katık Döner — Mutfak ve ekip filmi",
      },
    ],
  },
  {
    index: "20",
    slug: "ozen-optik",
    name: "Özen Optik",
    category: "Optik · Perakende",
    summary:
      "Özen Optik'in mağazasını, gözlük koleksiyonunu ve ürün inceleme deneyimini iki ayrı dikey tanıtım filmiyle anlattık.",
    services: ["Mağaza & ürün çekimi", "Reels prodüksiyonu", "Kurgu & renk"],
    logo: "/logos/ozen-optik.svg",
    logoAlt: "Özen Optik Lens logosu",
    logoShape: "wide",
    logoTreatment: "dark",
    panel: "dark",
    media: [
      {
        src: "/work/ozen-optik/kisa-tanitim-filmi.mp4",
        poster: "/work/ozen-optik/kisa-tanitim-filmi.webp",
        title: "Özen Optik kısa tanıtım filmi",
      },
      {
        src: "/work/ozen-optik/magaza-ve-urun-tanitimi.mp4",
        poster: "/work/ozen-optik/magaza-ve-urun-tanitimi.webp",
        title: "Özen Optik mağaza ve ürün tanıtımı",
      },
    ],
  },
  {
    index: "04",
    slug: "maziden-atiye-puruthana",
    name: "Bayburt Puruthana",
    category: "Marka · Sosyal Medya",
    summary:
      "Geleneksel üretim hikâyesini yakın plan detaylar ve anlatı odaklı dikey videolarla sosyal medyaya taşıdık.",
    services: ["Reels prodüksiyonu", "Hikâye anlatımı", "Kurgu & altyazı"],
    logo: "/logos/maziden-atiye-puruthana.png",
    logoAlt: "Bayburt Puruthana logosu",
    logoShape: "square",
    logoTreatment: "on-dark",
    panel: "dark",
    media: [
      {
        src: "/work/bayburt-puruthana/ustalik-kultur-hikayesi.mp4",
        poster: "/work/bayburt-puruthana/ustalik-kultur-hikayesi.webp",
        title: "Ustalık ve kültür hikâyesi",
      },
      {
        src: "/work/bayburt-puruthana/tandir-guclendirme-sevkiyat.mp4",
        poster: "/work/bayburt-puruthana/tandir-guclendirme-sevkiyat.webp",
        title: "Tandırın güçlendirme ve sevkiyat süreci",
      },
      {
        src: "/work/bayburt-puruthana/loloz-geleneksel-ustalik.mp4",
        poster: "/work/bayburt-puruthana/loloz-geleneksel-ustalik.webp",
        title: "Loloz tekniği ve geleneksel ustalık",
      },
      {
        src: "/work/bayburt-puruthana/geleneksel-tandir-yapimi-belgesel.mp4",
        poster: "/work/bayburt-puruthana/geleneksel-tandir-yapimi-belgesel.webp",
        title: "Geleneksel tandır yapımı — uzun anlatım",
      },
    ],
  },
  {
    index: "05",
    slug: "gursoy-insaat",
    name: "Gürsoy İnşaat",
    category: "İnşaat · Sosyal Medya & Reklam",
    summary:
      "Markanın projelerini, yaşam alanlarını ve yaşam tarzı temasını güçlü görsel anlatımlarla sosyal medya içeriklerine dönüştürdük.",
    services: ["Sosyal medya içeriği", "Reels prodüksiyonu", "Dijital marka iletişimi"],
    logo: "/logos/gursoy-insaat.png",
    logoAlt: "Gürsoy İnşaat logosu",
    logoShape: "wide",
    logoTreatment: "light",
    panel: "dark",
    media: [
      {
        src: "/work/gursoy-insaat/hafta-sonu-aktivitesi.mp4",
        poster: "/work/gursoy-insaat/hafta-sonu-aktivitesi.webp",
        title: "Hangi hafta sonu aktivitesi ruhunu yansıtıyor?",
      },
      {
        src: "/work/gursoy-insaat/evinizi-renklendirmenin-5-yolu-1.mp4",
        poster: "/work/gursoy-insaat/evinizi-renklendirmenin-5-yolu-1.webp",
        title: "Evinizi renklendirmenin 5 kolay yolu — I",
      },
      {
        src: "/work/gursoy-insaat/yasamin-renkleri-burada.mp4",
        poster: "/work/gursoy-insaat/yasamin-renkleri-burada.webp",
        title: "Yaşamın renkleri burada",
      },
      {
        src: "/work/gursoy-insaat/evinizi-renklendirmenin-5-yolu-2.mp4",
        poster: "/work/gursoy-insaat/evinizi-renklendirmenin-5-yolu-2.webp",
        title: "Evinizi renklendirmenin 5 kolay yolu — II",
      },
      {
        src: "/work/gursoy-insaat/yesilin-huzuru-gece-gunduz.mp4",
        poster: "/work/gursoy-insaat/yesilin-huzuru-gece-gunduz.webp",
        title: "Yeşilin huzurunu gece gündüz yaşayın",
      },
    ],
  },
  {
    index: "06",
    slug: "pesent-restaurant",
    name: "Pesent Restaurant",
    category: "Restoran · Prodüksiyon",
    summary:
      "Mekânın sofrasını, mutfağını ve ürün çeşitliliğini iştah açıcı yakın planlarla satış odaklı içeriklere dönüştürdük.",
    services: ["Yemek çekimi", "Reels prodüksiyonu", "Sosyal medya içeriği"],
    logo: "/logos/pesent-restaurant.png",
    logoAlt: "Pesent Restaurant logosu",
    logoShape: "wide",
    logoTreatment: "dark",
    panel: "light",
    media: [
      {
        src: "/work/pesent/pesent-3.mp4",
        poster: "/work/pesent/pesent-3.webp",
        title: "Deniz manzaralı lezzet deneyimi",
      },
      {
        src: "/work/pesent/pesent-6.mp4",
        poster: "/work/pesent/pesent-6.webp",
        title: "Usta dokunuşuyla Adana kebap",
      },
      {
        src: "/work/pesent/pesent-8.mp4",
        poster: "/work/pesent/pesent-8.webp",
        title: "Sahil restoranı drone tanıtımı",
      },
      {
        src: "/work/pesent/pesent-13.mp4",
        poster: "/work/pesent/pesent-13.webp",
        title: "Pide hazırlık süreci",
      },
      {
        src: "/work/pesent/pesent-19.mp4",
        poster: "/work/pesent/pesent-19.webp",
        title: "Mutfaktan masaya servis deneyimi",
      },
      {
        src: "/work/pesent/pesent-20.mp4",
        poster: "/work/pesent/pesent-20.webp",
        title: "Ocakbaşı lezzet hazırlığı",
      },
      {
        src: "/work/pesent/pesent-17.mp4",
        poster: "/work/pesent/pesent-17.webp",
        title: "Lahmacun ve kebap sunumu",
      },
      video(10, "Pide prodüksiyonu"),
    ],
  },
  {
    index: "07",
    slug: "depaul-cafe-restaurant",
    name: "Depaul Cafe&Restaurant",
    category: "Kafe · Restoran",
    summary:
      "Mekân deneyimini, menü ürünlerini ve servis atmosferini sosyal medyada öne çıkaran içerikler hazırladık.",
    services: ["Mekân çekimi", "Ürün prodüksiyonu", "Sosyal medya içeriği"],
    logo: "/logos/depaul.svg",
    logoAlt: "Depaul Cafe & Restaurant logosu",
    logoShape: "wide",
    logoTreatment: "light",
    panel: "dark",
    media: [
      {
        src: "/work/depaul/mini-burger-paul-special-pizza.mp4",
        poster: "/work/depaul/mini-burger-paul-special-pizza.webp",
        title: "Üçlü mini burger ve Paul Special pizza",
      },
      {
        src: "/work/depaul/depaul-konum-tanitimi.mp4",
        poster: "/work/depaul/depaul-konum-tanitimi.webp",
        title: "Depaul Cafe konum tanıtımı",
      },
      {
        src: "/work/depaul/cikolatali-tatli-sunumu.mp4",
        poster: "/work/depaul/cikolatali-tatli-sunumu.webp",
        title: "Çikolatalı tatlı hazırlığı ve sunumu",
      },
      {
        src: "/work/depaul/paul-special-pizza-hazirligi.mp4",
        poster: "/work/depaul/paul-special-pizza-hazirligi.webp",
        title: "Paul Special pizza hazırlığı",
      },
      {
        src: "/work/depaul/ramazan-iftar-menusu.mp4",
        poster: "/work/depaul/ramazan-iftar-menusu.webp",
        title: "Ramazan iftar menüsü tanıtımı",
      },
    ],
  },
  {
    index: "08",
    slug: "the-vera-cafe-restaurant",
    name: "The Vera Cafe & Restaurant",
    category: "Kafe · Restoran",
    summary:
      "The Vera'nın ürünlerini ve mekân atmosferini modern, ritmik ve marka diline uygun dikey içeriklerle anlattık.",
    services: ["Reels prodüksiyonu", "Ürün çekimi", "Kurgu & renk"],
    logo: "/logos/the-vera.png",
    logoAlt: "The Vera Cafe & Restaurant logosu",
    logoShape: "square",
    logoTreatment: "dark",
    panel: "light",
    media: [
      {
        src: "/work/the-vera/ferahlatici-icecek-uclusu.mp4",
        poster: "/work/the-vera/ferahlatici-icecek-uclusu.webp",
        title: "Ferahlatıcı içecek üçlüsü",
      },
      {
        src: "/work/the-vera/orman-meyveli-icecek-sunumu.mp4",
        poster: "/work/the-vera/orman-meyveli-icecek-sunumu.webp",
        title: "Orman meyveli içecek sunumu",
      },
      {
        src: "/work/the-vera/vera-special-bubble-cool-lime-smoothie.mp4",
        poster: "/work/the-vera/vera-special-bubble-cool-lime-smoothie.webp",
        title: "Vera Special Bubble, Cool Lime ve smoothie",
      },
      {
        src: "/work/the-vera/mutfaktan-masaya-makarna.mp4",
        poster: "/work/the-vera/mutfaktan-masaya-makarna.webp",
        title: "Mutfaktan masaya makarna deneyimi",
      },
      {
        src: "/work/the-vera/pizza-ve-icecek-sunumu.mp4",
        poster: "/work/the-vera/pizza-ve-icecek-sunumu.webp",
        title: "Pizza ve içecek sunumu",
      },
      {
        src: "/work/the-vera/serpme-kahvalti-deneyimi.mp4",
        poster: "/work/the-vera/serpme-kahvalti-deneyimi.webp",
        title: "The Vera serpme kahvaltı deneyimi",
      },
      {
        src: "/work/the-vera/meyveli-cikolatali-tatli-hazirligi.mp4",
        poster: "/work/the-vera/meyveli-cikolatali-tatli-hazirligi.webp",
        title: "Meyveli ve çikolatalı tatlı hazırlığı ve sunumu",
      },
      {
        src: "/work/the-vera/lezzet-ve-mekan-tanitimi.mp4",
        poster: "/work/the-vera/lezzet-ve-mekan-tanitimi.webp",
        title: "The Vera lezzet ve mekân tanıtımı",
      },
      {
        src: "/work/the-vera/paket-servis-hazirligi-ve-teslimati.mp4",
        poster: "/work/the-vera/paket-servis-hazirligi-ve-teslimati.webp",
        title: "Paket servis hazırlığı ve teslimatı",
      },
      {
        src: "/work/the-vera/paket-icecek-ve-soguk-kahve-sunumu.mp4",
        poster: "/work/the-vera/paket-icecek-ve-soguk-kahve-sunumu.webp",
        title: "Paket içecek ve soğuk kahve sunumu",
      },
      {
        src: "/work/the-vera/tavuk-durum-hazirligi-ve-sunumu.mp4",
        poster: "/work/the-vera/tavuk-durum-hazirligi-ve-sunumu.webp",
        title: "Tavuk dürüm hazırlığı ve sunumu",
      },
      {
        src: "/work/the-vera/meyveli-cikolatali-tatli-kasesi.mp4",
        poster: "/work/the-vera/meyveli-cikolatali-tatli-kasesi.webp",
        title: "Meyveli çikolatalı tatlı kasesi",
      },
      {
        src: "/work/the-vera/latte-hazirligi-ve-sunumu.mp4",
        poster: "/work/the-vera/latte-hazirligi-ve-sunumu.webp",
        title: "Latte hazırlığı ve sunumu",
      },
      {
        src: "/work/the-vera/cilekli-tatli-hazirligi-ve-sunumu.mp4",
        poster: "/work/the-vera/cilekli-tatli-hazirligi-ve-sunumu.webp",
        title: "Çilekli tatlı hazırlığı ve sunumu",
      },
    ],
  },
  {
    index: "09",
    slug: "dk-gayrimenkul",
    name: "DK Gayrimenkul",
    category: "Gayrimenkul · Danışmanlık",
    summary:
      "Portföyleri konum, kullanım avantajı ve yatırım değerini öne çıkaran drone destekli kısa videolarla sunduk.",
    services: ["Drone çekimi", "Portföy videosu", "Reklam içeriği"],
    logo: "/logos/dk-gayrimenkul.png",
    logoAlt: "DK Gayrimenkul logosu",
    logoShape: "square",
    logoTreatment: "light",
    panel: "dark",
    media: [
      {
        src: "/work/dk-gayrimenkul/dk-26.mp4",
        poster: "/work/dk-gayrimenkul/dk-26.webp",
        title: "Modern müstakil villa tanıtımı",
      },
      {
        src: "/work/dk-gayrimenkul/dk-28.mp4",
        poster: "/work/dk-gayrimenkul/dk-28.webp",
        title: "470 m² kiralık iş yeri",
      },
      {
        src: "/work/dk-gayrimenkul/dk-25.mp4",
        poster: "/work/dk-gayrimenkul/dk-25.webp",
        title: "Mersin Mahallesi 300 m² arsa",
      },
      {
        src: "/work/dk-gayrimenkul/dk-20.mp4",
        poster: "/work/dk-gayrimenkul/dk-20.webp",
        title: "Deniz manzaralı yatırım mülkü",
      },
      {
        src: "/work/dk-gayrimenkul/dk-12.mp4",
        poster: "/work/dk-gayrimenkul/dk-12.webp",
        title: "Sıfır daire ve site yaşamı",
      },
      {
        src: "/work/dk-gayrimenkul/dk-8.mp4",
        poster: "/work/dk-gayrimenkul/dk-8.webp",
        title: "Ana yola yakın müstakil konut",
      },
      {
        src: "/work/dk-gayrimenkul/dk-5.mp4",
        poster: "/work/dk-gayrimenkul/dk-5.webp",
        title: "Gayrimenkul satış danışmanlığı",
      },
    ],
  },
  {
    index: "10",
    slug: "modatepe-resort",
    name: "Modatepe Resort",
    category: "Otel · Turizm",
    summary:
      "Konaklama deneyimini, doğayı ve tesisin öne çıkan alanlarını turizm iletişimine uygun içeriklerle anlattık.",
    services: ["Tesis çekimi", "Drone prodüksiyonu", "Sosyal medya içeriği"],
    logo: "/logos/modatepe-resort.png",
    logoAlt: "Modatepe Resort logosu",
    logoShape: "square",
    logoTreatment: "dark",
    panel: "light",
    media: [
      {
        src: "/work/modatepe-resort/modatepe-11.mp4",
        poster: "/work/modatepe-resort/modatepe-11.webp",
        title: "Doğayla iç içe resort deneyimi",
      },
      {
        src: "/work/modatepe-resort/modatepe-5.mp4",
        poster: "/work/modatepe-resort/modatepe-5.webp",
        title: "Konaklamada %20 indirim kampanyası",
      },
      {
        src: "/work/modatepe-resort/modatepe-7.mp4",
        poster: "/work/modatepe-resort/modatepe-7.webp",
        title: "Panoramik manzaralı bungalov",
      },
      {
        src: "/work/modatepe-resort/modatepe-9.mp4",
        poster: "/work/modatepe-resort/modatepe-9.webp",
        title: "Bungalovda manzaralı konaklama",
      },
      {
        src: "/work/modatepe-resort/modatepe-3.mp4",
        poster: "/work/modatepe-resort/modatepe-3.webp",
        title: "Manzaraya karşı serpme kahvaltı",
      },
      {
        src: "/work/modatepe-resort/modatepe-2.mp4",
        poster: "/work/modatepe-resort/modatepe-2.webp",
        title: "Izgara et hazırlığı ve sunumu",
      },
      {
        src: "/work/modatepe-resort/modatepe-12.mp4",
        poster: "/work/modatepe-resort/modatepe-12.webp",
        title: "Gün batımında drone turu",
      },
    ],
  },
  {
    index: "11",
    slug: "kardesler-oto-lastik",
    name: "Kardeşler & Beyazlı Oto Lastik",
    category: "Otomotiv · Jant & Lastik",
    summary:
      "Jant ve lastik hizmetlerini; süreç, ustalık ve ürün detaylarını öne çıkaran dinamik otomotiv içerikleriyle anlattık.",
    services: ["Jant & lastik prodüksiyonu", "Hizmet anlatımı", "Reels prodüksiyonu"],
    logo: "/logos/kardesler-oto-lastik.png",
    logoAlt: "Kardeşler & Beyazlı Oto Lastik logosu",
    logoShape: "square",
    logoTreatment: "light",
    panel: "dark",
    media: [
      {
        src: "/work/kardesler-beyazli/kardesler-beyazli-12.mp4",
        poster: "/work/kardesler-beyazli/kardesler-beyazli-12.webp",
        title: "Profesyonel jant düzeltme",
      },
      {
        src: "/work/kardesler-beyazli/kardesler-beyazli-18.mp4",
        poster: "/work/kardesler-beyazli/kardesler-beyazli-18.webp",
        title: "Hasarlı jant yenileme",
      },
      {
        src: "/work/kardesler-beyazli/kardesler-beyazli-19.mp4",
        poster: "/work/kardesler-beyazli/kardesler-beyazli-19.webp",
        title: "Kardeşler & Beyazlı Oto Lastik tanıtımı",
      },
      {
        src: "/work/kardesler-beyazli/kardesler-beyazli-33.mp4",
        poster: "/work/kardesler-beyazli/kardesler-beyazli-33.webp",
        title: "Mercedes AMG jant tanıtımı",
      },
      {
        src: "/work/kardesler-beyazli/kardesler-beyazli-34.mp4",
        poster: "/work/kardesler-beyazli/kardesler-beyazli-34.webp",
        title: "Citroën Berlingo jant tanıtımı",
      },
      video(9, "Lastik ürün tanıtımı"),
    ],
  },
  {
    index: "12",
    slug: "sancak-turizm",
    name: "Sancak Turizm",
    category: "Turizm · Seyahat",
    summary:
      "Rota ve destinasyonları, seyahat isteği uyandıran manzara ve drone görüntüleriyle dijital vitrine taşıdık.",
    services: ["Drone çekimi", "Destinasyon içeriği", "Reels prodüksiyonu"],
    logo: "/logos/sancak-turizm-v2.png",
    logoAlt: "Sancak Turizm logosu",
    logoShape: "wide",
    logoTreatment: "dark",
    panel: "light",
    media: [
      {
        src: "/work/sancak-turizm/uzungol-destinasyon.mp4",
        poster: "/work/sancak-turizm/uzungol-destinasyon.webp",
        title: "Uzungöl destinasyon tanıtımı",
      },
      {
        src: "/work/sancak-turizm/bungalov-konaklama.mp4",
        poster: "/work/sancak-turizm/bungalov-konaklama.webp",
        title: "Bungalov konaklama tanıtımı",
      },
      {
        src: "/work/sancak-turizm/turizm-hizmetleri.mp4",
        poster: "/work/sancak-turizm/turizm-hizmetleri.webp",
        title: "Sancak Turizm hizmet tanıtımı",
      },
    ],
  },
  {
    index: "13",
    slug: "kayi-1461-turizm",
    name: "Kayı 1461 Turizm",
    category: "Turizm · Acente",
    summary:
      "Tur planlarını, dijital görünürlüğü ve reklam iletişimini aynı marka çizgisinde bir araya getirdik.",
    services: ["Sosyal medya düzeni", "Reklam optimizasyonu", "Tur içerikleri"],
    logoAlt: "Kayı 1461 Turizm logosu",
    logoShape: "wide",
    logoTreatment: "light",
    panel: "dark",
    media: [],
  },
  {
    index: "14",
    slug: "flowers-dugun-salonu",
    name: "Flowers Düğün Salonu",
    category: "Organizasyon · Etkinlik",
    summary:
      "Mekânın atmosferini ve etkinlik deneyimini duyguya odaklanan fotoğraf ve video içerikleriyle anlattık.",
    services: ["Etkinlik çekimi", "Mekân tanıtımı", "Sosyal medya içeriği"],
    logoAlt: "Flowers Düğün Salonu logosu",
    logoShape: "wide",
    logoTreatment: "dark",
    panel: "light",
    media: [
      {
        src: "/work/flowers-dugun-salonu/dugun-gecesi-tanitim.mp4",
        poster: "/work/flowers-dugun-salonu/dugun-gecesi-tanitim.webp",
        title: "Düğün gecesi tanıtım filmi",
      },
      {
        src: "/work/flowers-dugun-salonu/salon-organizasyon-tanitim.mp4",
        poster: "/work/flowers-dugun-salonu/salon-organizasyon-tanitim.webp",
        title: "Salon ve organizasyon tanıtımı",
      },
    ],
  },
  {
    index: "15",
    slug: "macka-bungalov",
    name: "Maçka Bungalov",
    category: "Konaklama · Doğa Turizmi",
    summary:
      "Doğa içindeki konaklama deneyimini, tesisin karakterini ve çevresini öne çıkaran içeriklerle sunduk.",
    services: ["Drone çekimi", "Konaklama tanıtımı", "Reels prodüksiyonu"],
    logo: "/logos/macka-bungalov.png",
    logoAlt: "Maçka Bungalov logosu",
    logoShape: "square",
    logoTreatment: "light",
    panel: "dark",
    media: [],
  },
  {
    index: "16",
    slug: "tt-fest",
    name: "TT Fest",
    category: "Etkinlik · Festival",
    summary:
      "Festival enerjisini, kalabalığı ve sahne atmosferini hızlı tempolu etkinlik içerikleriyle görünür kıldık.",
    services: ["Etkinlik prodüksiyonu", "Reels içeriği", "Kurgu & post prodüksiyon"],
    logo: "/logos/tt-fest.png",
    logoAlt: "TT Fest logosu",
    logoShape: "square",
    logoTreatment: "dark",
    panel: "light",
    media: [
      {
        src: "/work/tt-fest/tt-fest-etkinlik-filmi.mp4",
        poster: "/work/tt-fest/tt-fest-etkinlik-filmi.webp",
        title: "TT Fest etkinlik ve festival filmi",
      },
    ],
  },
  {
    index: "17",
    slug: "kozalaklar-oyun-atolyesi",
    name: "Kozalaklar Ormanda",
    category: "Eğitim · Çocuk Atölyesi",
    summary:
      "Çocukların keşfetme, hareket etme ve birlikte öğrenme deneyimini sıcak, samimi ve hareketli içeriklerle anlattık.",
    services: ["Atölye çekimi", "Sosyal medya içeriği", "Fotoğraf & video"],
    logoAlt: "Kozalaklar Ormanda Oyun Atölyesi logosu",
    logoShape: "wide",
    logoTreatment: "light",
    panel: "dark",
    media: [
      {
        src: "/work/kozalaklar-ormanda/tirmanis-atolyesi.mp4",
        poster: "/work/kozalaklar-ormanda/tirmanis-atolyesi.webp",
        title: "Tırmanış atölyesi",
      },
      {
        src: "/work/kozalaklar-ormanda/yeni-yil-duyusal-oyun.mp4",
        poster: "/work/kozalaklar-ormanda/yeni-yil-duyusal-oyun.webp",
        title: "Yeni yıl duyusal oyun etkinliği",
      },
      {
        src: "/work/kozalaklar-ormanda/yeni-yil-kar-etkinligi.mp4",
        poster: "/work/kozalaklar-ormanda/yeni-yil-kar-etkinligi.webp",
        title: "Yeni yıl kar etkinliği",
      },
      {
        src: "/work/kozalaklar-ormanda/atolye-ekibi-roportaji.mp4",
        poster: "/work/kozalaklar-ormanda/atolye-ekibi-roportaji.webp",
        title: "Atölye ekibiyle eğlenceli röportaj",
      },
    ],
  },
  {
    index: "18",
    slug: "faber-gayrimenkul",
    name: "Faber Gayrimenkul",
    category: "Gayrimenkul · Danışmanlık",
    summary:
      "Gayrimenkul yatırımlarını, proje ve portföyleri; danışman anlatımları, drone görüntüleri ve mekân çekimleriyle güven veren dijital içeriklere dönüştürdük.",
    services: [
      "Gayrimenkul içerik stratejisi",
      "Drone & portföy çekimi",
      "Reels prodüksiyonu",
    ],
    logo: "/logos/faber-gayrimenkul.png",
    logoAlt: "Faber Gayrimenkul logosu",
    logoShape: "wide",
    logoTreatment: "light",
    panel: "dark",
    media: [
      {
        src: "/work/faber-gayrimenkul/marka-tanitim-filmi.mp4",
        poster: "/work/faber-gayrimenkul/marka-tanitim-filmi.webp",
        title: "Faber Gayrimenkul marka tanıtımı",
      },
      {
        src: "/work/faber-gayrimenkul/ev-mi-arsa-mi.mp4",
        poster: "/work/faber-gayrimenkul/ev-mi-arsa-mi.webp",
        title: "Ev mi, arsa mı? Yatırım tercihi",
      },
      {
        src: "/work/faber-gayrimenkul/north-life-kiralik-sifir-daire.mp4",
        poster: "/work/faber-gayrimenkul/north-life-kiralik-sifir-daire.webp",
        title: "Yalıncak North Life kiralık sıfır daire",
      },
      {
        src: "/work/faber-gayrimenkul/north-life-daire-ve-site-tanitimi.mp4",
        poster: "/work/faber-gayrimenkul/north-life-daire-ve-site-tanitimi.webp",
        title: "North Life daire ve site tanıtımı",
      },
      {
        src: "/work/faber-gayrimenkul/deniz-manzarali-konut-projesi.mp4",
        poster: "/work/faber-gayrimenkul/deniz-manzarali-konut-projesi.webp",
        title: "Deniz manzaralı konut projesi",
      },
      {
        src: "/work/faber-gayrimenkul/sogutlu-uc-tasinmaz.mp4",
        poster: "/work/faber-gayrimenkul/sogutlu-uc-tasinmaz.webp",
        title: "Söğütlü'de üç farklı taşınmaz",
      },
      {
        src: "/work/faber-gayrimenkul/turizm-yatirimi-arsa-tanitimi.mp4",
        poster: "/work/faber-gayrimenkul/turizm-yatirimi-arsa-tanitimi.webp",
        title: "Turizm yatırımı için arsa tanıtımı",
      },
      {
        src: "/work/faber-gayrimenkul/kira-sozlesmesi-bilgilendirme.mp4",
        poster: "/work/faber-gayrimenkul/kira-sozlesmesi-bilgilendirme.webp",
        title: "Kira sözleşmesinde dikkat edilmesi gerekenler",
      },
    ],
  },
  {
    index: "19",
    slug: "ay-gida",
    name: "AY Gıda",
    category: "Gıda · Çay Üretimi",
    summary:
      "Rize'deki çay üretim tesisini, kalite kontrol süreçlerini ve Doğuş Çay ürünlerini; fabrika, ürün ve anlatım odaklı dikey videolarla görünür kıldık.",
    services: [
      "Fabrika & üretim çekimi",
      "Ürün video prodüksiyonu",
      "Reels kurgu & post prodüksiyon",
    ],
    logo: "/logos/ay-gida.png",
    logoAlt: "AY Gıda Ticaret logosu",
    logoShape: "square",
    logoTreatment: "dark",
    panel: "light",
    media: [
      {
        src: "/work/ay-gida/cay-fabrikasi-uretim-yolculugu.mp4",
        poster: "/work/ay-gida/cay-fabrikasi-uretim-yolculugu.webp",
        title: "Çayın fabrikadaki üretim yolculuğu",
      },
      {
        src: "/work/ay-gida/kalite-kontrol-ve-uretim-sureci.mp4",
        poster: "/work/ay-gida/kalite-kontrol-ve-uretim-sureci.webp",
        title: "Doğuş Çay kalite kontrol ve üretim süreci",
      },
      {
        src: "/work/ay-gida/karadeniz-export-cayi-kalite-anlatimi.mp4",
        poster: "/work/ay-gida/karadeniz-export-cayi-kalite-anlatimi.webp",
        title: "Karadeniz Export Çayı kalite anlatımı",
      },
      {
        src: "/work/ay-gida/karadeniz-export-cayi-urun-filmi.mp4",
        poster: "/work/ay-gida/karadeniz-export-cayi-urun-filmi.webp",
        title: "Karadeniz Export Çayı ürün filmi",
      },
      {
        src: "/work/ay-gida/dogus-cay-depo-ve-urun-tanitimi.mp4",
        poster: "/work/ay-gida/dogus-cay-depo-ve-urun-tanitimi.webp",
        title: "Doğuş Çay depo ve ürün tanıtımı",
      },
      {
        src: "/work/ay-gida/dogus-cay-demleme-deneyimi.mp4",
        poster: "/work/ay-gida/dogus-cay-demleme-deneyimi.webp",
        title: "Doğuş Çay demleme ve ürün deneyimi",
      },
    ],
  },
];

// These notes describe only work visible in each project's selected media.
// They do not imply campaign results or client briefs we cannot verify.
export const portfolioProjectNotes: Record<string, { headline: string; detail: string }> = {
  medicalpark: {
    headline: "Kurum ve uzman anlatımı.",
    detail: "Hastane tanıtım filmini iki ayrı uzman görüşüyle tamamladık. Cerrahi onkoloji ve göz kapağı sarkması konularını, kurumsal tanıtımdan ayrı videolarda işledik.",
  },
  "yamanlar-oto-ekspertiz": {
    headline: "Açılış ve konum bir arada.",
    detail: "Salihli şubesinin açılışını bir filmde, İzmir şubelerinin konumunu drone görüntüleriyle ayrı bir videoda anlattık.",
  },
  "trabzon-universitesi": {
    headline: "Fakülteye odaklanan film.",
    detail: "İletişim Fakültesi için kurumsal bir tanıtım filmi hazırladık. Seçkide, üniversitenin genel mesajı yerine bu fakülteye ayrılmış çalışmayı izleyebilirsin.",
  },
  "kd-katik-doner": {
    headline: "Altı şubeden bir seçki.",
    detail: "Rize, Söğütlü, Of, Araklı, Meydan ve Pelitli şubeleri için mutfak, ürün hazırlığı ve servis anlarına odaklanan içerikler hazırladık. Şube videolarını, mutfak ve ekibi gösteren ayrı bir filmle tamamladık.",
  },
  "ozen-optik": {
    headline: "Mağazadan ürün detayına.",
    detail: "Mağazanın içini, gözlük koleksiyonunu ve ürün inceleme anlarını iki ayrı dikey filmde bir araya getirdik. Kısa tanıtımı, mağaza ve ürünlere daha geniş yer veren ikinci filmle tamamladık.",
  },
  "maziden-atiye-puruthana": {
    headline: "Ustalığın aşamalarını gösterdik.",
    detail: "Tandır yapımını, güçlendirme ve sevkiyat sürecini, Loloz tekniğini ve ustalık hikâyesini dört ayrı videoda bir araya getirdik.",
  },
  "gursoy-insaat": {
    headline: "Yaşam fikrini seriye çevirdik.",
    detail: "Hafta sonu aktiviteleri, ev dekorasyonu ve yeşil alan temalarını ayrı kısa içeriklerde işledik. Böylece seçki yalnızca bina görüntülerinden oluşmuyor.",
  },
  "pesent-restaurant": {
    headline: "Mutfaktan sahile uzanan seri.",
    detail: "Adana kebap, pide ve ocakbaşı hazırlığını yakın planda; servis deneyimini ve restoranın sahil konumunu ayrı videolarda gösterdik.",
  },
  "depaul-cafe-restaurant": {
    headline: "Ürünü ve konumu anlattık.",
    detail: "Mini burger, Paul Special pizza ve tatlı hazırlığını ürün odaklı çekimlerle; mekânın konumunu ise ayrı bir tanıtım videosuyla sunduk.",
  },
  "the-vera-cafe-restaurant": {
    headline: "Menünün farklı anları.",
    detail: "İçecek, makarna, pizza, kahvaltı ve tatlı hazırlığını dikey içeriklere ayırdık. Paket servis ve mekân tanıtımı da bu seçkinin parçası.",
  },
  "dk-gayrimenkul": {
    headline: "Her portföyün kendi odağı.",
    detail: "Villa, iş yeri, arsa ve daireleri tek bir şablona sıkıştırmadan ayrı videolarda sunduk; konum, mekân ve kullanım özelliklerini portföye göre öne çıkardık.",
  },
  "modatepe-resort": {
    headline: "Konaklamanın çevresini de gösterdik.",
    detail: "Bungalov ve manzara videolarını gün batımı drone çekimi, kahvaltı ve yemek içerikleriyle tamamladık. Seçki tesisin farklı deneyimlerini gösteriyor.",
  },
  "kardesler-oto-lastik": {
    headline: "İşlemi ve ürünü ayırdık.",
    detail: "Jant düzeltme ve hasarlı jant yenileme süreçlerini, Mercedes AMG ve Citroën Berlingo jant tanıtımlarından ayrı videolarda işledik.",
  },
  "sancak-turizm": {
    headline: "Rota, konaklama, hizmet.",
    detail: "Uzungöl destinasyonunu, bungalov konaklamayı ve acentenin hizmetlerini üç ayrı kısa içerikle anlattık.",
  },
  "flowers-dugun-salonu": {
    headline: "Geceyi ve mekânı anlattık.",
    detail: "Düğün gecesinin atmosferini bir filmde, salonun ve organizasyon alanının tanıtımını ikinci videoda topladık.",
  },
  "tt-fest": {
    headline: "Festival tek filmde.",
    detail: "TT Fest için hazırladığımız etkinlik filmi, festival alanını ve sahne atmosferini hareketli bir seçkide bir araya getiriyor.",
  },
  "kozalaklar-oyun-atolyesi": {
    headline: "Atölyenin hareketi ekranda.",
    detail: "Tırmanış, duyusal oyun ve kar etkinliğini ayrı videolarda gösterdik; ekip röportajıyla atölyeyi yürüten insanlara da yer verdik.",
  },
  "faber-gayrimenkul": {
    headline: "Markadan portföye uzanan içerik.",
    detail: "Marka filmini; North Life daireleri, arsa tanıtımı, ev mi arsa mı sorusu ve kira sözleşmesi gibi farklı konulara ayrılmış videolarla tamamladık.",
  },
  "ay-gida": {
    headline: "Üretimden demlemeye.",
    detail: "Çay fabrikası ve kalite kontrol sürecini; Karadeniz Export ürün filmi ve Doğuş Çay demleme deneyimiyle aynı seçkide buluşturduk.",
  },
};

export const portfolioProjectBySlug = Object.fromEntries(
  portfolioProjects.map((project) => [project.slug, project])
) as Record<string, PortfolioProject>;
