import { useEffect, useMemo, useState } from 'react'
import Papa from 'papaparse'
import { Link } from 'react-router-dom'
import { ArrowLeft, Search, Shield, Award, Activity, Users, ChevronUp, ChevronDown } from 'lucide-react'

const BATTING_CSV =
  'https://docs.google.com/spreadsheets/d/e/2PACX-1vQWRTAVB4A2Nx3qtXg8p_b6w1yRdYp_bKbycTuPyZRsRlzLxvloddMU1s-gcHeQkvlmrVOdZeWgrrx1/pub?output=csv&gid=0'
const BOWLING_CSV =
  'https://docs.google.com/spreadsheets/d/e/2PACX-1vQWRTAVB4A2Nx3qtXg8p_b6w1yRdYp_bKbycTuPyZRsRlzLxvloddMU1s-gcHeQkvlmrVOdZeWgrrx1/pub?output=csv&gid=1841998730'

const n = (value) => {
  const parsed = Number(String(value ?? '').replace('*', '').trim())
  return Number.isFinite(parsed) ? parsed : 0
}

function PlayerAvatar({ name = '' }) {
  const [failed, setFailed] = useState(false)
  const imageName = name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '') + '.jpg'
  return (
    <div className="relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-cyan-400/10 text-xs font-bold text-cyan-200 ring-1 ring-white/10">
      {!failed ? (
        <img src={`/players/${imageName}`} alt={name} className="h-full w-full object-cover" onError={() => setFailed(true)} />
      ) : (
        <span>{name.split(/\s+/).slice(0, 2).map((part) => part[0] || '').join('').toUpperCase()}</span>
      )}
    </div>
  )
}

function SortHeader({ label, field, sort, setSort }) {
  const active = sort.field === field
  return (
    <th
      onClick={() => setSort((current) => ({ field, direction: current.field === field && current.direction === 'desc' ? 'asc' : 'desc' }))}
      className="cursor-pointer whitespace-nowrap px-4 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-slate-500 transition hover:text-cyan-300"
    >
      <span className="inline-flex items-center gap-1.5">
        {label}
        {active && (sort.direction === 'desc' ? <ChevronDown size={13} /> : <ChevronUp size={13} />)}
      </span>
    </th>
  )
}

function DataTable({ rows, columns, kind }) {
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState({ field: kind === 'batting' ? 'Runs' : 'Wickets', direction: 'desc' })

  const filtered = useMemo(() => {
    const searched = rows.filter((player) => (player.Player || '').toLowerCase().includes(search.toLowerCase()))
    return [...searched].sort((a, b) => {
      const av = columns.find((col) => col.field === sort.field)?.numeric
        ? n(a[sort.field])
        : String(a[sort.field] ?? '').toLowerCase()
      const bv = columns.find((col) => col.field === sort.field)?.numeric
        ? n(b[sort.field])
        : String(b[sort.field] ?? '').toLowerCase()
      const comparison = typeof av === 'number' && typeof bv === 'number' ? av - bv : String(av).localeCompare(String(bv))
      return sort.direction === 'desc' ? -comparison : comparison
    })
  }, [rows, search, sort, columns])

  return (
    <div className="overflow-hidden rounded-2xl border border-white/[0.07] bg-[#101827]">
      <div className="flex flex-col gap-3 border-b border-white/[0.06] p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
        <div>
          <p className={`text-xs font-bold uppercase tracking-[0.16em] ${kind === 'batting' ? 'text-orange-300' : 'text-violet-300'}`}>
            {kind === 'batting' ? 'Orange Cap' : 'Purple Cap'}
          </p>
          <h2 className="mt-1 text-lg font-semibold text-white">{kind === 'batting' ? 'Batting scoreboard' : 'Bowling scoreboard'}</h2>
        </div>
        <div className="relative w-full sm:w-64">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search players..." className="w-full rounded-xl border border-white/10 bg-[#080d17] py-2.5 pl-9 pr-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-cyan-300/40" />
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] border-collapse">
          <thead className="bg-white/[0.02]">
            <tr>
              <th className="px-4 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-slate-500">#</th>
              <th className="px-4 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-slate-500">Player</th>
              {columns.map((column) => <SortHeader key={column.field} label={column.label} field={column.field} sort={sort} setSort={setSort} />)}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.05]">
            {filtered.map((player, index) => (
              <tr key={player.Player} className="transition hover:bg-cyan-300/[0.035]">
                <td className="px-4 py-3.5 text-xs font-semibold tabular-nums text-slate-600">{String(index + 1).padStart(2, '0')}</td>
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-3">
                    <PlayerAvatar name={player.Player} />
                    <span className="whitespace-nowrap text-sm font-semibold text-white">{player.Player}</span>
                  </div>
                </td>
                {columns.map((column) => (
                  <td key={column.field} className={`whitespace-nowrap px-4 py-3.5 text-sm tabular-nums ${column.highlight ? (kind === 'batting' ? 'font-bold text-orange-300' : 'font-bold text-violet-300') : 'text-slate-300'}`}>
                    {player[column.field] === undefined || player[column.field] === '' ? '—' : player[column.field]}
                  </td>
                ))}
              </tr>
            ))}
            {!filtered.length && <tr><td colSpan={columns.length + 2} className="px-6 py-12 text-center text-sm text-slate-500">No players found.</td></tr>}
          </tbody>
        </table>
      </div>
      <div className="border-t border-white/[0.06] px-5 py-3 text-xs text-slate-600">
        Showing {filtered.length} of {rows.length} players · Select a column heading to sort
      </div>
    </div>
  )
}

export default function Scoreboard() {
  const [battingData, setBattingData] = useState([])
  const [bowlingData, setBowlingData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

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
        setBattingData((results.data || []).filter((player) => player.Player))
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
        setBowlingData((results.data || []).filter((player) => player.Player))
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

  const playerCount = new Set([...battingData, ...bowlingData].map((player) => player.Player)).size
  const totalRuns = battingData.reduce((sum, player) => sum + n(player.Runs), 0)
  const totalWickets = bowlingData.reduce((sum, player) => sum + n(player.Wickets), 0)

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#080d17] text-white">
        <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan-400 text-2xl font-black italic text-slate-950">S</div>
        <h1 className="text-3xl font-bold tracking-[0.25em]">STRIQ</h1>
        <p className="mt-3 text-sm text-slate-500">Loading the full scorebook...</p>
      </div>
    )
  }

  const battingColumns = [
    { field: 'Matches', label: 'Matches', numeric: true },
    { field: 'Innings', label: 'Innings', numeric: true },
    { field: 'Runs', label: 'Runs', numeric: true, highlight: true },
    { field: 'Highest Score', label: 'High Score', numeric: true },
    { field: 'Average', label: 'Average', numeric: true },
    { field: 'Strike Rate', label: 'Strike Rate', numeric: true },
    { field: 'Hundreds', label: '100s', numeric: true },
    { field: 'Fifties', label: '50s', numeric: true },
    { field: 'Thirties', label: '30s', numeric: true },
    { field: 'Fours', label: '4s', numeric: true },
    { field: 'Sixes', label: '6s', numeric: true },
    { field: 'MOTM', label: 'MOTM', numeric: true },
  ]

  const bowlingColumns = [
    { field: 'Matches', label: 'Matches', numeric: true },
    { field: 'Overs', label: 'Overs', numeric: true },
    { field: 'Runs', label: 'Runs Conceded', numeric: true },
    { field: 'Wickets', label: 'Wickets', numeric: true, highlight: true },
    { field: 'Economy', label: 'Economy', numeric: true },
    { field: 'Best Bowling', label: 'Best Bowling' },
    { field: 'DotBalls', label: 'Dot Balls', numeric: true },
  ]

  return (
    <div className="min-h-screen bg-[#080d17] text-slate-100">
      <header className="sticky top-0 z-30 border-b border-white/[0.07] bg-[#080d17]/90 backdrop-blur-xl">
        <div className="mx-auto flex h-[76px] max-w-[1600px] items-center justify-between px-5 sm:px-8">
          <Link to="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-400 text-xl font-black italic text-slate-950">S</div>
            <div><div className="text-xl font-black tracking-[0.18em] text-white">STRIQ</div><div className="text-[10px] uppercase tracking-[0.19em] text-slate-500">Cricket analytics</div></div>
          </Link>
          <Link to="/" className="flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2.5 text-sm font-semibold text-slate-300 transition hover:border-cyan-300/30 hover:text-cyan-200"><ArrowLeft size={16} /> Dashboard</Link>
        </div>
      </header>

      <main className="mx-auto max-w-[1600px] space-y-7 px-5 py-7 sm:px-8 sm:py-9">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.2em] text-cyan-300">Complete season stats</p>
            <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">The Scoreboard</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">Every listed player, every recorded stat. Search the squad or sort any column to explore the season.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <div className="rounded-xl border border-white/[0.07] bg-[#101827] px-4 py-3"><div className="flex items-center gap-2 text-xs text-slate-500"><Users size={14} /> Players</div><div className="mt-1 text-xl font-bold text-white">{playerCount}</div></div>
            <div className="rounded-xl border border-white/[0.07] bg-[#101827] px-4 py-3"><div className="flex items-center gap-2 text-xs text-slate-500"><Activity size={14} /> Runs</div><div className="mt-1 text-xl font-bold text-orange-300">{totalRuns.toLocaleString()}</div></div>
            <div className="rounded-xl border border-white/[0.07] bg-[#101827] px-4 py-3"><div className="flex items-center gap-2 text-xs text-slate-500"><Shield size={14} /> Wickets</div><div className="mt-1 text-xl font-bold text-violet-300">{totalWickets.toLocaleString()}</div></div>
          </div>
        </div>

        {error && <div className="rounded-xl border border-amber-400/20 bg-amber-400/5 px-4 py-3 text-sm text-amber-200">Some sheet data could not be loaded. Check that both Google Sheets are published to the web.</div>}

        <DataTable rows={battingData} columns={battingColumns} kind="batting" />
        <DataTable rows={bowlingData} columns={bowlingColumns} kind="bowling" />

        <footer className="flex flex-col justify-between gap-2 border-t border-white/[0.06] pt-6 text-xs text-slate-600 sm:flex-row">
          <p><span className="font-bold tracking-[0.16em] text-slate-400">STRIQ</span><span className="mx-2">·</span>Local cricket, measured.</p>
          <p>Built by Atharva Mehta</p>
        </footer>
      </main>
    </div>
  )
}
