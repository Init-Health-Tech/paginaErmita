export type SitePhoto = {
  src: string;
  alt: string;
};

export type GalleryPhoto = SitePhoto & {
  caption: string;
  frame: string;
  ratio: string;
};

const itza = (file: string) => `/Fotos/itza/${file}`;
const casa = (file: string) => `/Fotos/casa/${file}`;

export const homePhotos = {
  hero: {
    src: casa("exterior-vista-casa-03.jpeg"),
    alt: "Fachada rosa y blanca de la capilla, con cruz y teja, apoyada en la roca",
  },
  banner: {
    src: itza("exterior-vista-itza-08.jpeg"),
    alt: "Vista panorámica del bosque y el volcán, con los techos de la casa en primer plano",
  },
  quote: {
    src: itza("exterior-vista-itza-02.jpeg"),
    alt: "Escultura de San Francisco de bronce liberando una paloma junto a la cruz",
  },
  cta: {
    src: itza("exterior-vista-itza-10.jpeg"),
    alt: "Atardecer sobre el volcán, con una cruz de metal entre los pinos",
  },
} as const satisfies Record<string, SitePhoto>;

export const pathPhotos = {
  alquiler: {
    src: casa("exterior-vista-casa-06.jpeg"),
    alt: "Torre de piedra con techo de teja y el bosque al fondo",
  },
  retiros: {
    src: itza("exterior-vista-itza-03.jpeg"),
    alt: "Arcos de piedra y cruces orientados hacia el volcán",
  },
  visitas: {
    src: casa("exterior-vista-casa-05.jpeg"),
    alt: "Entrada de piedra con el arco que dice Silentium tibi laus",
  },
} as const satisfies Record<string, SitePhoto>;

export const pageHeroes = {
  alquiler: {
    src: itza("exterior-vista-itza-09.jpeg"),
    alt: "Bosque de pinos y el volcán, con una cruz de metal en primer plano",
  },
  retiros: {
    src: itza("exterior-vista-itza-10.jpeg"),
    alt: "Atardecer anaranjado sobre el volcán y el bosque",
  },
  visitas: {
    src: itza("exterior-vista-itza-04.jpeg"),
    alt: "Muro de piedra y cruz frente al volcán",
  },
} as const satisfies Record<string, SitePhoto>;

export const lifeGallery: GalleryPhoto[] = [
  {
    src: itza("exterior-vista-itza-07.jpeg"),
    alt: "Ángel de bronce junto a una cruz tallada, con el volcán al fondo",
    caption: "El ángel",
    frame: "col-span-2 md:col-span-7 md:row-span-2",
    ratio: "aspect-[4/5]",
  },
  {
    src: itza("exterior-vista-itza-06.jpeg"),
    alt: "Fuente circular de mosaico azul, con el venado de bronce y el volcán",
    caption: "La fuente",
    frame: "col-span-1 md:col-span-5",
    ratio: "aspect-[4/3]",
  },
  {
    src: casa("exterior-vista-casa-01.jpeg"),
    alt: "Mural de azulejo en el que Moisés golpea la roca",
    caption: "Moisés golpea la roca",
    frame: "col-span-1 md:col-span-5",
    ratio: "aspect-[4/3]",
  },
  {
    src: itza("exterior-vista-itza-11.jpeg"),
    alt: "Estatua de venado de bronce junto a la fuente, mirando al volcán",
    caption: "El venado",
    frame: "col-span-2 md:col-span-4 md:row-span-2",
    ratio: "aspect-[3/4]",
  },
  {
    src: casa("exterior-vista-casa-13.jpeg"),
    alt: "Placa de piedra con la cita del ancla y la fe en Cristo resucitado",
    caption: "La placa del ancla",
    frame: "col-span-1 md:col-span-4",
    ratio: "aspect-square",
  },
  {
    src: casa("exterior-vista-casa-12.jpeg"),
    alt: "San Francisco sentado en piedra junto a la paloma, con el bosque al fondo",
    caption: "San Francisco en piedra",
    frame: "col-span-1 md:col-span-4",
    ratio: "aspect-square",
  },
  {
    src: itza("exterior-vista-itza-01.jpeg"),
    alt: "Vista del volcán nevado entre la roca y los pinos de la propiedad",
    caption: "Vista al Itza",
    frame: "col-span-2 md:col-span-12",
    ratio: "aspect-[16/7]",
  },
];

export const generalGallery: SitePhoto[] = lifeGallery.map(({ src, alt }) => ({ src, alt }));

export const instalacionesGallery: SitePhoto[] = [
  {
    src: casa("exterior-vista-casa-05.jpeg"),
    alt: "Fachada de piedra de la capilla con el arco Silentium tibi laus",
  },
  {
    src: casa("exterior-vista-casa-06.jpeg"),
    alt: "Torre de piedra con techo de teja y vista al bosque",
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
    alt: "Escalinata de piedra con arcos y vegetación",
  },
  {
    src: casa("exterior-vista-casa-09.jpeg"),
    alt: "Cruz de piedra, ángel de bronce y arco Pax vobis",
  },
  {
    src: casa("exterior-vista-casa-08.jpeg"),
    alt: "Escultura blanca y vitral circular entre la vegetación",
  },
  {
    src: casa("exterior-vista-casa-10.jpeg"),
    alt: "Arcos de piedra y talla de Jesús con la inscripción Venga benditos de mi Padre",
  },
];

export const surroundingsPhotos: SitePhoto[] = [
  {
    src: itza("exterior-vista-itza-09.jpeg"),
    alt: "Volcán entre pinos con una cruz de metal en primer plano",
  },
  {
    src: itza("exterior-vista-itza-01.jpeg"),
    alt: "Volcán nevado entre pinos densos",
  },
  {
    src: itza("exterior-vista-itza-08.jpeg"),
    alt: "Valle boscoso amplio con el volcán al fondo",
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
