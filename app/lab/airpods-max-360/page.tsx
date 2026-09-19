import { AirPodsMax360Lab } from "@/components/airpods-max-360-lab";
import styles from "./lab.module.css";

export const metadata = {
  title: "360 Lab — AirPods Max",
  robots: { index: false, follow: false },
};

export default function AirPodsMax360LabPage() {
  return (
    <main id="contenido" className={styles.page}>
      <div className={styles.notice}>
        LABORATORIO 360 · NO MODIFICA LA HOMEPAGE
      </div>
      <AirPodsMax360Lab />
    </main>
  );
}
