import { useEffect, useState } from 'react'
import Papa from 'papaparse'
import { Link } from 'react-router-dom' 

export default function HallOfFame() {
  const [battingData, setBattingData] = useState([])
  const [bowlingData, setBowlingData] = useState([])
  const [motmData, setMotmData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Papa.parse(
      'https://docs.google.com/spreadsheets/d/e/2PACX-1vQWRTAVB4A2Nx3qtXg8p_b6w1yRdYp_bKbycTuPyZRsRlzLxvloddMU1s-gcHeQkvlmrVOdZeWgrrx1/pub?output=csv&gid=0',
      {
        download: true,
        header: true,
        complete: (results) => {
          const cleaned = results.data.filter((player) => player.Player)
          setBattingData(cleaned)
        },
      }
    )
  }, [])

  useEffect(() => {
    Papa.parse(
      'https://docs.google.com/spreadsheets/d/e/2PACX-1vQWRTAVB4A2Nx3qtXg8p_b6w1yRdYp_bKbycTuPyZRsRlzLxvloddMU1s-gcHeQkvlmrVOdZeWgrrx1/pub?output=csv&gid=1841998730',
      {
        download: true,
        header: true,
        complete: (results) => {
          const cleaned = results.data.filter((player) => player.Player)
          setBowlingData(cleaned)
        },
      }
    )
  }, [])

  useEffect(() => {
    Papa.parse(
      'https://docs.google.com/spreadsheets/d/e/2PACX-1vQWRTAVB4A2Nx3qtXg8p_b6w1yRdYp_bKbycTuPyZRsRlzLxvloddMU1s-gcHeQkvlmrVOdZeWgrrx1/pub?output=csv&gid=0',
      {
        download: true,
        header: true,
        complete: (results) => {
          const cleaned = results.data.filter((player) => player.Player)
          setMotmData(cleaned)
          setLoading(false)        // ← Stop loading when last fetch completes
        },
      }
    )
  }, [])

  // Safety fallback
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 8000)
    return () => clearTimeout(timer)
  }, [])

  const sections = [
    {
      title: 'Most Man Of The Matches',
      stat: 'MOTM',
      color: 'from-yellow-300 via-amber-400 to-orange-500',
      data: [...motmData]
        .sort((a, b) => Number(b.MOTM) - Number(a.MOTM))
        .slice(0, 5),
    },

    {
      title: 'Highest Individual Scores',
      stat: 'Highest',
      color: 'from-orange-400 to-red-500',
      data: [...battingData]
        .sort((a, b) => parseInt(b.Highest) - parseInt(a.Highest))
        .slice(0, 5),
    },

    {
      title: 'Strike Rate Monsters',
      stat: 'Strike Rate',
      color: 'from-cyan-400 to-blue-500',
      data: [...battingData]
        .filter((p) => Number(p.Runs) > 100)
        .sort((a, b) => Number(b['Strike Rate']) - Number(a['Strike Rate']))
        .slice(0, 5),
    },
    {
      title: 'Most Thirties',
      stat: 'Thirties',
      color: 'from-lime-400 to-green-500',
      data: [...battingData]
        .sort((a, b) => Number(b.Thirties) - Number(a.Thirties))
        .slice(0, 5),
    },

    {
      title: 'Most Six Hitters',
      stat: 'Sixes',
      color: 'from-pink-400 to-purple-500',
      data: [...battingData]
        .sort((a, b) => Number(b.Sixes) - Number(a.Sixes))
        .slice(0, 5),
    },

    {
      title: 'Economy Gods',
      stat: 'Economy',
      color: 'from-emerald-400 to-green-500',
      data: [...bowlingData]
        .filter((p) => Number(p.Overs) >= 5)
        .sort((a, b) => parseFloat(a.Economy) - parseFloat(b.Economy))
        .slice(0, 5),
    },

    {
      title: 'Most Fifties',
      stat: 'Fifties',
      color: 'from-yellow-400 to-amber-500',
      data: [...battingData]
       .sort((a, b) => Number(b.Fifties) - Number(a.Fifties))
       .slice(0, 5),
    },

    {
      title: 'On The Go 4s',
      stat: 'Fours',
      color: 'from-yellow-400 to-amber-500',
      data: [...battingData]
       .sort((a, b) => Number(b.Fours) - Number(a.Fours))
       .slice(0, 5),
    },

    {
      title: 'Dot Ball Kings',
      stat: 'DotBalls',
      color: 'from-violet-400 to-indigo-500',
      data: [...bowlingData]
        .sort((a, b) => Number(b.DotBalls) - Number(a.DotBalls))
        .slice(0, 5),
    },
  ]

  const maxDucks = Math.max(...battingData.map((p) => Number(p.Ducks || 0)))

  const duckKings = battingData.filter(
    (p) => Number(p.Ducks) === maxDucks
  )

  const worstBowling = [...bowlingData]
    .sort((a, b) => Number(b.WorstBowling) - Number(a.WorstBowling))[0]

  // Loading Screen
  if (loading) {
    return (
      <div className="min-h-screen bg-[#030712] text-white flex flex-col items-center justify-center">

  <img
    src="/favicon.svg"
    alt="Cricket IO"
    className="w-28 h-28 mb-6 animate-bounce"
  />

  <h1 className="text-5xl md:text-7xl font-black tracking-tight">
    Cricket IO
  </h1>

  <p className="text-gray-400 text-sm md:text-base mt-3 tracking-widest uppercase">
    Loading Hall of Fame...
  </p>

</div>
    )
  }

  return (
    <div className="min-h-screen bg-[#030712] text-white pb-20">
      {/* Rest of your code stays exactly the same from here */}
      <nav className="border-b border-white/10 bg-black/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/">
  <img
    src="/favicon.svg"
    alt="Cricket IO"
    className="w-8 h-8 rounded-xl animate-pulse"
  />
</Link>

            <div>
              <h1 className="text-3xl font-black tracking-tight">
                <Link to="/">Cricket IO</Link>
              </h1>
            </div>
          </div>

          <Link to="/" className="bg-emerald-400 hover:bg-emerald-300 transition text-black font-bold px-6 py-3 rounded-2xl shadow-lg shadow-emerald-500/20">
            ← HOME
          </Link>
        </div>
      </nav>

      {/* HALL OF FAME */}
      <div className="flex items-center justify-center gap-8 mt-12 mb-16">
        <div className="h-[2px] w-20 md:w-64 bg-gradient-to-r from-transparent to-white/20"></div>

        <h1 className="text-3xl md:text-6xl font-black tracking-[0.2em] uppercase whitespace-nowrap text-green-500">
          Hall Of Fame
        </h1>

        <div className="h-[2px] w-20 md:w-64 bg-gradient-to-l from-transparent to-white/20"></div>
      </div>

      {/* ... rest of your JSX remains unchanged ... */}
      {/* (All the sections, Hall of Shame, footer etc. stay exactly as you had) */}

      {/* Just paste your original return content from the <div className="flex items-center..."> down to the end */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">

        {sections.map((section, idx) => {
          const winner = section.data[0]
          const others = section.data.slice(1, 5)

          return (
            <div
              key={idx}
              className="bg-white/[0.03] border border-white/10 rounded-[2rem] p-7 backdrop-blur-xl hover:border-white/20 transition duration-300"
            >
              <div className="mb-8">
                <p className="text-white/40 text-sm uppercase tracking-[0.25em] mb-3">
                  {section.title}
                </p>

                <div
                  className={`inline-block bg-gradient-to-r ${section.color} bg-clip-text text-transparent`}
                >
                  <h1 className="text-6xl font-black leading-none">
  {winner?.[section.stat]}

  {section.stat === 'Highest' &&
    winner?.HighB&& (
      <span className="text-2xl text-white/50 ml-3">
        ({winner.HighB})
      </span>
  )}
</h1>
                </div>

                <p className="text-xl font-semibold mt-3">
                  {winner?.Player}
                </p>
              </div>

              <div className="space-y-4">
                {others.map((player, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between text-white/40"
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-sm font-bold">
                        #{index + 2}
                      </span>

                      <span className="text-sm md:text-base">
                        {player.Player}
                      </span>
                    </div>

                    <span className="text-sm md:text-base font-semibold">
  {player[section.stat]}

  {section.stat === 'Highest' &&
    player.HighB && (
      <span className="text-white/40 ml-1">
        ({player.HighB})
      </span>
  )}
</span>
                  </div>
                ))}
              </div>
            </div>
          )
        })}

      </div>

      {/* HALL OF SHAME */}

      <div className="mt-36">

        <div className="flex items-center justify-center gap-8 mb-20">
          <div className="h-[2px] w-20 md:w-64 bg-gradient-to-r from-transparent to-red-500/30"></div>

          <h1 className="text-3xl md:text-6xl font-black tracking-[0.2em] uppercase whitespace-nowrap text-red-500">
            Hall Of Shame
          </h1>

          <div className="h-[2px] w-20 md:w-64 bg-gradient-to-l from-transparent to-red-500/30"></div>
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">

          <div className="bg-red-500/5 border border-red-500/10 rounded-[2rem] p-7 backdrop-blur-xl">
            <p className="text-red-400/70 text-sm uppercase tracking-[0.25em] mb-3">
              Most Ducks
            </p>

            <h1 className="text-6xl font-black text-red-500 leading-none">
              {maxDucks}
            </h1>

            <p className="text-xl font-semibold mt-4 text-gray-300">
              {duckKings.map((player) => player.Player).join(', ')}
            </p>
          </div>

          <div className="bg-red-500/5 border border-red-500/10 rounded-[2rem] p-7 backdrop-blur-xl">
            <p className="text-red-400/70 text-sm uppercase tracking-[0.25em] mb-3">
              Worst Bowling
            </p>

            <h1 className="text-5xl font-black text-red-500 leading-none">
              {worstBowling?.WorstBowling}44 ({worstBowling?.Balls}9)
            </h1>

            <p className="text-xl font-semibold mt-4 text-gray-300">
              Shouryam
            </p>
          </div>

          <div className="bg-red-500/5 border border-red-500/10 rounded-[2rem] p-7 backdrop-blur-xl">
            <p className="text-red-400/70 text-sm uppercase tracking-[0.25em] mb-3">
              Slowest Knock
            </p>

            <h1 className="text-5xl font-black text-red-500 leading-none">
              9(13)
            </h1>

            <p className="text-xl font-semibold mt-4 text-gray-300">
              Kartik
            </p>
          </div>
          
        </div>

      </div>
      
      
        <footer className="border-t border-white/10 mt-10 py-10 text-center text-gray-500">
        <div className="flex justify-center mb-10">
  <Link to="/">
    <button className="bg-gradient-to-r from-cyan-400 to-blue-500 hover:scale-105 hover:shadow-cyan-500/40 transition duration-300 text-black font-black px-8 py-4 rounded-2xl shadow-2xl shadow-cyan-500/20">
      ← BACK TO HOME
    </button>
  </Link>
</div>
        <p>
          Cricket IO • Built by Atharva Mehta
        </p>
      </footer>
    </div>
  )
}