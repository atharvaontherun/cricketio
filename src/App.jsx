import { useEffect, useMemo, useState } from 'react'
import Papa from 'papaparse'
import { Link } from 'react-router-dom'
import {
  Activity, ArrowDownRight, ArrowUpRight, Award, BarChart3, ChevronDown,
  CircleHelp, LayoutDashboard, Search, Shield, Users, Zap, Menu, X
} from 'lucide-react'
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid
} from 'recharts'

const BATTING_CSV =
  'https://docs.google.com/spreadsheets/d/e/2PACX-1vQWRTAVB4A2Nx3qtXg8p_b6w1yRdYp_bKbycTuPyZRsRlzLxvloddMU1s-gcHeQkvlmrVOdZeWgrrx1/pub?output=csv&gid=0'
const BOWLING_CSV =
  'https://docs.google.com/spreadsheets/d/e/2PACX-1vQWRTAVB4A2Nx3qtXg8p_b6w1yRdYp_bKbycTuPyZRsRlzLxvloddMU1s-gcHeQkvlmrVOdZeWgrrx1/pub?output=csv&gid=1841998730'

const n = (value) => {
  const parsed = Number(String(value ?? '').replace('*', '').trim())
  return Number.isFinite(parsed) ? parsed : 0
}
const initials = (name = '') =>
  name.trim().split(/\s+/).slice(0, 2).map((part) => part[0] || '').join('').toUpperCase()

function PlayerAvatar({ name, size = 'md', className = '' }) {
  const [failed, setFailed] = useState(false)

  const sizes = {
    sm: 'h-9 w-9 text-xs',
    md: 'h-12 w-12 text-sm',
    lg: 'h-20 w-20 text-xl',
    xl: 'h-28 w-28 text-3xl',
  }

  const photoMap = {
    ashish: 'ashish-2.jpg',
    atharva: 'atharva.jpeg',
    ayush: 'ayush.png',
    hardik: 'hardik-2.jpg',
    kartik: 'kartik.png',
    shouryam: 'shouryam.jpeg',
  }

  const key = name.trim().toLowerCase()
  const imageFile = photoMap[key]

  return (
    <div
      className={`${sizes[size]} ${className} relative flex shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-cyan-400/30 to-blue-600/30 font-bold text-cyan-100 ring-1 ring-white/10`}
    >
      {imageFile && !failed ? (
        <img
          src={`/players/${imageFile}`}
          alt={name}
          className="h-full w-full object-cover"
          onError={() => setFailed(true)}
        />
      ) : (
        <span>{initials(name)}</span>
      )}
    </div>
  )
}
function StatCard({ label, value, note, icon: Icon, accent = 'cyan' }) {
  const accents = {
    cyan: 'text-cyan-300 bg-cyan-400/10 ring-cyan-400/20',
    amber: 'text-amber-300 bg-amber-400/10 ring-amber-400/20',
    violet: 'text-violet-300 bg-violet-400/10 ring-violet-400/20',
    emerald: 'text-emerald-300 bg-emerald-400/10 ring-emerald-400/20',
  }
  return (
    <div className="rounded-2xl border border-white/[0.07] bg-[#101827] p-5 transition hover:border-white/15">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-slate-400">{label}</p>
          <p className="mt-3 text-3xl font-semibold tracking-tight text-white">{value}</p>
          <p className="mt-2 text-xs text-slate-500">{note}</p>
        </div>
        <div className={`rounded-xl p-3 ring-1 ${accents[accent]}`}>
          <Icon size={19} />
        </div>
      </div>
    </div>
  )
}

function SectionHeading({ eyebrow, title, action }) {
  return (
    <div className="mb-5 flex items-end justify-between gap-4">
      <div>
        {eyebrow && <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-cyan-300">{eyebrow}</p>}
        <h2 className="text-xl font-semibold tracking-tight text-white sm:text-2xl">{title}</h2>
      </div>
      {action}
    </div>
  )
}

export default function CricketIO() {
  const [battingData, setBattingData] = useState([])
  const [bowlingData, setBowlingData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [query, setQuery] = useState('')
  const [mobileNav, setMobileNav] = useState(false)
  const [spotlightIndex, setSpotlightIndex] = useState(0)
  const [spotlightPaused, setSpotlightPaused] = useState(false)

  useEffect(() => {
    let battingDone = false
    let bowlingDone = false
    const finish = () => {
      if (battingDone && bowlingDone) setLoading(false)
    }

    Papa.parse(BATTING_CSV, {
      download: true,
      header: true,
      complete: (results) => {
        const rows = (results.data || []).filter((player) => player.Player)
        setBattingData(rows.sort((a, b) => n(b.Runs) - n(a.Runs)))
        battingDone = true
        finish()
      },
      error: () => {
        setError(true)
        battingDone = true
        finish()
      },
    })

    Papa.parse(BOWLING_CSV, {
      download: true,
      header: true,
      complete: (results) => {
        const rows = (results.data || []).filter((player) => player.Player)
        setBowlingData(rows.sort((a, b) => n(b.Wickets) - n(a.Wickets)))
        bowlingDone = true
        finish()
      },
      error: () => {
        setError(true)
        bowlingDone = true
        finish()
      },
    })

    const timer = setTimeout(() => setLoading(false), 10000)
    return () => clearTimeout(timer)
  }, [])

  const bowlingByPlayer = useMemo(
    () => new Map(bowlingData.map((player) => [player.Player, player])),
    [bowlingData]
  )

  const primeCapData = useMemo(() => battingData.map((player) => {
    const bowler = bowlingByPlayer.get(player.Player) || {}
    const points =
      n(player.Runs) +
      n(bowler.Wickets) * 20 +
      n(player.MOTM) * 15 +
      n(player.Hundreds) * 30 +
      n(player.Fifties) * 20 +
      n(player.Thirties) * 15 +
      n(bowler.DotBalls) * 0.5
    return { ...player, PrimePoints: Math.round(points) }
  }).sort((a, b) => b.PrimePoints - a.PrimePoints), [battingData, bowlingByPlayer])

  const totalRuns = battingData.reduce((sum, player) => sum + n(player.Runs), 0)
  const totalWickets = bowlingData.reduce((sum, player) => sum + n(player.Wickets), 0)
  const totalPlayers = new Set([...battingData, ...bowlingData].map((p) => p.Player)).size
  const motmTotal = battingData.reduce((sum, player) => sum + n(player.MOTM), 0)
  const orangeLeader = battingData[0]
  const purpleLeader = bowlingData[0]
  const primeLeader = primeCapData[0]

  // Build the complete roster independently of the search box so every player
  // gets included in the rotating spotlight.
  const spotlightPlayers = useMemo(() => {
  const all = new Map();

  battingData.forEach((player) => {
    const bowling = bowlingByPlayer.get(player.Player) || {};

    const merged = {
      ...player,
      ...bowling,
    };

    const primePoints =
      n(merged.Runs) +
      n(merged.Wickets) * 20 +
      n(merged.MOTM) * 15 +
      n(merged.Hundreds) * 30 +
      n(merged.Fifties) * 20 +
      n(merged.Thirties) * 15 +
      n(merged.DotBalls) * 0.5;

    all.set(player.Player, {
      ...merged,
      PrimePoints: primePoints,
    });
  });

  bowlingData.forEach((player) => {
    if (!all.has(player.Player)) {
      const primePoints =
        n(player.Runs) +
        n(player.Wickets) * 20 +
        n(player.MOTM) * 15 +
        n(player.Hundreds) * 30 +
        n(player.Fifties) * 20 +
        n(player.Thirties) * 15 +
        n(player.DotBalls) * 0.5;

      all.set(player.Player, {
        ...player,
        PrimePoints: primePoints,
      });
    }
  });

  return [...all.values()].sort(
    (a, b) => b.PrimePoints - a.PrimePoints
  );
}, [battingData, bowlingData, bowlingByPlayer]);
  const roster = useMemo(
    () =>
      spotlightPlayers.filter((player) =>
        (player.Player || '').toLowerCase().includes(query.toLowerCase())
      ),
    [spotlightPlayers, query]
  )

  // Keep the selected index valid if the Google Sheets roster changes.
  useEffect(() => {
    if (spotlightIndex >= spotlightPlayers.length) {
      setSpotlightIndex(0)
    }
  }, [spotlightIndex, spotlightPlayers.length])

  // Advance to the next player every six seconds.
  useEffect(() => {
    if (spotlightPaused || spotlightPlayers.length <= 1) return

    const interval = setInterval(() => {
      setSpotlightIndex((current) => (current + 1) % spotlightPlayers.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [spotlightPaused, spotlightPlayers.length])

  const featured = spotlightPlayers[spotlightIndex]
  const nextSpotlight = () => {
    if (spotlightPlayers.length) {
      setSpotlightIndex((current) => (current + 1) % spotlightPlayers.length)
    }
  }
  const previousSpotlight = () => {
    if (spotlightPlayers.length) {
      setSpotlightIndex(
        (current) => (current - 1 + spotlightPlayers.length) % spotlightPlayers.length
      )
    }
  }

  const chartData = [...battingData]
    .sort((a, b) => n(b.Runs) - n(a.Runs))
    .slice(0, 7)
    .reverse()
    .map((player) => ({ name: player.Player.split(' ')[0], runs: n(player.Runs) }))

  if (loading) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#080d17] text-white">

      {/* STRIQ Logo */}
      <div className="mb-5 flex h-20 w-20 items-center justify-center">
        <img
          src="/striq-icon.svg"
          alt="STRIQ Logo"
          className="h-full w-full object-contain"
        />
      </div>

      {/* Brand Name */}
      <h1 className="text-3xl font-bold tracking-[0.25em]">
        STRIQ
      </h1>

      <p className="mt-3 text-sm text-slate-500">
        BY ATHARVA MEHTA
      </p>

      {/* Loading Bar */}
      <div className="mt-6 h-1 w-40 overflow-hidden rounded-full bg-white/10">
        <div className="h-full w-1/2 animate-pulse rounded-full bg-cyan-400" />
      </div>

    </div>
  );
}

  const navItems = [
    { label: 'Overview', icon: LayoutDashboard, href: '#overview' },
    { label: 'Player roster', icon: Users, href: '#roster' },
    { label: 'Batting & bowling', icon: BarChart3, href: '#leaderboards' },
  ]

  return (
    <div className="min-h-screen bg-[#080d17] text-slate-100">
      {mobileNav && <button aria-label="Close navigation" className="fixed inset-0 z-40 bg-black/60 lg:hidden" onClick={() => setMobileNav(false)} />}
      <aside className={`fixed inset-y-0 left-0 z-50 flex w-[250px] flex-col border-r border-white/[0.07] bg-[#0c1320] px-5 py-6 transition-transform lg:translate-x-0 ${mobileNav ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="mb-10 flex items-center justify-between">
          <a href="#overview" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl">
  <img
    src="/striq-icon.svg"
    alt="STRIQ"
    className="h-full w-full object-contain"
  />
</div>
            <div>
              <div className="text-xl font-black tracking-[0.18em] text-white">STRIQ</div>
              <div className="text-[10px] uppercase tracking-[0.19em] text-slate-500">BY ATHARVA MEHTA</div>
            </div>
          </a>
          <button className="text-slate-400 lg:hidden" onClick={() => setMobileNav(false)} aria-label="Close menu"><X size={20} /></button>
        </div>

        <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-600">Workspace</p>
        <nav className="space-y-1">
          {navItems.map(({ label, icon: Icon, href }, index) => (
            <a key={label} href={href} onClick={() => setMobileNav(false)} className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition ${index === 0 ? 'bg-cyan-400/10 text-cyan-300 ring-1 ring-cyan-400/15' : 'text-slate-400 hover:bg-white/[0.04] hover:text-white'}`}>
              <Icon size={18} /> {label}
            </a>
          ))}
          
          <Link to="/gallery" className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-slate-400 transition hover:bg-white/[0.04] hover:text-white"><Users size={18} /> Photo gallery</Link>
          <Link to="/halloffame" className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-slate-400 transition hover:bg-white/[0.04] hover:text-white"><Award size={18} /> Hall of Fame</Link>
          <Link
  to="/scoreboard"
  className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-slate-400 transition hover:bg-white/[0.04] hover:text-white"
>
  <BarChart3 size={18} />
  Full Scoreboard
</Link>
        </nav>

        <div className="mt-auto rounded-2xl border border-cyan-400/10 bg-cyan-400/[0.05] p-4">
          <div className="mb-3 flex items-center gap-2 text-cyan-300"><Activity size={16} /><span className="text-xs font-semibold">Sheets connected</span></div>
          <p className="text-xs leading-5 text-slate-500">Stats sync from your published Google Sheets whenever the dashboard loads.</p>
          <div className="mt-4 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-wider text-emerald-300"><span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> Data connection ready</div>
        </div>
      </aside>

      <main className="min-h-screen lg:pl-[250px]">
        <header className="sticky top-0 z-30 flex h-[76px] items-center justify-between border-b border-white/[0.07] bg-[#080d17]/90 px-5 backdrop-blur-xl sm:px-8">
          <div className="flex items-center gap-3">
            <button onClick={() => setMobileNav(true)} className="rounded-lg border border-white/10 p-2 text-slate-300 lg:hidden" aria-label="Open menu"><Menu size={19} /></button>
            <div>
              <p className="text-xs text-slate-500">Koh-e-Fiza Cricket</p>
              <h1 className="text-sm font-semibold text-white sm:text-base">Season dashboard</h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden items-center gap-2 rounded-full border border-emerald-400/15 bg-emerald-400/[0.06] px-3 py-1.5 text-xs font-medium text-emerald-300 sm:flex"><span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> Live stats</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-[#172235] text-xs font-bold text-cyan-200">AM</div>
          </div>
        </header>

        <div id="overview" className="mx-auto max-w-[1600px] space-y-8 px-5 py-7 sm:px-8 sm:py-9">
          {error && <div className="rounded-xl border border-amber-400/20 bg-amber-400/5 px-4 py-3 text-sm text-amber-200">Some sheet data could not be loaded. Check that both Google Sheets are published to the web.</div>}

          <section className="grid gap-6 xl:grid-cols-[1.55fr_1fr]">
            <div className="relative min-h-[300px] overflow-hidden rounded-3xl border border-white/[0.08] bg-gradient-to-br from-[#14253a] via-[#101a2a] to-[#10131f] p-6 sm:p-8">
              <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-cyan-400/[0.08] blur-3xl" />
              <div className="absolute bottom-0 right-0 h-48 w-48 rounded-full bg-blue-500/[0.08] blur-3xl" />
              <div className="relative z-10 flex h-full flex-col justify-between gap-8">
                <div>
                  <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-cyan-300/15 bg-cyan-300/[0.07] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.17em] text-cyan-200"><Zap size={13} /> Player spotlight</div>
                  <h2 className="max-w-lg text-3xl font-semibold leading-tight tracking-tight text-white sm:text-4xl">The numbers tell the story.<br /><span className="text-cyan-300">Own the next chapter.</span></h2>
                </div>
                {featured ? (
                  <div
                    className="relative z-10"
                    onMouseEnter={() => setSpotlightPaused(true)}
                    onMouseLeave={() => setSpotlightPaused(false)}
                    onFocus={() => setSpotlightPaused(true)}
                    onBlur={(event) => {
                      if (!event.currentTarget.contains(event.relatedTarget)) {
                        setSpotlightPaused(false)
                      }
                    }}
                  >
                    <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                      <div
                        key={featured.Player}
                        className="flex min-w-0 items-center gap-4 animate-in fade-in duration-500 sm:gap-5"
                      >
                        <PlayerAvatar
                          name={featured.Player}
                          size="xl"
                          className="rounded-3xl ring-2 ring-cyan-300/40"
                        />
                        <div className="min-w-0">
                          <h3 className="mt-2 truncate text-2xl font-black text-white sm:text-3xl">
                            {featured.Player}
                          </h3>
                          <p className="mt-2 text-sm text-slate-400">
                            {n(featured.Runs)} runs
                            <span className="mx-2 text-slate-600">·</span>
                            {n(featured.Wickets)} wickets
                          </p>
                          <p className="mt-2 text-xs text-slate-500">
                            {n(featured.MOTM)} Player of the Match awards
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3 sm:min-w-[190px]">
                        <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                            Strike Rate
                          </p>
                          <p className="mt-2 text-2xl font-black text-cyan-300">
                            {featured['Strike Rate'] || '—'}
                          </p>
                        </div>
                        <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                            Prime Points
                          </p>
                          <p className="mt-2 text-2xl font-black text-amber-300">
                            {featured.PrimePoints ?? 0}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-7 flex items-center justify-between gap-4 border-t border-white/[0.07] pt-5">
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-slate-400">
                          PLAYER {spotlightIndex + 1} / {spotlightPlayers.length}
                        </p>
                        <div className="mt-3 flex max-w-full flex-wrap gap-1.5">
                          {spotlightPlayers.map((player, index) => (
                            <button
                              key={player.Player}
                              type="button"
                              onClick={() => setSpotlightIndex(index)}
                              aria-label={`Show ${player.Player}`}
                              aria-current={index === spotlightIndex ? 'true' : undefined}
                              className={`h-1.5 rounded-full transition-all duration-300 ${
                                index === spotlightIndex
                                  ? 'w-8 bg-cyan-300'
                                  : 'w-3 bg-white/15 hover:bg-white/40'
                              }`}
                            />
                          ))}
                        </div>
                      </div>

                      <div className="flex shrink-0 gap-2">
                        <button
                          type="button"
                          onClick={previousSpotlight}
                          aria-label="Previous player"
                          className="rounded-xl border border-white/10 px-4 py-2 text-sm text-slate-300 transition hover:border-cyan-300/40 hover:text-cyan-300"
                        >
                          ←
                        </button>
                        <button
                          type="button"
                          onClick={nextSpotlight}
                          aria-label="Next player"
                          className="rounded-xl border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-sm font-semibold text-cyan-200 transition hover:bg-cyan-300/20"
                        >
                          Next →
                        </button>
                      </div>
                    </div>
                  </div>
                ) : <p className="text-sm text-slate-500">Player spotlight will appear when sheet data is available.</p>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <StatCard label="Total runs" value={totalRuns.toLocaleString()} note="Across listed players" icon={Activity} accent="cyan" />
              <StatCard label="Wickets" value={totalWickets.toLocaleString()} note="Season total" icon={Shield} accent="violet" />
              <StatCard label="Players" value={totalPlayers} note="In batting or bowling sheets" icon={Users} accent="emerald" />
              <StatCard label="MOTM awards" value={motmTotal} note="As recorded in batting sheet" icon={Award} accent="amber" />
            </div>
          </section>

          <section className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <div className="rounded-2xl border border-white/[0.07] bg-[#101827] p-5 sm:p-6">
              <SectionHeading eyebrow="Performance" title="Top run scorers" action={<span className="rounded-lg bg-white/[0.04] px-3 py-2 text-xs text-slate-400">Runs</span>} />
              {chartData.length ? (
                <div className="h-[260px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
                      <defs><linearGradient id="runGradient" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#22d3ee" stopOpacity={0.28} /><stop offset="95%" stopColor="#22d3ee" stopOpacity={0} /></linearGradient></defs>
                      <CartesianGrid stroke="#ffffff" strokeOpacity={0.06} vertical={false} />
                      <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                      <Tooltip contentStyle={{ background: '#0c1320', border: '1px solid #263449', borderRadius: 12, color: '#e2e8f0' }} />
                      <Area type="monotone" dataKey="runs" stroke="#22d3ee" strokeWidth={2.5} fill="url(#runGradient)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              ) : <div className="flex h-[260px] items-center justify-center text-sm text-slate-500">Run data will appear here.</div>}
            </div>

            <div className="rounded-2xl border border-white/[0.07] bg-[#101827] p-5 sm:p-6">
              <SectionHeading eyebrow="Leaderboard" title="Cap leaders" />
              <div className="space-y-4">
                <div className="flex items-center gap-4 rounded-xl border border-orange-300/10 bg-orange-300/[0.04] p-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-300/10 text-orange-300"><ArrowUpRight size={20} /></div>
                  <div className="min-w-0 flex-1"><p className="text-xs text-slate-500">Orange Cap · Most runs</p><p className="mt-1 truncate font-semibold text-white">{orangeLeader?.Player || 'Awaiting data'}</p></div>
                  <p className="text-xl font-bold text-orange-300">{orangeLeader ? n(orangeLeader.Runs) : '—'}</p>
                </div>
                <div className="flex items-center gap-4 rounded-xl border border-violet-300/10 bg-violet-300/[0.04] p-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-300/10 text-violet-300"><Shield size={20} /></div>
                  <div className="min-w-0 flex-1"><p className="text-xs text-slate-500">Purple Cap · Most wickets</p><p className="mt-1 truncate font-semibold text-white">{purpleLeader?.Player || 'Awaiting data'}</p></div>
                  <p className="text-xl font-bold text-violet-300">{purpleLeader ? n(purpleLeader.Wickets) : '—'}</p>
                </div>
                <div className="flex items-center gap-4 rounded-xl border border-cyan-300/10 bg-cyan-300/[0.04] p-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-300/10 text-cyan-300"><Award size={20} /></div>
                  <div className="min-w-0 flex-1"><p className="text-xs text-slate-500">Prime Cap · Overall points</p><p className="mt-1 truncate font-semibold text-white">{primeLeader?.Player || 'Awaiting data'}</p></div>
                  <p className="text-xl font-bold text-cyan-300">{primeLeader ? primeLeader.PrimePoints : '—'}</p>
                </div>
              </div>
              <Link to="/halloffame" className="mt-5 flex items-center justify-center gap-2 rounded-xl border border-white/10 px-4 py-3 text-sm font-semibold text-slate-300 transition hover:border-cyan-300/30 hover:text-cyan-200">Explore Hall of Fame <ArrowUpRight size={16} /></Link>
            </div>
          </section>

          <section id="roster" className="scroll-mt-24">
            <SectionHeading eyebrow="The squad" title="Player roster" action={<div className="relative"><Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Find a player..." className="w-44 rounded-xl border border-white/10 bg-[#101827] py-2.5 pl-9 pr-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-cyan-300/40 sm:w-56" /></div>} />
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {roster.slice(0, 9).map((player) => (
                <div key={player.Player} className="flex items-center gap-4 rounded-2xl border border-white/[0.07] bg-[#101827] p-4 transition hover:border-cyan-300/20">
                  <PlayerAvatar name={player.Player} size="md" />
                  <div className="min-w-0 flex-1"><p className="truncate font-semibold text-white">{player.Player}</p><p className="mt-1 text-xs text-slate-500">{n(player.Runs)} runs <span className="mx-1 text-slate-700">·</span> {n(player.Wickets)} wkts</p></div>
                  <div className="text-right"><p className="text-sm font-bold text-cyan-300">{n(player.Runs) + n(player.Wickets) * 20}</p><p className="text-[10px] uppercase tracking-wider text-slate-600">Impact</p></div>
                </div>
              ))}
              {!roster.length && <div className="col-span-full rounded-2xl border border-dashed border-white/10 p-8 text-center text-sm text-slate-500">No players match that search.</div>}
            </div>
            {roster.length > 9 && <p className="mt-4 text-center text-xs text-slate-600">Showing 9 of {roster.length} players. Use the search to find others.</p>}
          </section>

          <section id="leaderboards" className="grid scroll-mt-24 gap-6 xl:grid-cols-2">
            <div className="overflow-hidden rounded-2xl border border-white/[0.07] bg-[#101827]">
              <div className="flex items-center justify-between border-b border-white/[0.06] p-5"><div><p className="text-xs font-semibold uppercase tracking-[0.15em] text-orange-300">Orange Cap</p><h3 className="mt-1 text-lg font-semibold text-white">Batting leaderboard</h3></div><span className="rounded-lg bg-orange-300/10 px-3 py-1.5 text-xs text-orange-200">Top 5</span></div>
              <div className="divide-y divide-white/[0.05]">
                {battingData.slice(0, 5).map((player, i) => <div key={player.Player} className="flex items-center gap-3 px-5 py-4"><span className="w-5 text-xs font-semibold text-slate-600">0{i + 1}</span><PlayerAvatar name={player.Player} size="sm" className="rounded-xl" /><div className="min-w-0 flex-1"><p className="truncate text-sm font-medium text-white">{player.Player}</p><p className="text-xs text-slate-500">SR {player['Strike Rate'] || '—'}</p></div><p className="font-semibold tabular-nums text-orange-300">{n(player.Runs)} <span className="text-xs font-normal text-slate-500">runs</span></p></div>)}
              </div>
              <div className="border-t border-white/[0.06] p-4 text-center"><Link to="/halloffame" className="text-xs font-semibold text-slate-400 hover:text-cyan-300">View full honours →</Link></div>
            </div>
            <div className="overflow-hidden rounded-2xl border border-white/[0.07] bg-[#101827]">
              <div className="flex items-center justify-between border-b border-white/[0.06] p-5"><div><p className="text-xs font-semibold uppercase tracking-[0.15em] text-violet-300">Purple Cap</p><h3 className="mt-1 text-lg font-semibold text-white">Bowling leaderboard</h3></div><span className="rounded-lg bg-violet-300/10 px-3 py-1.5 text-xs text-violet-200">Top 5</span></div>
              <div className="divide-y divide-white/[0.05]">
                {bowlingData.slice(0, 5).map((player, i) => <div key={player.Player} className="flex items-center gap-3 px-5 py-4"><span className="w-5 text-xs font-semibold text-slate-600">0{i + 1}</span><PlayerAvatar name={player.Player} size="sm" className="rounded-xl" /><div className="min-w-0 flex-1"><p className="truncate text-sm font-medium text-white">{player.Player}</p><p className="text-xs text-slate-500">Econ {player.Economy || '—'}</p></div><p className="font-semibold tabular-nums text-violet-300">{n(player.Wickets)} <span className="text-xs font-normal text-slate-500">wkts</span></p></div>)}
              </div>
              <div className="border-t border-white/[0.06] p-4 text-center"><Link to="/halloffame" className="text-xs font-semibold text-slate-400 hover:text-cyan-300">View full honours →</Link></div>
            </div>
          </section>

          <footer className="flex flex-col justify-between gap-2 border-t border-white/[0.06] pt-6 text-xs text-slate-600 sm:flex-row">
            <p><span className="font-bold tracking-[0.16em] text-slate-400">STRIQ</span> <span className="mx-2">·</span> Updated as on 27-09-2026.</p>
            <p>Built by Atharva Mehta</p>
          </footer>
        </div>
      </main>
    </div>
  )
}
