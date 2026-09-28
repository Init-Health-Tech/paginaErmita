import { retreatInterestOptions } from "@/lib/contentModel";
import { getFormFields, listRetreats } from "@/lib/siteContent";
import { RequestFormClient } from "./forms/RequestFormClient";

export async function FormRetiros({ initialRetiro = "" }: { initialRetiro?: string }) {
  const [fields, retreats] = await Promise.all([getFormFields("retiros"), listRetreats()]);
  return (
    <RequestFormClient
      type="retiros"
      fields={fields}
      retreatOptions={retreatInterestOptions(retreats)}
      initialRetreat={initialRetiro}
      submitLabel="Solicitar información"
      successMessage="Gracias. Recibira informacion sobre los retiros cuando este disponible. Paz y bien."
    />
  );
}
