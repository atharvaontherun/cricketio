
import { Link } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import Papa from 'papaparse';

import atharvaImg from '../assets/players/atharva.jpeg';
import hardikImg from '../assets/players/hardik-2.jpg';
import ashishImg from '../assets/players/ashish-2.jpg';
import shouryamImg from '../assets/players/shouryam.jpeg';
import kartikImg from '../assets/players/kartik.png';
import ayushImg from '../assets/players/ayush.png';

const SHEET_URL =
  'https://docs.google.com/spreadsheets/d/e/2PACX-1vQWRTAVB4A2Nx3qtXg8p_b6w1yRdYp_bKbycTuPyZRsRlzLxvloddMU1s-gcHeQkvlmrVOdZeWgrrx1/pub?output=csv';

const players = [
  {
    name: 'Atharva',
    image: atharvaImg,
    title: 'Powerplay Terror',
    capColor: 'red',
    number: '01',
  },
  {
    name: 'Hardik',
    image: hardikImg,
    title: 'Purple Cap Leader',
    capColor: 'purple',
    number: '02',
  },
  {
    name: 'Ashish',
    image: ashishImg,
    title: 'Orange Cap Leader',
    capColor: 'orange',
    number: '03',
  },
  {
    name: 'Shouryam',
    image: shouryamImg,
    title: 'Elite Clutch Player',
    capColor: 'slate',
    number: '04',
  },
  {
    name: 'Kartik',
    image: kartikImg,
    title: 'Silent Contributor',
    capColor: 'cyan',
    number: '05',
  },
  {
    name: 'Ayush',
    image: ayushImg,
    title: 'Emerging Player',
    capColor: 'green',
    number: '06',
  },
];

const capStyles = {
  red: {
    text: 'text-red-400',
    border: 'border-red-400/50',
    glow: 'hover:shadow-red-500/10',
    bg: 'bg-red-500/10',
  },
  purple: {
    text: 'text-purple-400',
    border: 'border-purple-400/50',
    glow: 'hover:shadow-purple-500/10',
    bg: 'bg-purple-500/10',
  },
  orange: {
    text: 'text-orange-400',
    border: 'border-orange-400/50',
    glow: 'hover:shadow-orange-500/10',
    bg: 'bg-orange-500/10',
  },
  slate: {
    text: 'text-slate-300',
    border: 'border-slate-400/50',
    glow: 'hover:shadow-slate-400/10',
    bg: 'bg-slate-400/10',
  },
  cyan: {
    text: 'text-cyan-400',
    border: 'border-cyan-400/50',
    glow: 'hover:shadow-cyan-500/10',
    bg: 'bg-cyan-500/10',
  },
  green: {
    text: 'text-emerald-400',
    border: 'border-emerald-400/50',
    glow: 'hover:shadow-emerald-500/10',
    bg: 'bg-emerald-500/10',
  },
};

const getNumber = (value) => {
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
};

const format = (value, digits = 1) => {
  const number = getNumber(value);
  return Number.isInteger(number)
    ? number.toString()
    : number.toFixed(digits);
};

const getPrimeRating = (batting = {}, bowling = {}) => {
  return Math.round(
    getNumber(batting.Runs) +
    getNumber(bowling.Wickets) * 20 +
    getNumber(batting.MOTM) * 15 +
    getNumber(batting.Hundreds) * 30 +
    getNumber(batting.Fifties) * 20 +
    getNumber(batting.Thirties) * 15 +
    getNumber(bowling.DotBalls) * 0.5
  );
};

const findPlayer = (data, name) =>
  data.find(
    (p) => p.Player?.trim().toLowerCase() === name.toLowerCase()
  ) || {};

function StatBox({ label, value, accent = false }) {
  return (
    <div className="rounded-xl border border-white/[0.07] bg-white/[0.035] p-3">
      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
        {label}
      </p>
      <p
        className={`mt-1 text-xl font-black ${
          accent ? 'text-cyan-400' : 'text-white'
        }`}
      >
        {value ?? 0}
      </p>
    </div>
  );
}

function DetailRow({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-white/[0.06] py-3 last:border-0">
      <span className="text-sm text-slate-400">{label}</span>
      <span className="text-sm font-bold text-white text-right">
        {value ?? 0}
      </span>
    </div>
  );
}

function PlayerModal({
  player,
  batting,
  bowling,
  primeRating,
  onClose,
}) {
  const [activeTab, setActiveTab] = useState('batting');

  const cap = capStyles[player.capColor] || capStyles.cyan;

  useEffect(() => {
    const handleKey = (event) => {
      if (event.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-black/80 p-3 backdrop-blur-md sm:p-6"
      onClick={onClose}
    >
      <div
        className="relative my-auto w-full max-w-4xl overflow-hidden rounded-3xl border border-white/10 bg-[#07111f] shadow-2xl shadow-cyan-950/30"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal header */}
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4 sm:px-8">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-cyan-400">
              STRIQ / PLAYER PROFILE
            </p>
            <p className="mt-1 text-sm text-slate-500">
              Player statistics and achievements
            </p>
          </div>

          <button
            onClick={onClose}
            aria-label="Close profile"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-xl text-slate-400 transition hover:border-cyan-400/40 hover:text-white"
          >
            ×
          </button>
        </div>

        <div className="grid md:grid-cols-[0.85fr_1.15fr]">
          {/* Player identity */}
          <div className="relative border-b border-white/10 bg-gradient-to-b from-cyan-950/30 to-transparent p-5 sm:p-8 md:border-b-0 md:border-r">
            <div
              className={`absolute right-6 top-6 rounded-full border px-3 py-1 text-xs font-black ${cap.text} ${cap.border} ${cap.bg}`}
            >
              #{player.number}
            </div>

            <div className="overflow-hidden rounded-2xl border border-white/10 bg-black/20">
              <img
                src={player.image}
                alt={player.name}
                className="h-64 w-full object-cover object-center sm:h-80"
              />
            </div>

            <div className="mt-6">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
                Player Card
              </p>

              <h2 className="mt-1 text-4xl font-black uppercase tracking-tight text-white">
                {player.name}
              </h2>

              <p className={`mt-2 text-lg font-bold ${cap.text}`}>
                {player.title}
              </p>
            </div>

            <div className="mt-6 rounded-2xl border border-cyan-400/20 bg-cyan-400/[0.04] p-5">
              <p className="text-xs font-bold uppercase tracking-widest text-slate-500">
                Prime Rating
              </p>
              <p className="mt-2 text-5xl font-black tracking-tight text-cyan-400">
                {primeRating}
              </p>
              <p className="mt-2 text-xs leading-relaxed text-slate-500">
                Runs + Wickets × 20 + MOTM × 15 + Hundreds × 30
                + Fifties × 20 + Thirties × 15 + Dot Balls × 0.5
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="p-5 sm:p-8">
            <div className="mb-6 grid grid-cols-3 gap-3">
              <StatBox label="Runs" value={batting.Runs || 0} accent />
              <StatBox label="Wickets" value={bowling.Wickets || 0} accent />
              <StatBox label="MOTM" value={batting.MOTM || 0} accent />
            </div>

            <div className="mb-6 flex gap-2 rounded-xl border border-white/[0.07] bg-black/20 p-1">
              {['batting', 'bowling', 'awards'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 rounded-lg px-2 py-3 text-xs font-black uppercase tracking-wider transition sm:text-sm ${
                    activeTab === tab
                      ? 'bg-cyan-400 text-black shadow-lg shadow-cyan-500/10'
                      : 'text-slate-500 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {activeTab === 'batting' && (
              <div>
                <h3 className="mb-2 text-xs font-black uppercase tracking-[0.2em] text-cyan-400">
                  Batting Statistics
                </h3>

                <DetailRow label="Matches" value={batting.Matches || 0} />
                <DetailRow label="Innings" value={batting.Innings || 0} />
                <DetailRow label="Runs" value={batting.Runs || 0} />
                <DetailRow
                  label="Highest Score"
                  value={batting['Highest Score'] || 0}
                />
                <DetailRow
                  label="Batting Average"
                  value={format(batting.Average)}
                />
                <DetailRow
                  label="Strike Rate"
                  value={format(batting['Strike Rate'])}
                />
                <DetailRow label="Hundreds" value={batting.Hundreds || 0} />
                <DetailRow label="Fifties" value={batting.Fifties || 0} />
                <DetailRow label="Thirties" value={batting.Thirties || 0} />
                <DetailRow label="Fours" value={batting.Fours || 0} />
                <DetailRow label="Sixes" value={batting.Sixes || 0} />
              </div>
            )}

            {activeTab === 'bowling' && (
              <div>
                <h3 className="mb-2 text-xs font-black uppercase tracking-[0.2em] text-cyan-400">
                  Bowling Statistics
                </h3>

                <DetailRow label="Matches" value={bowling.Matches || 0} />
                <DetailRow label="Overs" value={bowling.Overs || 0} />
                <DetailRow
                  label="Runs Conceded"
                  value={bowling.Runs || 0}
                />
                <DetailRow label="Wickets" value={bowling.Wickets || 0} />
                <DetailRow
                  label="Economy"
                  value={format(bowling.Economy)}
                />
                <DetailRow
                  label="Best Bowling"
                  value={bowling['Best Bowling'] || '—'}
                />
                <DetailRow
                  label="Dot Balls"
                  value={bowling.DotBalls || 0}
                />
              </div>
            )}

            {activeTab === 'awards' && (
              <div>
                <h3 className="mb-2 text-xs font-black uppercase tracking-[0.2em] text-cyan-400">
                  Awards & Achievements
                </h3>

                <div className="mb-4 rounded-xl border border-white/[0.07] bg-white/[0.025] p-4">
                  <p className="text-xs uppercase tracking-wider text-slate-500">
                    Player Title
                  </p>
                  <p className={`mt-2 text-xl font-black ${cap.text}`}>
                    {player.title}
                  </p>
                </div>

                <DetailRow label="Man of the Match" value={batting.MOTM || 0} />
                <DetailRow label="Hundreds" value={batting.Hundreds || 0} />
                <DetailRow label="Fifties" value={batting.Fifties || 0} />
                <DetailRow label="Thirties" value={batting.Thirties || 0} />
                <DetailRow label="Wickets" value={bowling.Wickets || 0} />
                <DetailRow label="Dot Balls" value={bowling.DotBalls || 0} />
                <DetailRow label="Prime Rating" value={primeRating} />
              </div>
            )}

            <p className="mt-6 text-center text-[10px] leading-relaxed text-slate-600">
              Statistics are sourced from STRIQ's live Google Sheets data.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PlayerGallery() {
  const [battingData, setBattingData] = useState([]);
  const [bowlingData, setBowlingData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [selectedPlayer, setSelectedPlayer] = useState(null);

  useEffect(() => {
    let battingLoaded = false;
    let bowlingLoaded = false;

    const finishLoading = () => {
      if (battingLoaded && bowlingLoaded) {
        setLoading(false);
      }
    };

    Papa.parse(`${SHEET_URL}&gid=0`, {
      download: true,
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        setBattingData(results.data.filter((p) => p.Player?.trim()));
        battingLoaded = true;
        finishLoading();
      },
      error: (err) => {
        console.error('Batting error:', err);
        battingLoaded = true;
        finishLoading();
      },
    });

    Papa.parse(`${SHEET_URL}&gid=1841998730`, {
      download: true,
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        setBowlingData(results.data.filter((p) => p.Player?.trim()));
        bowlingLoaded = true;
        finishLoading();
      },
      error: (err) => {
        console.error('Bowling error:', err);
        bowlingLoaded = true;
        finishLoading();
      },
    });
  }, []);

  const galleryPlayers = useMemo(() => {
    return players.map((player) => {
      const batting = findPlayer(battingData, player.name);
      const bowling = findPlayer(bowlingData, player.name);

      return {
        ...player,
        batting,
        bowling,
        primeRating: getPrimeRating(batting, bowling),
      };
    });
  }, [battingData, bowlingData]);

  const filteredPlayers = useMemo(() => {
    return galleryPlayers.filter((player) => {
      const matchesSearch = player.name
        .toLowerCase()
        .includes(search.toLowerCase().trim());

      const hasAward =
        getNumber(player.batting.MOTM) > 0 ||
        getNumber(player.batting.Hundreds) > 0 ||
        getNumber(player.batting.Fifties) > 0 ||
        getNumber(player.batting.Thirties) > 0;

      const matchesFilter =
        filter === 'all' ||
        (filter === 'awards' && hasAward) ||
        (filter === 'prime' && player.primeRating >= 500);

      return matchesSearch && matchesFilter;
    });
  }, [galleryPlayers, search, filter]);

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
          Player Gallery
        </p>

        <div className="mt-6 h-1 w-40 overflow-hidden rounded-full bg-white/5">
          <div className="h-full w-1/2 animate-pulse rounded-full bg-cyan-400" />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#030712] text-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-white/[0.08] bg-[#030712]/85 backdrop-blur-2xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <Link to="/" className="flex items-center gap-3">
            <img
              src="/striq-icon.svg"
              alt="STRIQ"
              className="h-9 w-9 rounded-xl"
            />
            <span className="text-2xl font-black tracking-tight sm:text-3xl">
              STRIQ<span className="text-cyan-400">.</span>
            </span>
          </Link>

          <div className="flex items-center gap-2 sm:gap-4">
            <Link
              to="/scoreboard"
              className="hidden rounded-xl px-4 py-2 text-sm font-bold text-slate-400 transition hover:bg-white/5 hover:text-white sm:block"
            >
              Scoreboard
            </Link>

            <Link
              to="/halloffame"
              className="hidden rounded-xl px-4 py-2 text-sm font-bold text-slate-400 transition hover:bg-white/5 hover:text-white sm:block"
            >
              Hall of Fame
            </Link>

            <Link
              to="/"
              className="rounded-xl bg-cyan-400 px-4 py-2.5 text-xs font-black tracking-wider text-black transition hover:bg-cyan-300 sm:text-sm"
            >
              HOME
            </Link>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-16">
        {/* Page heading */}
        <div className="mb-10 text-center sm:mb-14">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/[0.05] px-4 py-2">
            <span className="h-2 w-2 animate-pulse rounded-full bg-cyan-400" />
            <span className="text-[10px] font-black uppercase tracking-[0.25em] text-cyan-400">
              The Players Collection
            </span>
          </div>

          <h1 className="text-4xl font-black uppercase tracking-tight sm:text-6xl md:text-7xl">
            Player <span className="text-cyan-400">Gallery</span>
          </h1>

          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-slate-500 sm:text-base">
            Every player has a story. Explore the cards, discover the
            numbers, and meet the names behind the game.
          </p>

          <div className="mx-auto mt-8 flex max-w-md items-center justify-center gap-4">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent to-cyan-400/40" />
            <span className="text-xs font-black tracking-widest text-slate-600">
              {String(filteredPlayers.length).padStart(2, '0')} PLAYERS
            </span>
            <div className="h-px flex-1 bg-gradient-to-l from-transparent to-cyan-400/40" />
          </div>
        </div>

        {/* Search and filters */}
        <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="relative w-full md:max-w-sm">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg text-slate-500">
              ⌕
            </span>

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search players..."
              className="w-full rounded-2xl border border-white/10 bg-white/[0.035] py-4 pl-12 pr-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/10"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {[
              { label: 'All Players', value: 'all' },
              { label: 'Award Winners', value: 'awards' },
              { label: 'Prime 500+', value: 'prime' },
            ].map((item) => (
              <button
                key={item.value}
                onClick={() => setFilter(item.value)}
                className={`rounded-xl border px-4 py-3 text-xs font-black transition sm:text-sm ${
                  filter === item.value
                    ? 'border-cyan-400 bg-cyan-400 text-black'
                    : 'border-white/10 bg-white/[0.025] text-slate-400 hover:border-white/20 hover:text-white'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Trading cards */}
        {filteredPlayers.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:gap-8">
            {filteredPlayers.map((player) => {
              const cap = capStyles[player.capColor] || capStyles.cyan;

              return (
                <button
                  key={player.name}
                  onClick={() => setSelectedPlayer(player)}
                  className={`group relative overflow-hidden rounded-3xl border ${cap.border} bg-[#07111f] text-left shadow-xl shadow-black/20 transition duration-300 hover:-translate-y-2 hover:shadow-2xl ${cap.glow} focus:outline-none focus:ring-2 focus:ring-cyan-400`}
                >
                  {/* Card accent */}
                  <div className="absolute inset-x-0 top-0 z-10 h-1 bg-gradient-to-r from-cyan-400 via-blue-500 to-transparent opacity-80" />

                  {/* Photo */}
                  <div className="relative h-72 overflow-hidden sm:h-80">
                    <img
                      src={player.image}
                      alt={player.name}
                      className="h-full w-full object-cover object-center transition duration-700 group-hover:scale-105"
                      onError={(e) => {
                        e.currentTarget.style.opacity = '0';
                      }}
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-[#07111f] via-[#07111f]/10 to-transparent" />

                    {/* Card number */}
                    <div className="absolute left-5 top-5 flex h-12 w-12 items-center justify-center rounded-xl border border-white/20 bg-black/40 text-lg font-black text-white backdrop-blur-md">
                      {player.number}
                    </div>

                    {/* Prime rating */}
                    <div className="absolute right-5 top-5 rounded-xl border border-cyan-400/30 bg-black/50 px-3 py-2 text-right backdrop-blur-md">
                      <p className="text-[9px] font-black uppercase tracking-widest text-cyan-400">
                        Prime
                      </p>
                      <p className="text-2xl font-black text-white">
                        {player.primeRating}
                      </p>
                    </div>

                    {/* Player name */}
                    <div className="absolute bottom-5 left-5 right-5">
                      <p className="mb-1 text-[10px] font-black uppercase tracking-[0.25em] text-cyan-300">
                        STRIQ PLAYER CARD
                      </p>

                      <h2 className="text-4xl font-black uppercase tracking-tight text-white sm:text-5xl">
                        {player.name}
                      </h2>

                      <span
                        className={`mt-3 inline-flex rounded-lg border px-3 py-1.5 text-xs font-black uppercase tracking-wider ${cap.text} ${cap.border} ${cap.bg}`}
                      >
                        {player.title}
                      </span>
                    </div>
                  </div>

                  {/* Key statistics */}
                  <div className="px-5 pb-5 pt-2 sm:px-6 sm:pb-6">
                    <div className="mb-4 grid grid-cols-3 gap-2">
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                          Runs
                        </p>
                        <p className="mt-1 text-2xl font-black text-white">
                          {player.batting.Runs || 0}
                        </p>
                      </div>

                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                          Wickets
                        </p>
                        <p className="mt-1 text-2xl font-black text-white">
                          {player.bowling.Wickets || 0}
                        </p>
                      </div>

                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                          MOTM
                        </p>
                        <p className="mt-1 text-2xl font-black text-white">
                          {player.batting.MOTM || 0}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between border-t border-white/[0.08] pt-4">
                      <div className="flex gap-3 text-xs font-bold text-slate-500">
                        <span>
                          SR{' '}
                          <span className="text-slate-300">
                            {format(player.batting['Strike Rate'])}
                          </span>
                        </span>
                        <span>
                          WKTS{' '}
                          <span className="text-slate-300">
                            {player.bowling.Wickets || 0}
                          </span>
                        </span>
                      </div>

                      <span className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-cyan-400 transition group-hover:gap-3">
                        View Profile <span>↗</span>
                      </span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        ) : (
          <div className="rounded-3xl border border-white/10 bg-white/[0.025] py-20 text-center">
            <p className="text-xl font-black text-white">
              No players found
            </p>
            <p className="mt-2 text-sm text-slate-500">
              Try another name or change your filter.
            </p>
            <button
              onClick={() => {
                setSearch('');
                setFilter('all');
              }}
              className="mt-5 rounded-xl bg-cyan-400 px-5 py-3 text-sm font-black text-black transition hover:bg-cyan-300"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* Bottom note */}
        <div className="mt-16 rounded-3xl border border-white/[0.07] bg-gradient-to-r from-cyan-950/20 via-transparent to-blue-950/20 p-6 text-center sm:p-8">
          <p className="text-xs font-black uppercase tracking-[0.25em] text-cyan-400">
            The STRIQ Collection
          </p>
          <h3 className="mt-3 text-2xl font-black text-white sm:text-3xl">
            More than just numbers.
          </h3>
          <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-slate-500">
            Every run, every wicket, every match-winning moment.
            The stats tell the story. The players make it.
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/[0.07] py-8 text-center">
        <p className="text-xs font-bold tracking-wider text-slate-600">
          STRIQ · Built by Atharva Mehta
        </p>
      </footer>

      {/* Player details modal */}
      {selectedPlayer && (
        <PlayerModal
          player={selectedPlayer}
          batting={selectedPlayer.batting}
          bowling={selectedPlayer.bowling}
          primeRating={selectedPlayer.primeRating}
          onClose={() => setSelectedPlayer(null)}
        />
      )}
    </div>
  );
}