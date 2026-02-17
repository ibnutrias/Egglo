import { useState, useEffect } from 'react';
import EggControls from './components/EggControls';
// import ThemeToggle from './components/ThemeToggle';
import CookingView from './components/CookingView'; // <-- Import View Baru
import { calculateTime } from './utils/eggLogic';   // <-- Import Rumus (Modul 3)
import useTimer from './utils/useTimer';            // <-- Import Timer Hook (Modul 6.2)
import "./App.css";
function App() {
  const [settings, setSettings] = useState({
    mode: 'auto',
    size: 'large',
    temp: 'fridge',
    water: 'boiling',
    count: 1,
    doneness: 'medium',
    manualTime: 300
  });

  // State untuk menyimpan total waktu awal (untuk kalkulasi progress bar)
  const [initialTime, setInitialTime] = useState(0);

  // Panggil Custom Hook Timer
  const { timeLeft, isRunning, isPaused, startTimer, stopTimer, togglePause } = useTimer(0, () => {
    // Callback saat timer selesai (Waktu habis)
    // alert("TELUR MATANG! RENDAM AIR ES SEKARANG!"); // Nanti kita ganti suara
    // Kita biarkan user menekan stop manual atau otomatis stop
  });

  const handleStartCooking = () => {
    let timeToCook = 0;

    if (settings.mode === 'manual') {
      timeToCook = settings.manualTime;
    } else {
      // Panggil rumus sakti kita
      timeToCook = calculateTime(settings);
    }

    if (timeToCook > 0) {
      setInitialTime(timeToCook); // Simpan durasi total
      startTimer(timeToCook);     // Mulai hitung mundur
    } else {
      alert("Waktu masak tidak valid!");
    }
  };

  return (<>
    <div className="min-h-screen flex items-center justify-center p-4 relative transition-colors duration-500 font-serif z-10 inset-0 h-full w-full 
bg-[linear-gradient(to_right,#73737320_1px,transparent_1px),linear-gradient(to_bottom,#73737320_1px,transparent_1px)] 
bg-[size:20px_20px]">
      {/* <ThemeToggle /> */}
      {/* --- LAYER 1: SETUP FORM --- */}
      <div className="bg-base-100 card w-full max-w-lg shadow-xl border-2 border-primary/10 z-10">
        <div className="card-body">
          <div className="text-center mb-6">
            <h1 className="text-4xl font-bold text-primary mb-1">Egglo - The Egg Timer</h1>
            <p className="text-sm opacity-70 italic">Cooking has never been easier.</p>
          </div>

          <EggControls settings={settings} setSettings={setSettings} />

          {/* TOMBOL START (Pemicu Layar Masak) */}
          <div className="mt-8">
            <button
              onClick={handleStartCooking}
              className="btn btn-primary w-full btn-lg text-xl shadow-lg hover:scale-[1.02] transition-transform"
            >
              Start Cooking 🔥
            </button>
          </div>

        </div>
      </div>

      {/* --- LAYER 2: COOKING VIEW (OVERLAY) --- */}
      {/* Hanya render komponen ini jika Timer sedang berjalan (isRunning).
         Ini akan menutupi Layer 1 secara otomatis.
      */}
      {isRunning && (
        <CookingView
          totalTime={initialTime}
          timeLeft={timeLeft}
          isPaused={isPaused}
          onStop={stopTimer}
          onTogglePause={togglePause}
        />
      )}

    </div>
  </>
  );
}

export default App;