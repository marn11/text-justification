import { JustifyWorkspace } from "@/components/justify-workspace";
import { SiteShell } from "@/components/site-shell";

export default function WorkspacePage() {
  return (
    <SiteShell currentPath="/workspace">
      <JustifyWorkspace />
    </SiteShell>
  );
}
