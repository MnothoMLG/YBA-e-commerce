import { Metadata } from "next"

const stories = [
  {
    type: "Interview",
    title: "Inside the Kyalami capsule with Kabelo Legodi",
    date: "26.05.26",
    readTime: "8 min",
  },
  {
    type: "Field note",
    title: "From Seshego to Jozi — a brand origin",
    date: "12.04.26",
    readTime: "5 min",
  },
  {
    type: "Process",
    title: "Reconstructing denim from industrial off-cuts",
    date: "03.03.26",
    readTime: "6 min",
  },
  {
    type: "Editorial",
    title: "The patch archive — sponsor codes reimagined",
    date: "14.02.26",
    readTime: "10 min",
  },
]

export const metadata: Metadata = {
  title: "Stories",
  description: "Field notes, interviews and process stories from YBA.",
}

export default function StoriesPage() {
  return (
    <div className="bg-yba-paper">
      <header className="yba-page-shell border-b border-black pb-16 pt-24 small:pb-24 small:pt-28">
        <p className="yba-eyebrow">&quot;Editorial&quot;</p>
        <h1 className="yba-display mt-7 text-[clamp(4.5rem,12vw,12rem)]">
          Stories
        </h1>
      </header>

      <main className="yba-page-shell pb-24">
        <ol>
          {stories.map((story, index) => (
            <li key={story.title}>
              <article className="group grid min-h-44 grid-cols-1 gap-6 border-b border-black/25 py-10 transition-colors hover:bg-black hover:text-white small:grid-cols-[14rem_1fr_auto] small:items-center small:px-0 small:py-12 small:hover:px-6">
                <p className="font-mono text-[11px] uppercase tracking-[0.25em] opacity-60">
                  &quot;{story.type}&quot;
                </p>
                <h2 className="max-w-5xl font-display text-3xl uppercase leading-[0.95] tracking-[-0.025em] xsmall:text-4xl medium:text-5xl">
                  <span className="mr-3 font-mono text-xs font-normal opacity-0 transition-opacity group-hover:opacity-60">
                    0{index + 1}
                  </span>
                  {story.title}
                </h2>
                <p className="whitespace-nowrap font-mono text-[11px] uppercase tracking-[0.23em] opacity-55">
                  {story.date} · {story.readTime}
                </p>
              </article>
            </li>
          ))}
        </ol>
      </main>
    </div>
  )
}
