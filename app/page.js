import { projects } from "@/data/projects";
import WorkList from "@/components/WorkList";

export default function Home() {
  return (
    <main className="desktop">
      <WorkList projects={projects} />
    </main>
  );
}
