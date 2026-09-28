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
const editada = (file: string) => `/Fotos/editadas/${file}`;

export const homePhotos = {
  hero: {
    src: casa("exterior-vista-casa-03.jpeg"),
    alt: "Fachada rosa y blanca de la capilla, con cruz y teja, apoyada en la roca",
  },
  banner: {
    src: editada("ventana-angel.jpg"),
    alt: "El bosque visto desde los arcos de piedra, con el ángel de bronce al fondo",
  },
  quote: {
    src: editada("francisco-detalle.jpg"),
    alt: "San Francisco de bronce sentado, con una paloma en la mano",
  },
  cta: {
    src: itza("exterior-vista-itza-10.jpeg"),
    alt: "Atardecer sobre el volcán, con una cruz de metal entre los pinos",
  },
} as const satisfies Record<string, SitePhoto>;

export const pathPhotos = {
  alquiler: {
    src: editada("torre-cascada.jpg"),
    alt: "Torre de piedra, escalinata y cascada sobre la roca de la casa",
  },
  retiros: {
    src: editada("angel-bronce.jpg"),
    alt: "Ángel de bronce en blanco y negro, con un ramo en la mano",
  },
  visitas: {
    src: editada("terraza-pax-vobis.jpg"),
    alt: "Terraza de la capilla, con la cruz, el ángel y el arco Pax vobis",
  },
} as const satisfies Record<string, SitePhoto>;

export const pageHeroes = {
  alquiler: {
    src: editada("capilla-terraza.jpg"),
    alt: "Capilla de piedra, campanario y terraza abierta al bosque",
  },
  retiros: {
    src: editada("ventana-angel.jpg"),
    alt: "Bosque y ángel vistos desde los arcos de la casa",
  },
  visitas: {
    src: editada("terraza-bosque.jpg"),
    alt: "Terraza con la cruz y el ángel, abierta al bosque nublado",
  },
} as const satisfies Record<string, SitePhoto>;

export const pageGalleries = {
  alquiler: [
    {
      src: editada("torre-cascada.jpg"),
      alt: "Torre de piedra, macetas y cascada que baja por la roca",
    },
    {
      src: editada("fuente-venado.jpg"),
      alt: "Fuente de mosaico, venado de bronce y arcos frente al bosque",
    },
    {
      src: editada("terraza-pax-vobis.jpg"),
      alt: "Cruz tallada, ángel de bronce y arco Pax vobis en la terraza",
    },
  ],
  retiros: [
    {
      src: editada("angel-bronce.jpg"),
      alt: "Ángel de bronce en blanco y negro",
    },
    {
      src: editada("venga-benditos.jpg"),
      alt: "Talla de Jesús en la roca, cruz Pax y arcos sobre el valle",
    },
    {
      src: editada("ventana-bosque.jpg"),
      alt: "El bosque enmarcado por los arcos de piedra de la casa",
    },
  ],
  visitas: [
    {
      src: editada("pax-vobis-arco.jpg"),
      alt: "Letras Pax vobis junto a un arco abierto al bosque",
    },
    {
      src: editada("francisco-paloma.jpg"),
      alt: "San Francisco de bronce sentado, con la paloma y el bosque",
    },
    {
      src: editada("capilla-terraza.jpg"),
      alt: "Capilla, terraza y mosaico de la paloma",
    },
  ],
} as const satisfies Record<string, SitePhoto[]>;

export const lifeGallery: GalleryPhoto[] = [
  {
    src: editada("terraza-pax-vobis.jpg"),
    alt: "Ángel de bronce, cruz tallada y arco Pax vobis sobre el bosque",
    caption: "El ángel",
    frame: "col-span-1 md:col-span-7",
    ratio: "aspect-[4/5]",
  },
  {
    src: editada("fuente-venado.jpg"),
    alt: "Fuente circular de mosaico, venado de bronce y arcos frente al bosque",
    caption: "La fuente",
    frame: "col-span-1 md:col-span-5",
    ratio: "aspect-[4/3]",
  },
  {
    src: casa("exterior-vista-casa-01.jpeg"),
    alt: "Mural de azulejo en el que Moisés golpea la roca",
    caption: "Moisés golpea la roca",
    frame: "col-span-1 md:col-span-4",
    ratio: "aspect-[4/3]",
  },
  {
    src: itza("exterior-vista-itza-11.jpeg"),
    alt: "Estatua de venado de bronce junto a la fuente, mirando al volcán",
    caption: "El venado",
    frame: "col-span-1 md:col-span-4",
    ratio: "aspect-[3/4]",
  },
  {
    src: casa("exterior-vista-casa-13.jpeg"),
    alt: "Placa de piedra con la cita del ancla y la fe en Cristo resucitado",
    caption: "La placa del ancla",
    frame: "col-span-2 md:col-span-4",
    ratio: "aspect-square",
  },
  {
    src: editada("francisco-paloma.jpg"),
    alt: "San Francisco sentado en piedra junto a la paloma, con el bosque al fondo",
    caption: "San Francisco en piedra",
    frame: "col-span-1 md:col-span-5",
    ratio: "aspect-square",
  },
  {
    src: itza("exterior-vista-itza-01.jpeg"),
    alt: "Vista del volcán nevado entre la roca y los pinos de la propiedad",
    caption: "Vista al Itza",
    frame: "col-span-1 md:col-span-7",
    ratio: "aspect-[16/7]",
  },
];

export const generalGallery: SitePhoto[] = lifeGallery.map(({ src, alt }) => ({ src, alt }));

export const instalacionesGallery: SitePhoto[] = [
  {
    src: editada("capilla-terraza.jpg"),
    alt: "Fachada de la capilla de piedra, campanario y terraza",
  },
  {
    src: editada("torre-cascada.jpg"),
    alt: "Torre de piedra con techo de teja, escalinata y cascada",
  },
  {
    src: casa("exterior-vista-casa-07.jpeg"),
    alt: "Cruz sobre cúpula blanca con macetas de barro y el bosque al fondo",
  },
  {
    src: editada("ventana-bosque.jpg"),
    alt: "El bosque visto desde los arcos de piedra",
  },
  {
    src: casa("exterior-vista-casa-04.jpeg"),
    alt: "Escalinata de piedra con arcos y vegetación",
  },
  {
    src: editada("terraza-pax-vobis.jpg"),
    alt: "Cruz de piedra, ángel de bronce y arco Pax vobis",
  },
  {
    src: casa("exterior-vista-casa-08.jpeg"),
    alt: "Escultura blanca y vitral circular entre la vegetación",
  },
  {
    src: editada("venga-benditos.jpg"),
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
