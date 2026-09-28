import { parseISODate } from "@/lib/dates";

export type FormSection = "alquiler" | "retiros" | "visitas";

export type FieldType =
  | "text"
  | "email"
  | "tel"
  | "number"
  | "date"
  | "time"
  | "textarea"
  | "select"
  | "retreat";

export type FormField = {
  id: string;
  label: string;
  type: FieldType;
  required: boolean;
  locked: boolean;
  placeholder?: string;
  options?: { value: string; label: string }[];
};

export type CostModel = "notes_only" | "per_person_per_day" | "flat_rate";

export type MealPackage = {
  id: string;
  name: string;
  description: string;
};

export type RentalCosts = {
  model: CostModel;
  pricePerPersonPerDay: number | null;
  flatRate: number | null;
  summary: string;
  packages: MealPackage[];
};

export type AmenityIcon = "capilla" | "comedor" | "cuartos" | "general";

export type Amenity = {
  id: string;
  title: string;
  phrase: string;
  icon: AmenityIcon;
  src?: string;
  alt?: string;
};

export type ScheduledRetreat = {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  description: string;
  capacity: number | null;
};

export type SiteContent = {
  forms: Record<FormSection, FormField[]>;
  costs: RentalCosts;
  amenities: Amenity[];
  retreats: ScheduledRetreat[];
};

export class ContentValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ContentValidationError";
  }
}

export const FIELD_TYPE_LABELS: Record<Exclude<FieldType, "retreat">, string> = {
  text: "Texto corto",
  email: "Correo",
  tel: "Teléfono",
  number: "Número",
  date: "Fecha",
  time: "Hora",
  textarea: "Texto largo",
  select: "Lista de opciones",
};

export const COST_MODEL_LABELS: Record<CostModel, string> = {
  notes_only: "Solo texto informativo",
  per_person_per_day: "Precio por persona por día",
  flat_rate: "Tarifa fija",
};

export const AMENITY_ICON_LABELS: Record<AmenityIcon, string> = {
  capilla: "Capilla",
  comedor: "Comedor",
  cuartos: "Cuartos",
  general: "General",
};

export const RETIRO_OTRO_OPTION = {
  id: "otro",
  label: "Otro / Quiero que me avisen de futuras fechas",
} as const;

const MONTHS = [
  "enero",
  "febrero",
  "marzo",
  "abril",
  "mayo",
  "junio",
  "julio",
  "agosto",
  "septiembre",
  "octubre",
  "noviembre",
  "diciembre",
];

const RESERVED_IDS = new Set(["type", "constructor", "prototype", "__proto__"]);
const EDITABLE_TYPES = new Set<FieldType>([
  "text",
  "email",
  "tel",
  "number",
  "date",
  "time",
  "textarea",
  "select",
]);
const ICONS = new Set<AmenityIcon>(["capilla", "comedor", "cuartos", "general"]);
const COST_MODELS = new Set<CostModel>(["notes_only", "per_person_per_day", "flat_rate"]);

const DEFAULT_CONTENT: SiteContent = {
  forms: {
    alquiler: [
      { id: "nombre", label: "Nombre completo", type: "text", required: true, locked: true },
      { id: "email", label: "Correo electrónico", type: "email", required: true, locked: true },
      { id: "telefono", label: "Teléfono", type: "tel", required: true, locked: false },
      { id: "institucion", label: "Parroquia, movimiento o institución", type: "text", required: false, locked: false },
      {
        id: "fechas",
        label: "Fechas aproximadas o flexibilidad",
        type: "text",
        required: true,
        locked: false,
        placeholder: "Ej.: segunda quincena de mayo",
      },
      { id: "personas", label: "Número aproximado de participantes", type: "number", required: true, locked: false },
      { id: "mensaje", label: "Mensaje u observaciones", type: "textarea", required: false, locked: false },
    ],
    retiros: [
      { id: "nombre", label: "Nombre completo", type: "text", required: true, locked: true },
      { id: "email", label: "Correo electrónico", type: "email", required: true, locked: true },
      { id: "telefono", label: "Teléfono", type: "tel", required: false, locked: false },
      { id: "ciudad", label: "Ciudad o localidad", type: "text", required: false, locked: false },
      { id: "retiro_interes", label: "Retiro de interés", type: "retreat", required: true, locked: true },
      { id: "como_conocio", label: "¿Cómo conoció la Ermita?", type: "text", required: false, locked: false },
      { id: "mensaje", label: "Comentario o petición", type: "textarea", required: false, locked: false },
    ],
    visitas: [
      { id: "nombre", label: "Nombre completo", type: "text", required: true, locked: true },
      { id: "email", label: "Correo electrónico", type: "email", required: true, locked: true },
      { id: "telefono", label: "Teléfono", type: "tel", required: true, locked: false },
      { id: "fecha_preferida", label: "Fecha preferida", type: "date", required: true, locked: false },
      { id: "hora_aproximada", label: "Hora aproximada", type: "time", required: false, locked: false },
      { id: "personas", label: "Número de personas", type: "number", required: true, locked: false },
      { id: "mensaje", label: "Motivo u observaciones", type: "textarea", required: false, locked: false },
    ],
  },
  costs: {
    model: "notes_only",
    pricePerPersonPerDay: null,
    flatRate: null,
    summary:
      "El costo del alquiler se calcula según el número de personas y los días de estancia. Contamos con distintos paquetes de alimentación (desayuno, comida y cena) que se detallan al confirmar tu solicitud.",
    packages: [],
  },
  amenities: [
    {
      id: "capilla",
      title: "Capilla",
      phrase: "Oración y silencio",
      icon: "capilla",
      src: "/Fotos/casa/exterior-vista-casa-05.jpeg",
      alt: "Fachada de piedra de la capilla, con arco Silentium tibi laus y campanario",
    },
    {
      id: "comedor",
      title: "Comedor",
      phrase: "Mesa en comunidad",
      icon: "comedor",
      src: "/Fotos/itza/exterior-vista-itza-08.jpeg",
      alt: "Vista de la casa y techos de teja entre el bosque",
    },
    {
      id: "cuartos",
      title: "Cuartos",
      phrase: "Descanso sencillo",
      icon: "cuartos",
      src: "/Fotos/casa/exterior-vista-casa-06.jpeg",
      alt: "Torre de piedra con techo de teja y vista al bosque",
    },
  ],
  retreats: [
    {
      id: "retiro-adviento",
      name: "Retiro de Adviento",
      startDate: "2026-12-06",
      endDate: "2026-12-08",
      description: "Silencio y preparación para la Navidad",
      capacity: null,
    },
    {
      id: "retiro-cuaresma",
      name: "Retiro de Cuaresma",
      startDate: "2027-03-20",
      endDate: "2027-03-22",
      description: "Camino hacia la Pascua en oración",
      capacity: null,
    },
    {
      id: "retiro-verano",
      name: "Retiro de verano",
      startDate: "2027-07-10",
      endDate: "2027-07-12",
      description: "Descanso espiritual en comunidad",
      capacity: null,
    },
  ],
};

export function defaultSiteContent(): SiteContent {
  return structuredClone(DEFAULT_CONTENT);
}

export function isFormSection(value: unknown): value is FormSection {
  return value === "alquiler" || value === "retiros" || value === "visitas";
}

export function newClientId(): string {
  return `nuevo-${Math.random().toString(36).slice(2, 10)}`;
}

export function slugifyId(label: string): string {
  const base = label
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
  return base || "elemento";
}

export function uniqueId(base: string, used: Set<string>): string {
  const root = base || "elemento";
  if (!used.has(root)) return root;
  let n = 2;
  while (used.has(`${root}-${n}`)) n += 1;
  return `${root}-${n}`;
}

export function assignStableId(requested: string, label: string, used: Set<string>): string {
  const valid = /^[a-z][a-z0-9_-]{0,48}$/.test(requested);
  const keep = valid && !requested.startsWith("nuevo-") && !RESERVED_IDS.has(requested);
  let base = keep ? requested : slugifyId(label);
  if (RESERVED_IDS.has(base) || base.startsWith("nuevo-")) base = `${base.replace(/^nuevo-/, "") || "elemento"}-campo`;
  const id = uniqueId(base, used);
  used.add(id);
  return id;
}

export function formatRetreatDates(startDate: string, endDate: string): string {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(startDate) || !/^\d{4}-\d{2}-\d{2}$/.test(endDate)) return "";
  const [sy, sm, sd] = startDate.split("-").map(Number);
  const [ey, em, ed] = endDate.split("-").map(Number);
  if (sm < 1 || sm > 12 || em < 1 || em > 12) return "";
  const startLabel = `${sd} de ${MONTHS[sm - 1]}`;
  const endLabel = `${ed} de ${MONTHS[em - 1]}`;
  if (startDate === endDate) return startLabel;
  if (sy === ey && sm === em) return `${sd} al ${ed} de ${MONTHS[sm - 1]}`;
  if (sy === ey) return `${startLabel} al ${endLabel}`;
  return `${startLabel} de ${sy} al ${endLabel} de ${ey}`;
}

export function formatMxn(amount: number): string {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    maximumFractionDigits: Number.isInteger(amount) ? 0 : 2,
  }).format(amount);
}

export function retreatInterestOptions(retreats: ScheduledRetreat[]): { id: string; label: string }[] {
  return [
    ...retreats.map((retreat) => ({
      id: retreat.id,
      label: `${retreat.name} (${formatRetreatDates(retreat.startDate, retreat.endDate)})`,
    })),
    RETIRO_OTRO_OPTION,
  ];
}

export function visitDateField(fields: FormField[]): FormField | undefined {
  return (
    fields.find((field) => field.id === "fecha_preferida" && field.type === "date") ??
    fields.find((field) => field.type === "date")
  );
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function requireText(value: unknown, max: number, emptyMessage: string): string {
  if (typeof value !== "string") throw new ContentValidationError(emptyMessage);
  const text = value.trim();
  if (!text) throw new ContentValidationError(emptyMessage);
  if (text.length > max) throw new ContentValidationError("El texto es demasiado largo");
  return text;
}

function optionalText(value: unknown, max: number): string {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, max);
}

function cleanPrice(value: unknown, label: string): number | null {
  if (value == null || value === "") return null;
  const number = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(number) || number < 0 || number > 1_000_000) {
    throw new ContentValidationError(`${label} no es válido`);
  }
  return Math.round(number * 100) / 100;
}

function cleanCapacity(value: unknown): number | null {
  if (value == null || value === "") return null;
  const number = typeof value === "number" ? value : Number(value);
  if (!Number.isInteger(number) || number < 1 || number > 2000) {
    throw new ContentValidationError("El cupo debe ser un entero entre 1 y 2000, o quedar vacío");
  }
  return number;
}

function cleanISODate(value: unknown, label: string): string {
  if (typeof value !== "string") throw new ContentValidationError(`${label} no es válida`);
  const parsed = parseISODate(value);
  if (!parsed) throw new ContentValidationError(`${label} debe usar el formato AAAA-MM-DD`);
  return parsed;
}

function sanitizeOptions(input: unknown): { value: string; label: string }[] {
  if (!Array.isArray(input) || input.length === 0) {
    throw new ContentValidationError("Agregue al menos una opción a la lista");
  }
  if (input.length > 40) throw new ContentValidationError("Hay demasiadas opciones en una pregunta");
  const used = new Set<string>();
  return input.map((item) => {
    if (!isRecord(item)) throw new ContentValidationError("Hay una opción inválida");
    const label = requireText(item.label, 80, "Cada opción necesita un texto");
    const requested = typeof item.value === "string" ? item.value : "";
    return { value: assignStableId(requested, label, used), label };
  });
}

function ensureLockedFields(form: FormSection, fields: FormField[]): FormField[] {
  const defaults = defaultSiteContent().forms[form];
  const next = [...fields];
  for (const locked of defaults.filter((field) => field.locked)) {
    if (next.some((field) => field.id === locked.id)) continue;
    const index = defaults.findIndex((field) => field.id === locked.id);
    next.splice(Math.min(Math.max(index, 0), next.length), 0, locked);
  }
  return next;
}

export function sanitizeFormFields(form: FormSection, input: unknown): FormField[] {
  if (!Array.isArray(input)) throw new ContentValidationError("La lista de preguntas no es válida");
  if (input.length > 30) throw new ContentValidationError("Hay demasiadas preguntas");

  const used = new Set<string>();
  const fields: FormField[] = [];

  for (const raw of input) {
    if (!isRecord(raw)) throw new ContentValidationError("Hay una pregunta inválida");
    const label = requireText(raw.label, 140, "Cada pregunta necesita una etiqueta");
    const requested = typeof raw.id === "string" ? raw.id : "";
    const id = assignStableId(requested, label, used);

    let type: FieldType = EDITABLE_TYPES.has(raw.type as FieldType) ? (raw.type as FieldType) : "text";
    if (raw.type === "retreat") type = "retreat";

    if (id === "nombre") type = "text";
    else if (id === "email") type = "email";
    else if (id === "retiro_interes") {
      if (form !== "retiros") {
        throw new ContentValidationError("La pregunta de retiro solo pertenece al formulario de Retiros");
      }
      type = "retreat";
    } else if (type === "retreat") {
      throw new ContentValidationError("Ese tipo de pregunta no se puede agregar a mano");
    } else if (!EDITABLE_TYPES.has(type)) {
      throw new ContentValidationError("Hay un tipo de pregunta que no se reconoce");
    }

    const locked = id === "nombre" || id === "email" || (form === "retiros" && id === "retiro_interes");
    const required = id === "nombre" || id === "email" ? true : raw.required === true;
    const placeholder = optionalText(raw.placeholder, 160);
    const field: FormField = {
      id,
      label,
      type,
      required,
      locked,
      ...(placeholder ? { placeholder } : {}),
      ...(type === "select" ? { options: sanitizeOptions(raw.options) } : {}),
    };
    fields.push(field);
  }

  const withLocked = ensureLockedFields(form, fields);
  if (withLocked.length > 30) throw new ContentValidationError("Hay demasiadas preguntas");
  return withLocked;
}

export function sanitizeCosts(input: unknown): RentalCosts {
  if (!isRecord(input)) throw new ContentValidationError("Los costos no son válidos");
  if (!COST_MODELS.has(input.model as CostModel)) {
    throw new ContentValidationError("El modelo de costo no es válido");
  }
  const model = input.model as CostModel;
  const pricePerPersonPerDay = cleanPrice(input.pricePerPersonPerDay, "El precio por persona por día");
  const flatRate = cleanPrice(input.flatRate, "La tarifa fija");
  if (model === "per_person_per_day" && pricePerPersonPerDay == null) {
    throw new ContentValidationError("Indique el precio por persona por día");
  }
  if (model === "flat_rate" && flatRate == null) {
    throw new ContentValidationError("Indique la tarifa fija");
  }
  if (!Array.isArray(input.packages)) throw new ContentValidationError("Los paquetes de comida no son válidos");
  if (input.packages.length > 30) throw new ContentValidationError("Hay demasiados paquetes de comida");

  const used = new Set<string>();
  const packages = input.packages.map((item) => {
    if (!isRecord(item)) throw new ContentValidationError("Hay un paquete inválido");
    const name = requireText(item.name, 80, "Cada paquete necesita un nombre");
    const requested = typeof item.id === "string" ? item.id : "";
    return {
      id: assignStableId(requested, name, used),
      name,
      description: optionalText(item.description, 400),
    };
  });

  return {
    model,
    pricePerPersonPerDay,
    flatRate,
    summary: optionalText(input.summary, 2000),
    packages,
  };
}

function safePhoto(src: unknown): string | undefined {
  if (typeof src !== "string") return undefined;
  if (!src.startsWith("/Fotos/") || src.includes("..") || src.includes("\\")) return undefined;
  return src;
}

export function sanitizeAmenities(
  input: unknown,
  options?: { previous?: Amenity[]; trustPhotos?: boolean }
): Amenity[] {
  if (!Array.isArray(input)) throw new ContentValidationError("La lista de amenidades no es válida");
  if (input.length > 24) throw new ContentValidationError("Hay demasiadas amenidades");
  const previous = options?.previous ?? [];
  const trustPhotos = options?.trustPhotos ?? previous.length === 0;
  const previousById = new Map(previous.map((item) => [item.id, item]));
  const used = new Set<string>();

  return input.map((item) => {
    if (!isRecord(item)) throw new ContentValidationError("Hay una amenidad inválida");
    const title = requireText(item.title, 80, "Cada amenidad necesita un nombre");
    const requested = typeof item.id === "string" ? item.id : "";
    const id = assignStableId(requested, title, used);
    const prev = previousById.get(id);
    const src = safePhoto(prev?.src) ?? (trustPhotos ? safePhoto(item.src) : undefined);
    const altSource = prev?.alt ?? (trustPhotos && typeof item.alt === "string" ? item.alt : "");
    const alt = optionalText(altSource, 200);
    const icon = ICONS.has(item.icon as AmenityIcon) ? (item.icon as AmenityIcon) : "general";
    return {
      id,
      title,
      phrase: optionalText(item.phrase, 140),
      icon,
      ...(src ? { src } : {}),
      ...(alt ? { alt } : {}),
    };
  });
}

export function sanitizeRetreats(input: unknown): ScheduledRetreat[] {
  if (!Array.isArray(input)) throw new ContentValidationError("La lista de retiros no es válida");
  if (input.length > 40) throw new ContentValidationError("Hay demasiados retiros");
  const used = new Set<string>();

  return input.map((item) => {
    if (!isRecord(item)) throw new ContentValidationError("Hay un retiro inválido");
    const name = requireText(item.name, 120, "Cada retiro necesita un nombre");
    const requested = typeof item.id === "string" ? item.id : "";
    const id = assignStableId(requested, name, used);
    const startDate = cleanISODate(item.startDate, `La fecha de inicio de «${name}»`);
    const endDate = cleanISODate(item.endDate, `La fecha de fin de «${name}»`);
    if (endDate < startDate) {
      throw new ContentValidationError(`«${name}»: la fecha de fin no puede ser anterior a la de inicio`);
    }
    return {
      id,
      name,
      startDate,
      endDate,
      description: optionalText(item.description, 800),
      capacity: cleanCapacity(item.capacity),
    };
  });
}

export function sanitizeSiteContent(input: unknown): SiteContent {
  const record = isRecord(input) ? input : {};
  const forms = isRecord(record.forms) ? record.forms : {};
  return {
    forms: {
      alquiler: sanitizeFormFields("alquiler", forms.alquiler),
      retiros: sanitizeFormFields("retiros", forms.retiros),
      visitas: sanitizeFormFields("visitas", forms.visitas),
    },
    costs: sanitizeCosts(record.costs),
    amenities: sanitizeAmenities(record.amenities),
    retreats: sanitizeRetreats(record.retreats),
  };
}
