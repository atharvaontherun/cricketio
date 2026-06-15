import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Papa from 'papaparse';

import atharvaImg from '../assets/players/atharva.jpeg';
import hardikImg from '../assets/players/hardik.png';
import ashishImg from '../assets/players/ashish.png';
import shouryamImg from '../assets/players/shouryam.png';
import kartikImg from '../assets/players/kartik.png';
import ayushImg from '../assets/players/ayush.png';

export default function PlayerGallery() {
  const [battingData, setBattingData] = useState([]);
  const [bowlingData, setBowlingData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Papa.parse(
      'https://docs.google.com/spreadsheets/d/e/2PACX-1vQWRTAVB4A2Nx3qtXg8p_b6w1yRdYp_bKbycTuPyZRsRlzLxvloddMU1s-gcHeQkvlmrVOdZeWgrrx1/pub?output=csv&gid=0',
      {
        download: true,
        header: true,
        complete: (results) => setBattingData(results.data.filter(p => p.Player?.trim())),
        error: (err) => console.error('Batting error:', err),
      }
    );
  }, []);

  useEffect(() => {
    Papa.parse(
      'https://docs.google.com/spreadsheets/d/e/2PACX-1vQWRTAVB4A2Nx3qtXg8p_b6w1yRdYp_bKbycTuPyZRsRlzLxvloddMU1s-gcHeQkvlmrVOdZeWgrrx1/pub?output=csv&gid=1841998730',
      {
        download: true,
        header: true,
        complete: (results) => {
          setBowlingData(results.data.filter(p => p.Player?.trim()));
          setLoading(false);
        },
        error: (err) => {
          console.error('Bowling error:', err);
          setLoading(false);
        },
      }
    );
  }, []);

 const players = [
  { 
    name: 'Atharva', 
    image: atharvaImg, 
    title: 'Powerplay Terror', 
    capColor: 'red' 
  },
  { 
    name: 'Hardik', 
    image: hardikImg, 
    title: 'Purple Cap Leader', 
    capColor: 'purple' 
  },
  { 
    name: 'Ashish', 
    image: ashishImg, 
    title: 'Orange Cap Leader', 
    capColor: 'orange' 
  },       // leave empty if no title
  { name: 'Shouryam', image: shouryamImg, title: 'Elite Clutch Player' },
  { name: 'Kartik', image: kartikImg, title: 'Utility Player' },
  { name: 'Ayush', image: ayushImg, title: 'Emerging Player' },
];

  if (loading) {
    return (
      <div className="min-h-screen bg-[#030712] text-white flex items-center justify-center">
        <p className="text-xl">Loading player stats...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#030712] text-white">
      <nav className="border-b border-white/10 bg-black/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 via-cyan-400 to-orange-500 flex items-center justify-center font-black text-black text-xl shadow-lg shadow-cyan-500/20">
              C
            </div>
            <h1 className="text-3xl font-black tracking-tight">Cricket IO</h1>
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
          {players.map((player) => {
            const playerData = battingData.find(
              (p) => p.Player?.trim().toLowerCase() === player.name.toLowerCase()
            ) || {};

            const bowlerData = bowlingData.find(
              (p) => p.Player?.trim().toLowerCase() === player.name.toLowerCase()
            ) || {};

            const primeRating =
              Number(playerData.Runs || 0) +
              Number(bowlerData.Wickets || 0) * 25 +
              Number(playerData.MOTM || 0) * 15 +
              Number(playerData.Hundreds || 0) * 30 +
              Number(playerData.Fifties || 0) * 20 +
              Number(playerData.Thirties || 0) * 15 +
              Number(bowlerData.DotBalls || 0) * 0.5;

            return (
              <div
                key={player.name}
                className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden hover:border-cyan-400/30 transition duration-300"
              >
                <img
                  src={player.image}
                  alt={player.name}
                  className="h-72 w-full object-cover"
                  onError={(e) => e.target.style.display = 'none'}
                />

                <div className="p-6">
                  <h2 className="text-3xl font-black">{player.name}</h2>
                 {player.title && (
  <p 
    className={`font-bold mt-1 text-lg ${
      player.capColor === 'orange' ? 'text-orange-400' : 
      player.capColor === 'red' ? 'text-red-400' : 
      player.capColor === 'purple' ? 'text-purple-400' : 
      'text-cyan-400'
    }`}
  >
    {player.title}
  </p>
)}
                
                  <div className="mt-4 space-y-2 text-sm">
                  
                    <p className="text-cyan-400 font-black text-lg mt-4">
                      👑 Prime Rating: {Math.round(primeRating)}
                    </p>
                    <p>🏏 Runs: {playerData.Runs || 0}</p>
                    <p>⚡ Strike Rate: {playerData['Strike Rate'] || 0}</p>
                    <p>🎯 Wickets taken: {bowlerData.Wickets || 0}</p>
                    <p>🏆 MOTM: {playerData.MOTM || 0}</p>
                    <p>💯 Fifties: {playerData.Fifties || 0}</p>
                    <p>🔥 Thirties: {playerData.Thirties || 0}</p>
                    <p>⚪ Dot Balls: {bowlerData.DotBalls || 0}</p>

                    
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <footer className="border-t border-white/10 mt-20 py-10 text-center text-gray-500">
        <p>Cricket IO • Built by Atharva Mehta</p>
      </footer>
    </div>
  );
}