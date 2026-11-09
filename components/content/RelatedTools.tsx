import { TOOLS, type ToolId } from "@/config/tools";
import { ToolCard } from "@/components/common/ToolCard";

export function RelatedTools({ ids }: { ids: ToolId[] }) {
  return (
    <section aria-labelledby="related-tools" className="space-y-4">
      <h2 id="related-tools" className="text-2xl font-bold text-ink">Related tools</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {ids.map((id) => (
          <ToolCard key={id} tool={TOOLS[id]} />
        ))}
      </div>
    </section>
  );
}
