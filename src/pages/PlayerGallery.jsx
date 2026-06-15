import { Link } from 'react-router-dom'
import atharvaImg from 'C:\\Users\\athar\\OneDrive\\Desktop\\cricketio\\src\\assets\\players\\atharva.jpeg' 

export default function PlayerGallery() {
const players = [
  { name: "Atharva", image: atharvaImg },
  { name: "Hardik" },
  { name: "Ashish" },
  { name: "Shouryam"},
  { name: "Kartik" },
  { name: "Ayush"},
]

  return (
    <div className="min-h-screen bg-[#030712] text-white">

      <nav className="border-b border-white/10 bg-black/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 via-cyan-400 to-orange-500 flex items-center justify-center font-black text-black text-xl shadow-lg shadow-cyan-500/20">
              C
            </div>

            <h1 className="text-3xl font-black tracking-tight">
              Cricket IO
            </h1>
          </div>

          <Link
            to="/"
            className="bg-emerald-400 hover:bg-emerald-300 transition text-black font-bold px-6 py-3 rounded-2xl shadow-lg shadow-emerald-500/20"
          >
            ← HOME
          </Link>

        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-16">

        <div className="flex items-center justify-center gap-8 mb-24">

          <div className="h-[2px] w-20 md:w-64 bg-gradient-to-r from-transparent to-white/20"></div>

          <h1 className="text-3xl md:text-6xl font-black tracking-[0.2em] uppercase whitespace-nowrap text-cyan-400">
            Player Gallery
          </h1>

          <div className="h-[2px] w-20 md:w-64 bg-gradient-to-l from-transparent to-white/20"></div>

        </div>

        <div className="grid md:grid-cols-3 gap-8">

          {players.map((player) => (
            <div
              key={player}
              className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden hover:border-cyan-400/30 transition duration-300"
            >

              <img
                src={player.image}
                alt={player.name}
                className="h-72 w-full object-cover"
              />

              <div className="p-6">
                <h2 className="text-2xl font-black">
                  {player.name}
                </h2>

                <p className="text-gray-400 mt-2">
                  Cricket IO Player
                </p>
              </div>

            </div>
          ))}

        </div>

      </div>

      <footer className="border-t border-white/10 mt-20 py-10 text-center text-gray-500">
        <p>
          Cricket IO • Built by Atharva Mehta
        </p>
      </footer>

    </div>
  )
}