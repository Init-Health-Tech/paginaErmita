export type UpcomingRetreat = {
  id: string;
  title: string;
  datesLabel: string;
  description: string;
  occupiedDates: string[];
};

// TODO: reemplazar fechas de ejemplo con las convocatorias reales cuando estén definidas
export const upcomingRetreats: UpcomingRetreat[] = [
  {
    id: "retiro-adviento",
    title: "Retiro de Adviento",
    datesLabel: "6 al 8 de diciembre",
    description: "Silencio y preparación para la Navidad",
    occupiedDates: ["2026-12-06", "2026-12-07", "2026-12-08"],
  },
  {
    id: "retiro-cuaresma",
    title: "Retiro de Cuaresma",
    datesLabel: "20 al 22 de marzo",
    description: "Camino hacia la Pascua en oración",
    occupiedDates: ["2027-03-20", "2027-03-21", "2027-03-22"],
  },
  {
    id: "retiro-verano",
    title: "Retiro de verano",
    datesLabel: "10 al 12 de julio",
    description: "Descanso espiritual en comunidad",
    occupiedDates: ["2027-07-10", "2027-07-11", "2027-07-12"],
  },
];

export const retiroOtroOption = {
  id: "otro",
  label: "Otro / Quiero que me avisen de futuras fechas",
} as const;

export const retiroInterestOptions = [
  ...upcomingRetreats.map((retiro) => ({
    id: retiro.id,
    label: `${retiro.title} (${retiro.datesLabel})`,
  })),
  retiroOtroOption,
];

export function isRetiroInterestId(value: string): boolean {
  return retiroInterestOptions.some((option) => option.id === value);
}
