import { getFormFields } from "@/lib/siteContent";
import { RequestFormClient } from "./forms/RequestFormClient";

export async function FormVisitas() {
  const fields = await getFormFields("visitas");
  return (
    <RequestFormClient
      type="visitas"
      fields={fields}
      submitLabel="Registrar visita"
      successMessage="Paz y bien."
    />
  );
}
