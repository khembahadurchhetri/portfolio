import Entry from "../../components/portfolio/Entry";
import PageScripts from "../../components/PageScripts";
import "../../admin/studio.css";
export const metadata = { title: "Journal · Khem" };
export default function JournalEntry() {
  return (
    <>
      <Entry />
      <PageScripts kind="entry" />
    </>
  );
}
