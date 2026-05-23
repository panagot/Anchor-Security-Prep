export default function RulesLoading() {
  return (
    <div className="space-y-10">
      <div className="space-y-3">
        <div className="h-3 w-24 animate-pulse bg-[var(--line)]" />
        <div className="h-8 w-64 animate-pulse bg-[var(--line)]" />
        <div className="h-4 w-96 max-w-full animate-pulse bg-[var(--line)]" />
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="panel animate-pulse">
            <div className="panel-inner h-36" />
          </div>
        ))}
      </div>
    </div>
  );
}
