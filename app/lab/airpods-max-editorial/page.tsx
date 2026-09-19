import { AirPodsMaxEditorialLab } from "@/components/airpods-max-editorial-lab";
import styles from "./lab.module.css";

export const metadata = {
  title: "Editorial Motion Lab — AirPods Max",
  robots: { index: false, follow: false },
};

export default function AirPodsMaxEditorialLabPage() {
  return (
    <main id="contenido" className={styles.page}>
      <AirPodsMaxEditorialLab />
    </main>
  );
}
