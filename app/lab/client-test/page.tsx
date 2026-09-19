import { ClientHydrationTest } from "@/components/client-hydration-test";
import styles from "./client-test.module.css";

export const metadata = {
  title: "Client Test — LUVEX",
  robots: { index: false, follow: false },
};

export default function ClientTestPage() {
  return (
    <main id="contenido" className={styles.page}>
      <div className={styles.notice}>
        LABORATORIO CLIENTE · NO MODIFICA LA HOMEPAGE
      </div>
      <ClientHydrationTest />
    </main>
  );
}
