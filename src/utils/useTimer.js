import { useState, useEffect, useRef } from 'react';

const useTimer = (initialTime, onFinish) => {
    const [timeLeft, setTimeLeft] = useState(initialTime);
    const [isRunning, setIsRunning] = useState(false);
    const [isPaused, setIsPaused] = useState(false);

    // Ref untuk menyimpan ID interval agar bisa dibersihkan
    const timerRef = useRef(null);

    // Fungsi Memulai Timer
    const startTimer = (seconds) => {
        setTimeLeft(seconds);
        setIsRunning(true);
        setIsPaused(false);
    };

    // Fungsi Stop (Reset)
    const stopTimer = () => {
        clearInterval(timerRef.current);
        setIsRunning(false);
        setIsPaused(false);
        setTimeLeft(0);
    };

    // Fungsi Pause/Resume
    const togglePause = () => {
        setIsPaused((prev) => !prev);
    };

    // Efek Samping: Detak Jantung Timer
    useEffect(() => {
        if (isRunning && !isPaused && timeLeft > 0) {
            timerRef.current = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
        } else if (timeLeft === 0 && isRunning) {
            // Waktu Habis!
            clearInterval(timerRef.current);
            if (onFinish) onFinish(); // Panggil fungsi selesai (bunyikan alarm, dll)
        }

        // Cleanup: Matikan interval jika komponen hancur/update
        return () => clearInterval(timerRef.current);
    }, [isRunning, isPaused, timeLeft, onFinish]);

    return {
        timeLeft,
        isRunning,
        isPaused,
        startTimer,
        stopTimer,
        togglePause
    };
};

export default useTimer;