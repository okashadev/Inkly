const topics = ["#ReactNextJS", "#Typography", "#CleanCode", "#UXDesign"]

export function TrendingTopics() {
  return (
    <div className="rounded-2xl border border-outline-variant/5 bg-gradient-to-br from-surface-container-low to-surface-container-high p-8">
      <h4 className="mb-4 text-sm font-medium uppercase tracking-widest text-outline">
        Trending Topics
      </h4>
      <div className="flex flex-wrap gap-2">
        {topics.map((topic) => (
          <button
            key={topic}
            type="button"
            className="cursor-pointer rounded-full bg-secondary px-4 py-2 text-xs font-medium text-secondary-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
          >
            {topic}
          </button>
        ))}
      </div>
    </div>
  )
}
