// src/utils/eggLogic.js

export const calculateTime = (settings) => {
    const { size, temp, water, count, doneness } = settings;

    // 1. Pengecualian: Telur Puyuh (Quail)
    if (size === 'quail') {
        if (doneness === 'soft') return 150; // 2m 30s
        if (doneness === 'hard') return 240; // 4m
        return 200; // Medium default
    }

    // 2. Base Time (berdasarkan Doneness) - Asumsi Ayam Large
    let time = 0;
    switch (doneness) {
        case 'soft': time = 390; break;   // 6m 30s
        case 'medium': time = 510; break; // 8m 30s
        case 'hard': time = 720; break;   // 12m
        default: time = 510;
    }

    // 3. Modifier: Ukuran (Size)
    if (size === 'small_medium') time -= 30;
    if (size === 'jumbo') time += 60;

    // 4. Modifier: Suhu Awal (Temp)
    if (temp === 'room') time -= 60; // Suhu ruang lebih cepat matang

    // 5. Modifier: Jumlah Telur (Thermal Load)
    if (count >= 5 && count <= 8) time += 30;
    if (count > 8) time += 60;

    // 6. Modifier: Kondisi Air (Water Start)
    // Jika Cold Start, kita kurangi waktu rebus karena telur sudah hangat saat air dipanaskan
    if (water === 'cold') time -= 120;

    return time; // Kembalikan total detik
};