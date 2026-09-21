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
      <header className="yba-page-shell border-b border-black pb-12 pt-16 small:pb-24 small:pt-28">
        <p className="yba-eyebrow">&quot;Editorial&quot;</p>
        <h1 className="yba-display mt-5 text-[clamp(3.5rem,18vw,12rem)] small:mt-7">
          Stories
        </h1>
      </header>

      <main className="yba-page-shell pb-16 small:pb-24">
        <ol>
          {stories.map((story, index) => (
            <li key={story.title}>
              <article className="group grid grid-cols-1 gap-4 border-b border-black/25 py-8 transition-colors hover:bg-black hover:text-white small:min-h-44 small:grid-cols-[14rem_1fr_auto] small:items-center small:gap-6 small:py-12 small:hover:px-6">
                <p className="font-mono text-[11px] uppercase tracking-[0.25em] opacity-60">
                  &quot;{story.type}&quot;
                </p>
                <h2 className="max-w-5xl font-display text-3xl uppercase leading-[0.95] tracking-[-0.025em] xsmall:text-4xl medium:text-5xl">
                  <span className="mr-2 font-mono text-xs font-normal opacity-40 transition-opacity small:mr-3 small:opacity-0 small:group-hover:opacity-60">
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
