
import { useEffect, useState } from 'react'
import Papa from 'papaparse'
import { Link } from 'react-router-dom'

const SHEET_URL =
  'https://docs.google.com/spreadsheets/d/e/2PACX-1vQWRTAVB4A2Nx3qtXg8p_b6w1yRdYp_bKbycTuPyZRsRlzLxvloddMU1s-gcHeQkvlmrVOdZeWgrrx1/pub?output=csv&gid=0'

const BOWLING_URL =
  'https://docs.google.com/spreadsheets/d/e/2PACX-1vQWRTAVB4A2Nx3qtXg8p_b6w1yRdYp_bKbycTuPyZRsRlzLxvloddMU1s-gcHeQkvlmrVOdZeWgrrx1/pub?output=csv&gid=1841998730'

const parseCSV = (url, callback) => {
  Papa.parse(url, {
    download: true,
    header: true,
    complete: (results) => {
      callback(results.data.filter((player) => player.Player))
    },
    error: (error) => {
      console.error('Failed to load stats:', error)
      callback([])
    },
  })
}

const number = (value) => {
  const parsed = parseFloat(value)
  return Number.isFinite(parsed) ? parsed : 0
}

const awards = [
  {
    title: 'Most Man Of The Matches',
    stat: 'MOTM',
    label: 'PLAYER OF THE MATCH',
    color: 'from-yellow-300 to-orange-500',
    glow: 'bg-amber-400',
    text: 'text-amber-300',
    border: 'border-amber-400/20',
    icon: '★',
    source: 'motm',
    sort: (a, b) => number(b.MOTM) - number(a.MOTM),
  },
  {
    title: 'Highest Individual Scores',
    stat: 'Highest',
    label: 'TOP SCORE',
    color: 'from-orange-400 to-red-500',
    glow: 'bg-orange-500',
    text: 'text-orange-300',
    border: 'border-orange-400/20',
    icon: '↗',
    source: 'batting',
    sort: (a, b) =>
      parseInt(b.Highest || 0) - parseInt(a.Highest || 0),
  },
  {
    title: 'Strike Rate Monsters',
    stat: 'Strike Rate',
    label: 'STRIKE RATE',
    color: 'from-cyan-400 to-blue-500',
    glow: 'bg-cyan-400',
    text: 'text-cyan-300',
    border: 'border-cyan-400/20',
    icon: '⚡',
    source: 'batting',
    filter: (p) => number(p.Runs) > 100,
    sort: (a, b) => number(b['Strike Rate']) - number(a['Strike Rate']),
  },
  {
    title: 'Most Thirties',
    stat: 'Thirties',
    label: '30+ SCORES',
    color: 'from-lime-400 to-green-500',
    glow: 'bg-lime-400',
    text: 'text-lime-300',
    border: 'border-lime-400/20',
    icon: '◈',
    source: 'batting',
    sort: (a, b) => number(b.Thirties) - number(a.Thirties),
  },
  {
    title: 'Most Six Hitters',
    stat: 'Sixes',
    label: 'MAXIMUMS',
    color: 'from-pink-400 to-purple-500',
    glow: 'bg-pink-400',
    text: 'text-pink-300',
    border: 'border-pink-400/20',
    icon: '✦',
    source: 'batting',
    sort: (a, b) => number(b.Sixes) - number(a.Sixes),
  },
  {
    title: 'Economy Gods',
    stat: 'Economy',
    label: 'ECONOMY',
    color: 'from-emerald-400 to-green-500',
    glow: 'bg-emerald-400',
    text: 'text-emerald-300',
    border: 'border-emerald-400/20',
    icon: '◉',
    source: 'bowling',
    filter: (p) => number(p.Overs) >= 5,
    sort: (a, b) => number(a.Economy) - number(b.Economy),
  },
  {
    title: 'Most Fifties',
    stat: 'Fifties',
    label: 'HALF CENTURIES',
    color: 'from-yellow-400 to-amber-500',
    glow: 'bg-yellow-400',
    text: 'text-yellow-300',
    border: 'border-yellow-400/20',
    icon: '◆',
    source: 'batting',
    sort: (a, b) => number(b.Fifties) - number(a.Fifties),
  },
  {
    title: 'On The Go 4s',
    stat: 'Fours',
    label: 'BOUNDARIES',
    color: 'from-yellow-300 to-orange-400',
    glow: 'bg-yellow-300',
    text: 'text-yellow-200',
    border: 'border-yellow-400/20',
    icon: '▰',
    source: 'batting',
    sort: (a, b) => number(b.Fours) - number(a.Fours),
  },
  {
    title: 'Dot Ball Kings',
    stat: 'DotBalls',
    label: 'DOT BALLS',
    color: 'from-violet-400 to-indigo-500',
    glow: 'bg-violet-400',
    text: 'text-violet-300',
    border: 'border-violet-400/20',
    icon: '●',
    source: 'bowling',
    sort: (a, b) => number(b.DotBalls) - number(a.DotBalls),
  },
]

function SectionHeading({ eyebrow, title, description, color = 'cyan' }) {
  const colors = {
    cyan: 'text-cyan-300',
    red: 'text-red-400',
  }

  return (
    <div className="mb-8 md:mb-10">
      <div className="flex items-center gap-3 mb-3">
        <span className={`h-px w-8 ${color === 'red' ? 'bg-red-500' : 'bg-cyan-400'}`} />
        <span className={`text-[10px] sm:text-xs font-bold uppercase tracking-[0.25em] ${colors[color]}`}>
          {eyebrow}
        </span>
      </div>

      <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white">
        {title}
        <span className={colors[color]}>.</span>
      </h2>

      <p className="mt-3 text-sm md:text-base text-slate-500">
        {description}
      </p>
    </div>
  )
}

function LeaderboardCard({ award, players, index }) {
  const winner = players[0]
  const others = players.slice(1, 5)

  return (
    <article
      className={`group relative flex flex-col overflow-hidden rounded-3xl border ${award.border} bg-[#0b1220] transition-all duration-300 hover:-translate-y-1 hover:border-white/20 hover:shadow-2xl`}
    >
      {/* Ambient accent */}
      <div className={`pointer-events-none absolute -right-16 -top-20 h-48 w-48 rounded-full ${award.glow} opacity-[0.07] blur-3xl transition-opacity group-hover:opacity-[0.15]`} />

      {/* Card header */}
      <div className="relative flex items-start justify-between border-b border-white/[0.06] px-5 py-5 sm:px-6">
        <div className="min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
            Award {String(index + 1).padStart(2, '0')}
          </p>

          <h3 className="mt-2 text-lg font-extrabold leading-tight text-white sm:text-xl">
            {award.title}
          </h3>
        </div>

        <div className={`ml-3 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${award.border} bg-white/[0.03] text-xl ${award.text}`}>
          {award.icon}
        </div>
      </div>

      {/* Winner */}
      <div className="relative flex-1 p-5 sm:p-6">
        {winner ? (
          <>
            <div className="mb-5 flex items-center justify-between">
              <span className={`rounded-full border ${award.border} bg-white/[0.03] px-3 py-1.5 text-[9px] font-bold tracking-[0.16em] ${award.text}`}>
                #01 · LEADER
              </span>

              <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-600">
                STRIQ AWARDS
              </span>
            </div>

            <div className="mb-6">
              <p className={`bg-gradient-to-r ${award.color} bg-clip-text text-transparent text-5xl font-black leading-none tracking-tight sm:text-6xl`}>
                {winner[award.stat] ?? '0'}
              </p>

              {award.stat === 'Highest' && winner.HighB && (
                <p className="mt-2 text-xs font-medium text-slate-500">
                  Not out: {winner.HighB}
                </p>
              )}

              <p className="mt-4 break-words text-xl font-extrabold text-white sm:text-2xl">
                {winner.Player}
              </p>

              <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                {award.label}
              </p>
            </div>

            {/* Runner-up list */}
            <div className="border-t border-white/[0.06] pt-4">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-600">
                  The challengers
                </p>
                <span className="text-[10px] text-slate-700">TOP 5</span>
              </div>

              {others.length ? (
                <div className="space-y-1">
                  {others.map((player, i) => (
                    <div
                      key={`${player.Player}-${i}`}
                      className="flex items-center gap-3 rounded-xl px-2 py-3 transition hover:bg-white/[0.03]"
                    >
                      <span className="w-5 shrink-0 font-mono text-xs font-bold text-slate-600">
                        {String(i + 2).padStart(2, '0')}
                      </span>

                      <span className="min-w-0 flex-1 truncate text-sm font-semibold text-slate-300">
                        {player.Player}
                      </span>

                      <span className={`shrink-0 text-sm font-bold tabular-nums ${award.text}`}>
                        {player[award.stat] ?? '0'}
                        {award.stat === 'Highest' && player.HighB && (
                          <span className="ml-1 text-xs font-normal text-slate-500">
                            ({player.HighB})
                          </span>
                        )}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="py-4 text-sm text-slate-600">
                  No other qualified players yet.
                </p>
              )}
            </div>
          </>
        ) : (
          <div className="flex min-h-64 flex-col items-center justify-center text-center">
            <span className="text-3xl text-slate-700">—</span>
            <p className="mt-3 text-sm font-semibold text-slate-500">
              Waiting for the stats to roll in
            </p>
            <p className="mt-1 text-xs text-slate-700">
              No qualified players yet
            </p>
          </div>
        )}
      </div>

      {/* Bottom accent */}
      <div className={`h-[2px] w-full bg-gradient-to-r ${award.color} opacity-50 transition-opacity group-hover:opacity-100`} />
    </article>
  )
}

function ShameCard({ title, stat, player, index }) {
  return (
    <article className="group relative overflow-hidden rounded-3xl border border-red-500/15 bg-[#100c15] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-red-500/30 sm:p-7">
      <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-red-600 opacity-[0.06] blur-3xl" />

      <div className="relative flex items-center justify-between">
        <span className="rounded-full border border-red-500/20 bg-red-500/[0.06] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.15em] text-red-400">
          Dishonour {String(index + 1).padStart(2, '0')}
        </span>

        <span className="text-lg text-red-500/60">✕</span>
      </div>

      <div className="relative mt-8">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-red-400/60">
          {title}
        </p>

        <h3 className="mt-3 break-words text-4xl font-black tracking-tight text-red-400 sm:text-5xl">
          {stat}
        </h3>

        <p className="mt-4 text-xl font-extrabold text-white">
          {player}
        </p>

        <div className="mt-6 flex items-center gap-2 border-t border-red-500/10 pt-4">
          <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
          <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-600">
            Hall of Shame
          </span>
        </div>
      </div>
    </article>
  )
}

export default function HallOfFame() {
  const [battingData, setBattingData] = useState([])
  const [bowlingData, setBowlingData] = useState([])
  const [motmData, setMotmData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let completed = 0

    const finishFetch = () => {
      completed += 1
      if (completed >= 3) setLoading(false)
    }

    parseCSV(SHEET_URL, (data) => {
      setBattingData(data)
      finishFetch()
    })

    parseCSV(BOWLING_URL, (data) => {
      setBowlingData(data)
      finishFetch()
    })

    parseCSV(SHEET_URL, (data) => {
      setMotmData(data)
      finishFetch()
    })

    const timer = setTimeout(() => setLoading(false), 8000)
    return () => clearTimeout(timer)
  }, [])

  const getPlayers = (award) => {
    const source =
      award.source === 'bowling'
        ? bowlingData
        : award.source === 'motm'
          ? motmData
          : battingData

    return [...source]
      .filter((player) => !award.filter || award.filter(player))
      .sort(award.sort)
      .slice(0, 5)
  }

  const maxDucks = battingData.length
    ? Math.max(...battingData.map((p) => number(p.Ducks)))
    : 0

  const duckKings = battingData.filter(
    (p) => number(p.Ducks) === maxDucks && maxDucks > 0
  )

  const worstBowling = [...bowlingData].sort(
    (a, b) => number(b.WorstBowling) - number(a.WorstBowling)
  )[0]

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#030712] text-white">
        <div className="relative flex h-24 w-24 items-center justify-center">
          <div className="absolute inset-0 animate-ping rounded-full bg-cyan-400/10" />
          <img
            src="/striq-icon.svg"
            alt="STRIQ"
            className="relative h-16 w-16 animate-pulse"
          />
        </div>

        <h1 className="mt-6 text-4xl font-black tracking-tight sm:text-6xl">
          STRIQ<span className="text-cyan-400">.</span>
        </h1>

        <p className="mt-3 text-[10px] font-bold uppercase tracking-[0.3em] text-slate-500">
          Loading the honours
        </p>

        <div className="mt-6 h-1 w-40 overflow-hidden rounded-full bg-white/5">
          <div className="h-full w-1/2 animate-pulse rounded-full bg-cyan-400" />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen overflow-hidden bg-[#030712] pb-12 text-white">

      {/* NAVIGATION */}
      <nav className="sticky top-0 z-50 border-b border-white/[0.06] bg-[#030712]/85 backdrop-blur-2xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-3">
            <img
              src="/striq-icon.svg"
              alt="STRIQ"
              className="h-9 w-9"
            />

            <div>
              <h1 className="text-xl font-black tracking-tight sm:text-2xl">
                STRIQ<span className="text-cyan-400">.</span>
              </h1>
              <p className="hidden text-[9px] font-bold uppercase tracking-[0.2em] text-slate-600 sm:block">
                Local cricket. Real numbers.
              </p>
            </div>
          </Link>

          <div className="flex items-center gap-2 sm:gap-4">
            <Link
              to="/gallery"
              className="hidden rounded-xl px-4 py-2 text-sm font-semibold text-slate-400 transition hover:bg-white/5 hover:text-white sm:block"
            >
              Gallery
            </Link>

            <Link
              to="/scoreboard"
              className="hidden rounded-xl px-4 py-2 text-sm font-semibold text-slate-400 transition hover:bg-white/5 hover:text-white sm:block"
            >
              Scoreboard
            </Link>

            <Link
              to="/"
              className="rounded-xl border border-cyan-400/20 bg-cyan-400/10 px-4 py-2.5 text-xs font-black tracking-wide text-cyan-300 transition hover:bg-cyan-400 hover:text-black sm:px-5"
            >
              HOME ↗
            </Link>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <header className="relative mx-auto max-w-7xl px-4 pb-14 pt-14 sm:px-6 sm:pb-20 sm:pt-20 lg:px-8">
        <div className="pointer-events-none absolute -top-20 left-1/2 h-80 w-[80%] -translate-x-1/2 rounded-full bg-cyan-500/[0.07] blur-[120px]" />

        <div className="relative">
          <div className="mb-6 flex flex-wrap items-center gap-3">
            <span className="flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/[0.06] px-4 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-300">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-cyan-400" />
              STRIQ · AWARDS
            </span>

            <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-600">
              Player honours & records
            </span>
          </div>

          <h1 className="max-w-4xl text-5xl font-black leading-[0.95] tracking-tight sm:text-7xl md:text-8xl">
            <span className="bg-gradient-to-r from-white via-slate-300 to-slate-500 bg-clip-text text-transparent">
              THE HALL OF FAME.
            </span>
          </h1>

          <div className="mt-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <p className="max-w-lg text-sm leading-7 text-slate-400 sm:text-base">
              Every boundary, every wicket, every match-winning performance.
              The numbers speak. These are the names that made them count.
            </p>

            <div className="flex gap-3">
              <a
                href="#honours"
                className="rounded-xl bg-cyan-400 px-5 py-3 text-xs font-black uppercase tracking-wide text-black transition hover:bg-cyan-300"
              >
                Explore awards ↓
              </a>

              <a
                href="#shame"
                className="rounded-xl border border-white/10 bg-white/[0.03] px-5 py-3 text-xs font-bold uppercase tracking-wide text-slate-400 transition hover:border-red-500/30 hover:text-red-400"
              >
                The other side
              </a>
            </div>
          </div>

          {/* Stats strip */}
          <div className="mt-12 grid grid-cols-3 divide-x divide-white/[0.06] rounded-2xl border border-white/[0.06] bg-white/[0.02] py-5">
            <div className="px-3 text-center sm:px-6">
              <p className="text-2xl font-black text-white sm:text-3xl">
                {awards.length}
              </p>
              <p className="mt-1 text-[9px] font-bold uppercase tracking-[0.15em] text-slate-600 sm:text-xs">
                Award categories
              </p>
            </div>

            <div className="px-3 text-center sm:px-6">
              <p className="text-2xl font-black text-cyan-300 sm:text-3xl">
                {battingData.length}
              </p>
              <p className="mt-1 text-[9px] font-bold uppercase tracking-[0.15em] text-slate-600 sm:text-xs">
                Batters tracked
              </p>
            </div>

            <div className="px-3 text-center sm:px-6">
              <p className="text-2xl font-black text-violet-300 sm:text-3xl">
                {bowlingData.length}
              </p>
              <p className="mt-1 text-[9px] font-bold uppercase tracking-[0.15em] text-slate-600 sm:text-xs">
                Bowlers tracked
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* HALL OF FAME */}
      <main id="honours" className="mx-auto max-w-7xl scroll-mt-28 px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="The numbers don't lie"
          title="The Honours."
          description="Ranked by the stats. Earned on the field."
        />

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {awards.map((award, index) => (
            <LeaderboardCard
              key={award.title}
              award={award}
              players={getPlayers(award)}
              index={index}
            />
          ))}
        </div>
      </main>

      {/* HALL OF SHAME */}
      <section id="shame" className="mx-auto mt-24 max-w-7xl scroll-mt-28 px-4 sm:mt-32 sm:px-6 lg:px-8">
        <div className="mb-10 border-t border-red-500/10 pt-12 sm:pt-16">
          <SectionHeading
            eyebrow="Not every record is a good one"
            title="Hall of Shame."
            description="The other side of the scorecard. Some records are best left unbroken."
            color="red"
          />
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          <ShameCard
            title="Most Ducks"
            stat={maxDucks}
            player={
              duckKings.length
                ? duckKings.map((p) => p.Player).join(', ')
                : 'No records yet'
            }
            index={0}
          />

          <ShameCard
  title="Worst Bowling"
  stat="44 (9 balls)"
  player="Shouryam"
  index={1}
/>

          <ShameCard
            title="Slowest Knock"
            stat="9 (13 balls)"
            player="Kartik"
            index={2}
          />
        </div>
      </section>

      {/* FOOTER */}
      <footer className="mx-auto mt-20 max-w-7xl border-t border-white/[0.06] px-4 pt-10 text-center sm:px-6 lg:px-8">
        <Link
          to="/"
          className="inline-flex items-center gap-3 rounded-2xl border border-cyan-400/20 bg-cyan-400/[0.06] px-7 py-4 text-xs font-black uppercase tracking-wide text-cyan-300 transition hover:bg-cyan-400 hover:text-black"
        >
          ← Back to STRIQ
        </Link>

        <div className="mt-8 flex items-center justify-center gap-2">
          <img src="/striq-icon.svg" alt="" className="h-5 w-5 opacity-50" />
          <p className="text-xs font-black tracking-wide text-slate-600">
            STRIQ<span className="text-cyan-400">.</span>
          </p>
        </div>

        <p className="mt-2 text-[10px] text-slate-700">
          Built by Atharva Mehta · Local cricket, real numbers.
        </p>
      </footer>
    </div>
  )
}