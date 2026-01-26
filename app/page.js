import { projects } from "@/data/projects";
import WorkList from "@/components/WorkList";

export default function Home() {
  return (
    <main>
      <WorkList projects={projects} />
    </main>
  );
}
