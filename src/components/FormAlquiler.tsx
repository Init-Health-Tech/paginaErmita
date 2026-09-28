import { getFormFields } from "@/lib/siteContent";
import { RequestFormClient } from "./forms/RequestFormClient";

export async function FormAlquiler() {
  const fields = await getFormFields("alquiler");
  return (
    <RequestFormClient
      type="alquiler"
      fields={fields}
      submitLabel="Enviar solicitud"
      successMessage="Hemos recibido su solicitud. Nos pondremos en contacto a la mayor brevedad. Paz y bien."
    />
  );
}
