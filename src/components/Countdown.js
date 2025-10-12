"use client"
import { useState, useEffect } from 'react';

function formatearFechaIngles(fechaStr) {
  const [day, month, year] = fechaStr.split('/').map(Number);
  const fechaObj = new Date(year, month - 1, day, 0, 0, 0);

  const opciones = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC'
  };

  const fechaFormateada = new Intl.DateTimeFormat('en-US', opciones).format(fechaObj);
  return `${fechaFormateada} 00:00:00`;
}

const Countdown = ({fecha}) => {

  if(fecha === 0) return

  const fechaCurso = formatearFechaIngles(fecha);

  const [countdown, setCountdown] = useState({
    days: '00',
    hours: '00',
    minutes: '00',
    seconds: '00',
  });

  useEffect(() => {
    const countDownEndDate = fechaCurso;
    const endDate = new Date(countDownEndDate).getTime();

    const interval = setInterval(() => {
      const timeNow = new Date().getTime();
      const timeLeft = endDate - timeNow;

      if (timeLeft > 0) {
        const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
          (timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

        setCountdown({
          days: days < 10 ? `0${days}` : days.toString(),
          hours: hours < 10 ? `0${hours}` : hours.toString(),
          minutes: minutes < 10 ? `0${minutes}` : minutes.toString(),
          seconds: seconds < 10 ? `0${seconds}` : seconds.toString(),
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full text-left flex py-1 ">
      <ul className="w-full flex place-content-center gap-5 mx-auto text-gray-50">
        <li>
            <div
            className="font-bold text-white flex items-center justify-center text-base lg:text-3xl"
            id="cdD"
            >
            {countdown.days}
            </div>
            <p className="text-center text-base">Días</p>
        </li>
        <li>
            <div
            className="font-bold text-white flex items-center justify-center text-base lg:text-3xl"
            id="cdH"
            >
            {countdown.hours}
            </div>
            <p className="text-center text-base">Hrs</p>
        </li>
        <li>
            <div
            className="font-bold text-white flex items-center justify-center text-base lg:text-3xl"
            id="cdM"
            >
            {countdown.minutes}
            </div>
            <p className="text-center text-base">Mnts</p>
        </li>
        <li>
            <div
            className="font-bold text-white flex items-center justify-center text-base lg:text-3xl"
            id="cdS"
            >
            {countdown.seconds}
            </div>
            <p className="text-center text-base">Segs</p>
        </li>
      </ul>
    </div>
  )
}

export default Countdown