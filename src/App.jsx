import { useEffect, useState } from 'react'
import Papa from 'papaparse'
import { Link } from 'react-router-dom'
import PlayerGallery from './pages/PlayerGallery'


export default function CricketIO() {
  const [battingData, setBattingData] = useState([])
  const [bowlingData, setBowlingData] = useState([])

  useEffect(() => {
    Papa.parse(
      'https://docs.google.com/spreadsheets/d/e/2PACX-1vQWRTAVB4A2Nx3qtXg8p_b6w1yRdYp_bKbycTuPyZRsRlzLxvloddMU1s-gcHeQkvlmrVOdZeWgrrx1/pub?output=csv&gid=0',
      {
        download: true,
        header: true,
        complete: (results) => {
          const cleaned = results.data.filter(
            (player) => player.Player
          )

          const sorted = cleaned.sort(
            (a, b) => Number(b.Runs) - Number(a.Runs)
          )

          setBattingData(sorted)
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
          const cleaned = results.data.filter(
            (player) => player.Player
          )

          const sorted = cleaned.sort(
            (a, b) => Number(b.Wickets) - Number(a.Wickets)
          )

          setBowlingData(sorted)
        },
      }
    )
  }, [])

const orangeCapLeader = battingData[0]
const purpleCapLeader = bowlingData[0]

const primeCapData = battingData
  .map((player) => {
    const bowler =
      bowlingData.find(
        (b) => b.Player === player.Player
      ) || {}

    const primePoints =
      Number(player.Runs || 0) +
      Number(bowler.Wickets || 0) * 25 +
      Number(player.MOTM || 0) * 15 +
      Number(player.Hundreds || 0) * 30 +
      Number(player.Fifties || 0) * 20 +
      Number(player.Thirties || 0) * 15 +
      Number(bowler.DotBalls || 0) * 0.5

    return {
      ...player,
      PrimePoints: Math.round(primePoints),
    }
  })
  .sort(
    (a, b) =>
      b.PrimePoints - a.PrimePoints
  )

const primeCapLeader = primeCapData[0]

  return (
    <div className="min-h-screen bg-[#030712] text-white overflow-hidden">
      <nav className="border-b border-white/10 bg-black/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 via-cyan-400 to-orange-500 flex items-center justify-center font-black text-black text-xl shadow-lg shadow-cyan-500/20">
              c
            </div>

            <div>
              <h1 className="text-3xl font-black tracking-tight">
                Cricket IO
              </h1>
            </div>
          </div>

          <Link to="/halloffame" className="bg-emerald-400 hover:bg-emerald-300 transition text-black font-bold px-6 py-3 rounded-2xl shadow-lg shadow-emerald-500/20">
            HALL OF FAME ↗
          </Link>
        </div>
      </nav>

      <section className="relative py-32 px-6">
        <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/10 via-purple-500/5 to-transparent blur-3xl"></div>

        <div className="max-w-6xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-400/30 px-5 py-2 rounded-full mb-8">
            <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>

            <span className="text-emerald-300 font-semibold tracking-wide">
              LIVE ANALYSIS BY ATHARVA MEHTA
            </span>
          </div>

          <h1 className="text-6xl md:text-8xl font-black leading-none tracking-tight">
            <span className="text-white">
              BEYOND STATS.
            </span>

            <br />

            <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-500 bg-clip-text text-transparent">
              TOTAL DOMINATION.
            </span>
          </h1>

          <p className="mt-8 text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">
            Koh-e-Fiza cricket leaderboard backed by live Google Sheets stats.
          </p>

        
          <div className="flex justify-center gap-8 mt-14 flex-wrap">
            <a href="#orange-cap">
              <button className="bg-gradient-to-r from-orange-400 to-amber-500 text-white font-black px-10 py-5 rounded-3xl text-xl shadow-2xl shadow-orange-500/20 hover:scale-105 transition duration-300">
                ✦ ORANGE CAP RACE
              </button>
            </a>

            <a href="#purple-cap">
              <button className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-black px-10 py-5 rounded-3xl text-xl shadow-2xl shadow-purple-500/20 hover:scale-105 transition duration-300">
                ✦ PURPLE CAP RACE
              </button>
            </a>
          </div>

          <div className="flex justify-center mt-6">
            <Link to="/halloffame">
              <button className="bg-gradient-to-r from-emerald-400 to-green-500 text-white font-black px-12 py-5 rounded-3xl text-xl shadow-2xl shadow-orange-500/20 hover:scale-105 transition duration-300">
                   🏆 HALL OF FAME ➜ 
              </button>
            </Link>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-4 ">
          <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl shadow-2xl shadow-emerald-500/5">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-4xl font-black bg-gradient-to-r from-slate-200 via-zinc-300 to-slate-400 bg-clip-text text-transparent">
                  🧢Prime Cap
                </h2>

              
              </div>
            </div>

          <section className="max-w-7xl mx-auto px-6 py-2 grid md:grid-cols-1 gap-10"></section>
            <div className="space-y-5">
              {primeCapData.slice(0, 5).map((player, index) => (
                <div
                  key={index}
                  className="bg-black/30 border border-white/5 rounded-2xl p-5 flex items-center justify-between hover:border-emerald-400/30 transition"
                >
                  <div className="flex items-center gap-5">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-slate-200 via-zinc-300 to-slate-400 flex items-center justify-center text-black font-black text-xl">
                      #{index + 1}
                    </div>

                    <div>
                      <h3 className="text-2xl font-bold">
                        {player.Player}

                        {index !== 0 &&
                          primeCapLeader && (
                            <span className="text-red-400 text-sm font-semibold ml-2">
                              ▼{" "}
                              {primeCapLeader.PrimePoints -
                                player.PrimePoints}
                            </span>
                          )}
                      </h3>

                      <p className="text-gray-400">
                        Season 1 Ratings
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-4xl font-black bg-gradient-to-r from-slate-200 via-zinc-300 to-slate-400 bg-clip-text text-transparent">
                      {player.PrimePoints}
                    </div>

                    <div className="text-gray-500 text-sm">
                      Prime Points
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>        

      <section className="max-w-7xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-10">
        <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl shadow-2xl shadow-orange-500/5">
          <div id="orange-cap" className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-4xl font-black text-orange-400">
                Orange Cap
              </h2>

              <p className="text-gray-400 mt-2">
                Top Run Scorers
              </p>
            </div>
          </div>

          <div className="space-y-5">
            {battingData.slice(0, 5).map((player, index) => (
              <div
                key={index}
                className="bg-black/30 border border-white/5 rounded-2xl p-5 flex items-center justify-between hover:border-orange-400/30 transition"
              >
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center text-black font-black text-xl">
                    #{index + 1}
                  </div>

                  <div>
                    <h3 className="text-2xl font-bold">
                      {player.Player} {index !== 0 && orangeCapLeader && (
  <span className="text-red-400 text-sm font-semibold mt-1">
    ▼ {Number(orangeCapLeader.Runs) - Number(player.Runs)}
  </span>
)}
                    </h3> 
                    

                    <p className="text-gray-400">
                      SR: {player['Strike Rate']} | Innings: {player.Innings}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-4xl font-black text-orange-400">
                    {player.Runs}
                  </div>

                  <div className="text-gray-500 text-sm">
  Runs
</div>


                
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl shadow-2xl shadow-purple-500/5">
          <div id="purple-cap" className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-4xl font-black text-purple-400">
                Purple Cap
              </h2>

              <p className="text-gray-400 mt-2">
                Top Wicket Takers
              </p>
            </div>
          </div>

          <div className="space-y-5">
            {bowlingData.slice(0, 5).map((player, index) => (
              <div
                key={index}
                className="bg-black/30 border border-white/5 rounded-2xl p-5 flex items-center justify-between hover:border-purple-400/30 transition"
              >
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-400 to-indigo-500 flex items-center justify-center text-white font-black text-xl">
                    #{index + 1}
                  </div>

                  <div>
                    <h3 className="text-2xl font-bold">
                      {player.Player} {index !== 0 && purpleCapLeader && (
  <span className="text-red-400 text-sm font-semibold mt-1">
    ▼ {Number(purpleCapLeader.Wickets) - Number(player.Wickets)}
  </span>
)}
                    </h3> 

                    <p className="text-gray-400">
                      Economy: {player.Economy} | Overs: {player.Overs}
                    </p>
                    
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-4xl font-black text-purple-400">
                    {player.Wickets}
                  </div>

                  <div className="text-gray-500 text-sm">
                    Wickets
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 pb-14">
        <div className="bg-white/5 border border-white/10 rounded-3xl p-8 overflow-x-auto">
          <div className="mb-8">
            <h2 className="text-4xl font-black">
              Batting Stats
            </h2>
          </div>

          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/10 text-gray-400">
                <th className="pb-4">Player</th>
                <th className="pb-4">Runs</th>
                <th className="pb-4">Highest</th>
                <th className="pb-4">SR</th>
                <th className="pb-4">4s</th>
                <th className="pb-4">6s</th>
              </tr>
            </thead>

            <tbody>
              {battingData.map((player, index) => (
                <tr
                  key={index}
                  className="border-b border-white/5 hover:bg-white/5 transition"
                >
                  <td className="py-5 font-bold">
                    {player.Player}
                  </td>

                  <td>{player.Runs}</td>

                  <td>{player.Highest}</td>

                  <td>{player['Strike Rate']}</td>

                  <td>{player.Fours}</td>

                  <td>{player.Sixes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 pb-24">
        <div className="bg-white/5 border border-white/10 rounded-3xl p-8 overflow-x-auto">
          <div className="mb-8">
            <h2 className="text-4xl font-black">
              Bowling Stats
            </h2>
          </div>

          <table className="w-full text-left">
  <thead>
    <tr className="border-b border-white/10 text-gray-400">
      <th className="pb-4">Player</th>
      <th className="pb-4">Innings</th>
      <th className="pb-4">Wickets</th>
      <th className="pb-4">Economy</th>
      <th className="pb-4">Overs</th>
      <th className="pb-4">Dot Balls</th>
    </tr>
  </thead>

  <tbody>
    {bowlingData.map((player, index) => (
      <tr
        key={index}
        className="border-b border-white/5 hover:bg-white/5 transition"
      >
        <td className="py-5 font-bold">
          {player.Player}
        </td>

        <td>{player.Innings}</td>

        <td>{player.Wickets}</td>

        <td>{player.Economy}</td>

        <td>{player.Overs}</td>

        <td>{player.DotBalls}</td>
      </tr>
    ))}
  </tbody>
</table>
        </div>
      </section>

      <footer className="border-t border-white/10 mt-10 py-10 text-center text-gray-500">
        <p>
          Cricket IO • Built by Atharva Mehta
        </p>
      </footer>
    </div>
  )
}