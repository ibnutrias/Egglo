import React from 'react';

const EggControls = ({ settings, setSettings }) => {

    // --- LOGIC AREA ---

    const handleChange = (key, value) => {
        setSettings({ ...settings, [key]: value });
    };

    const handleManualTimeChange = (type, val) => {
        let safeVal = Math.max(0, parseInt(val) || 0);
        let currentTotal = settings.manualTime;
        let currentMins = Math.floor(currentTotal / 60);
        let currentSecs = currentTotal % 60;

        if (type === 'min') {
            const newTotal = (safeVal * 60) + currentSecs;
            handleChange('manualTime', newTotal);
        }
        else if (type === 'sec') {
            if (safeVal > 59) safeVal = 59;
            const newTotal = (currentMins * 60) + safeVal;
            handleChange('manualTime', newTotal);
        }
    };

    // DATA UKURAN
    const sizes = [
        { id: 'quail', label: 'Quail', img: '/images/quail.png' },
        { id: 'small_medium', label: 'Small/Medium', img: '/images/small.png' },
        { id: 'large', label: 'Large', img: '/images/large.png' },
        { id: 'jumbo', label: 'Jumbo', img: '/images/jumbo.png' },
    ];

    // DATA TINGKAT KEMATANGAN (UPDATED: NOW WITH IMAGES)
    const donenessOptions = [
        {
            id: 'soft',
            label: 'Soft',
            desc: 'Soft-boiled',
            img: '/images/soft.png'  // <-- Ganti emoji dengan path gambar
        },
        {
            id: 'medium',
            label: 'Medium',
            desc: 'Medium-boiled',
            img: '/images/medium.png' // <-- Ganti emoji dengan path gambar
        },
        {
            id: 'hard',
            label: 'Hard',
            desc: 'Hard-boiled',
            img: '/images/hard.png' // <-- Ganti emoji dengan path gambar
        },
    ];

    // --- VIEW AREA ---
    return (
        <div className="space-y-6">

            {/* TAB SWITCHER (MODE) */}
            <div role="tablist" className="tabs tabs-boxed bg-base-200 p-1 font-bold shadow-inner">
                <a
                    role="tab"
                    className={`tab flex-1 transition-all duration-300 ${settings.mode === 'auto' ? 'tab-active bg-primary text-primary-content shadow-sm' : 'hover:bg-base-300'}`}
                    onClick={() => handleChange('mode', 'auto')}
                >
                    🤖 Smart Mode
                </a>
                <a
                    role="tab"
                    className={`tab flex-1 transition-all duration-300 ${settings.mode === 'manual' ? 'tab-active bg-secondary text-secondary-content shadow-sm' : 'hover:bg-base-300'}`}
                    onClick={() => handleChange('mode', 'manual')}
                >
                    ⏱️ Custom Timer
                </a>
            </div>

            {/* KONTEN MODE AUTO */}
            {settings.mode === 'auto' ? (
                <div className="space-y-6 animate-fade-in-up">

                    {/* A. UKURAN TELUR */}
                    <div className="form-control">
                        <label className="label"><span className="mb-2 label-text font-bold text-base">Egg Size</span></label>
                        <div className="grid grid-cols-4 gap-3">
                            {sizes.map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => handleChange('size', item.id)}
                                    className={`
                    flex flex-col items-center justify-center p-2 rounded-xl border-2 transition-all relative overflow-hidden group
                    ${settings.size === item.id
                                            ? 'border-primary bg-primary/10 shadow-md scale-105'
                                            : 'border-transparent hover:bg-base-200 hover:border-base-300'
                                        }
                  `}
                                >
                                    <div className="w-12 h-12 mb-1 relative transition-transform duration-300 group-hover:-translate-y-1">
                                        <img
                                            src={item.img}
                                            alt={item.label}
                                            className="w-full h-full object-contain drop-shadow-sm"
                                            onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'block' }}
                                        />
                                        <span className="hidden text-3xl text-center w-full absolute top-0">🥚</span>
                                    </div>
                                    <span className="text-[10px] font-bold uppercase tracking-wide opacity-80">{item.label}</span>

                                    {settings.size === item.id && (
                                        <div className="absolute top-1 right-1 w-2 h-2 rounded-full bg-primary animate-pulse"></div>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* B. TARGET KEMATANGAN (UPDATED UI WITH IMAGES) */}
                    <div className="form-control">
                        <label className="label"><span className="mb-2 label-text font-bold text-base">Doneness</span></label>
                        <div className="grid grid-cols-3 gap-3">
                            {donenessOptions.map((opt) => (
                                <button
                                    key={opt.id}
                                    onClick={() => handleChange('doneness', opt.id)}
                                    className={`
                    flex flex-col items-center p-3 rounded-xl border-2 transition-all text-center h-full group overflow-hidden relative
                    ${settings.doneness === opt.id
                                            ? 'border-secondary bg-secondary/10 shadow-md scale-[1.02]'
                                            : 'border-base-200 hover:border-secondary/50 bg-base-100 hover:shadow-sm'
                                        }
                  `}
                                >
                                    {/* Container Gambar dengan tinggi tetap agar rapi */}
                                    <div className="h-16 w-full mb-2 relative flex items-center justify-center transition-transform duration-300 group-hover:-translate-y-1">
                                        <img
                                            src={opt.img}
                                            alt={opt.label}
                                            className="h-full object-contain drop-shadow-sm rounded-md"
                                            // Fallback jika gambar tidak ditemukan
                                            onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'block' }}
                                        />
                                        <span className="hidden text-4xl absolute">🍳</span>
                                    </div>

                                    <span className="font-bold text-sm leading-tight">{opt.label}</span>
                                    <span className="text-[10px] opacity-70 mt-1 leading-tight">{opt.desc}</span>

                                    {/* Indikator Centang */}
                                    {settings.doneness === opt.id && (
                                        <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-secondary animate-pulse"></div>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* C. JUMLAH & SUHU */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="form-control">
                            <label className="label"><span className="mb-2 label-text font-bold">Egg Count</span></label>
                            <div className="join w-full shadow-sm">
                                <button className="btn btn-sm join-item btn-neutral" onClick={() => handleChange('count', Math.max(1, settings.count - 1))}>-</button>
                                <input
                                    type="number"
                                    value={settings.count}
                                    min="1"
                                    onChange={(e) => handleChange('count', Math.max(1, parseInt(e.target.value) || 1))}
                                    className="input input-sm input-bordered join-item w-full text-center font-bold bg-base-100"
                                />
                                <button className="btn btn-sm join-item btn-neutral" onClick={() => handleChange('count', settings.count + 1)}>+</button>
                            </div>
                        </div>

                        <div className="form-control">
                            <label className="label"><span className="mb-2 label-text font-bold">Starting Temperature</span></label>
                            <select
                                className="select select-bordered select-sm w-full font-medium"
                                value={settings.temp}
                                onChange={(e) => handleChange('temp', e.target.value)}
                            >
                                <option value="fridge">❄️ Refrigerator</option>
                                <option value="room">🌡️ Room</option>
                            </select>
                        </div>
                    </div>

                    {/* D. KONDISI AIR */}
                    <div className="form-control">
                        <label className="label"><span className="mb-2 label-text font-bold">Water Temperature</span></label>
                        <div className="flex gap-2 bg-base-200/50 p-1.5 rounded-lg border border-base-200">
                            <button
                                onClick={() => handleChange('water', 'boiling')}
                                className={`flex-1 btn btn-sm border-0 ${settings.water === 'boiling' ? 'btn-white bg-white text-error shadow-sm' : 'btn-ghost opacity-60'}`}
                            >
                                🔥 Boiling
                            </button>
                            <button
                                onClick={() => handleChange('water', 'cold')}
                                className={`flex-1 btn btn-sm border-0 ${settings.water === 'cold' ? 'btn-white bg-white text-info shadow-sm' : 'btn-ghost opacity-60'}`}
                            >
                                💧 Cold
                            </button>
                        </div>
                    </div>

                </div>
            ) : (
                /* KONTEN MODE MANUAL (Tidak Berubah) */
                <div className="py-8 animate-fade-in-up">
                    <div className="text-center space-y-6">
                        <div className="flex items-end justify-center gap-4 text-secondary">
                            <div className="flex flex-col gap-2">
                                <input
                                    type="number"
                                    min="0"
                                    className="input input-lg input-bordered w-28 text-center text-5xl font-mono p-0 h-24 shadow-inner bg-base-100 focus:outline-secondary"
                                    placeholder="00"
                                    value={Math.floor(settings.manualTime / 60)}
                                    onChange={(e) => handleManualTimeChange('min', e.target.value)}
                                />
                                <span className="text-xs font-bold tracking-widest opacity-50">Minutes</span>
                            </div>
                            <span className="text-5xl font-bold pb-10 opacity-30">:</span>
                            <div className="flex flex-col gap-2">
                                <input
                                    type="number"
                                    min="0"
                                    max="59"
                                    className="input input-lg input-bordered w-28 text-center text-5xl font-mono p-0 h-24 shadow-inner bg-base-100 focus:outline-secondary"
                                    placeholder="00"
                                    value={settings.manualTime % 60}
                                    onChange={(e) => handleManualTimeChange('sec', e.target.value)}
                                />
                                <span className="text-xs font-bold tracking-widest opacity-50">Seconds</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default EggControls;