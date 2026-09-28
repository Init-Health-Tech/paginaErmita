const testimonials = [
  {
    quote: "Encontré un silencio que no sabía que necesitaba. La Ermita te devuelve a lo esencial.",
    attribution: "Grupo parroquial San José",
  },
  {
    quote: "Un espacio sencillo pero profundamente acogedor para el retiro personal.",
    attribution: "Retiro personal, comunidad TOR",
  },
  {
    quote: "La sobriedad del lugar ayuda a que la oración sea lo único que importa.",
    attribution: "Movimiento juvenil franciscano",
  },
];

export function Testimonials() {
  return (
    <section className="section-pad" aria-labelledby="testimonios-titulo">
      <div className="shell">
        <p id="testimonios-titulo" className="eyebrow">
          Testimonios
        </p>
        <ul className="mt-12 grid gap-12 md:mt-16 md:grid-cols-3 md:gap-10">
          {testimonials.map((item) => (
            <li key={item.attribution} className="border-t border-[var(--color-line)] pt-6">
              <blockquote className="font-serif text-[1.5rem] font-normal italic leading-snug">{item.quote}</blockquote>
              <p className="eyebrow mt-6">— {item.attribution}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
