import Studio from "../../components/admin/Studio";
import PageScripts from "../../components/PageScripts";
import "../../admin/studio.css";
export const metadata = {
  title: "Journal Studio · Khem",
  robots: { index: false, follow: false },
};
export default function Admin() {
  return (
    <>
      <Studio />
      <PageScripts kind="admin" />
    </>
  );
}
