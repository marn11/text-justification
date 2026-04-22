import { SiteShell } from "@/components/site-shell";
import { TokenForm } from "@/components/token-form";

export default function TokenPage() {
  return (
    <SiteShell currentPath="/token">
      <TokenForm />
    </SiteShell>
  );
}
