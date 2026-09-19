import { AirPodsMax3DLab } from "@/components/airpods-max-3d-lab";
import styles from "./lab.module.css";

export const metadata = {
  title: "3D Lab — AirPods Max",
  robots: { index: false, follow: false },
};

export default function AirPodsMax3DLabPage() {
  return (
    <main id="contenido" className={styles.page}>
      <div className={styles.notice}>
        LABORATORIO INTERNO · NO MODIFICA LA HOMEPAGE
      </div>
      <AirPodsMax3DLab />
    </main>
  );
}
