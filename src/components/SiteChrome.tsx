"use client";

import { usePathname } from "next/navigation";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

export function SiteChrome({
  isAdmin,
  children,
}: {
  isAdmin: boolean;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return children;

  const isFormPage =
    pathname === "/alquiler/solicitud" ||
    pathname === "/retiros/inscripcion" ||
    pathname === "/visitas/registro";

  return (
    <>
      {isFormPage ? null : <SiteHeader isAdmin={isAdmin} />}
      <main className="relative flex-1">{children}</main>
      <SiteFooter isAdmin={isAdmin} />
    </>
  );
}
