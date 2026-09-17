export type SitePhoto = {
  src: string;
  alt: string;
};

const itza = (file: string) => `/Fotos/itza/${file}`;
const casa = (file: string) => `/Fotos/casa/${file}`;

export const homePhotos = {
  hero: {
    src: casa("exterior-vista-casa-03.jpeg"),
    alt: "Fachada de la capilla de la Ermita, con arco de entrada, teja y cruz blanca contra la roca",
  },
  banner: {
    src: itza("exterior-vista-itza-07.jpeg"),
    alt: "Ángel de bronce junto a la cruz de piedra y el arco Pax vobis, con el volcán al fondo",
  },
  quote: {
    src: itza("exterior-vista-itza-02.jpeg"),
    alt: "San Francisco de bronce extendiendo la paloma junto a la cruz tallada y el volcán",
  },
  cta: {
    src: itza("exterior-vista-itza-10.jpeg"),
    alt: "Atardecer dorado sobre el volcán humeante, con una cruz de metal en primer plano",
  },
} as const satisfies Record<string, SitePhoto>;

export const generalGallery: SitePhoto[] = [
  {
    src: itza("exterior-vista-itza-01.jpeg"),
    alt: "Vista al volcán nevado enmarcada entre la roca y los pinos",
  },
  {
    src: itza("exterior-vista-itza-02.jpeg"),
    alt: "San Francisco de bronce liberando una paloma junto a la cruz",
  },
  {
    src: itza("exterior-vista-itza-03.jpeg"),
    alt: "Arcos de piedra, cruz Pax y talla de Jesús en la roca con el volcán al fondo",
  },
  {
    src: itza("exterior-vista-itza-04.jpeg"),
    alt: "Muro con azulejo Shalom y cruz verde frente al volcán",
  },
  {
    src: itza("exterior-vista-itza-06.jpeg"),
    alt: "Fuente circular de mosaico azul, venado de bronce y arcos con el volcán al fondo",
  },
  {
    src: itza("exterior-vista-itza-08.jpeg"),
    alt: "Vista panorámica de la casa, techos de teja y el volcán entre nubes",
  },
  {
    src: casa("exterior-vista-casa-12.jpeg"),
    alt: "San Francisco sentado en piedra junto a la paloma, con el bosque al fondo",
  },
];

export const instalacionesGallery: SitePhoto[] = [
  {
    src: casa("exterior-vista-casa-05.jpeg"),
    alt: "Fachada de piedra de la capilla con arco Silentium tibi laus y campanario",
  },
  {
    src: casa("exterior-vista-casa-06.jpeg"),
    alt: "Torre de piedra con techo de teja y vista al bosque desde la azotea",
  },
  {
    src: casa("exterior-vista-casa-07.jpeg"),
    alt: "Cruz sobre cúpula blanca con macetas de barro y el bosque al fondo",
  },
  {
    src: casa("exterior-vista-casa-11.jpeg"),
    alt: "Cruz de metal sobre la cúpula blanca contra el cielo nublado",
  },
  {
    src: casa("exterior-vista-casa-04.jpeg"),
    alt: "Escalinata de piedra con arcos y vegetación cubierta de musgo",
  },
  {
    src: casa("exterior-vista-casa-09.jpeg"),
    alt: "Cruz de piedra tallada, ángel de bronce y arco Pax vobis en un día nublado",
  },
  {
    src: casa("exterior-vista-casa-08.jpeg"),
    alt: "Estatua blanca y vitral circular, vistos desde abajo entre la vegetación",
  },
  {
    src: casa("exterior-vista-casa-10.jpeg"),
    alt: "Arcos de piedra y talla de Jesús con la inscripción Venga benditos de mi Padre",
  },
];

export const surroundingsPhotos: SitePhoto[] = [
  {
    src: itza("exterior-vista-itza-09.jpeg"),
    alt: "Volcán entre pinos con una cruz de metal en primer plano y cielo nublado",
  },
  {
    src: itza("exterior-vista-itza-01.jpeg"),
    alt: "Volcán nevado entre pinos densos bajo un cielo despejado",
  },
  {
    src: itza("exterior-vista-itza-08.jpeg"),
    alt: "Valle boscoso amplio con el volcán humeante al fondo",
  },
];

export const artisanDetails: Array<SitePhoto & { caption: string }> = [
  {
    src: casa("exterior-vista-casa-01.jpeg"),
    alt: "Mural de azulejo con Moisés golpeando la roca",
    caption: "Moisés golpea la roca",
  },
  {
    src: casa("exterior-vista-casa-13.jpeg"),
    alt: "Placa de piedra con la cita del ancla y la fe en Cristo resucitado",
    caption: "Como el ancla lanzada desde un barco",
  },
  {
    src: casa("exterior-vista-casa-14.jpeg"),
    alt: "Talla en la roca de Jesús con los brazos abiertos: Venga benditos de mi Padre",
    caption: "Venga, benditos de mi Padre",
  },
];
