import { useState, useEffect } from 'react';

interface TemporizadorProps {
  iniciado_em?: Date | string;
  status: string;
}

export function Temporizador({ iniciado_em, status }: TemporizadorProps) {
  const [tempo, setTempo] = useState<string>('');
  const [oculto, setOculto] = useState(false);

  useEffect(() => {
    if (!iniciado_em || status === 'entregue') {
      setTempo('');
      return;
    }

    const calcularTempo = () => {
      const agora = new Date();
      const inicio = new Date(iniciado_em);
      const diff = Math.floor((agora.getTime() - inicio.getTime()) / 1000); // segundos

      const horas = Math.floor(diff / 3600);
      const minutos = Math.floor((diff % 3600) / 60);
      const segundos = diff % 60;

      if (horas > 0) {
        setTempo(`${horas}h ${minutos}m`);
      } else if (minutos > 0) {
        setTempo(`${minutos}m ${segundos}s`);
      } else {
        setTempo(`${segundos}s`);
      }
    };

    calcularTempo();
    const intervalo = setInterval(calcularTempo, 1000);

    return () => clearInterval(intervalo);
  }, [iniciado_em, status]);

  if (!iniciado_em || status === 'entregue' || !tempo) {
    return null;
  }

  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        setOculto(!oculto);
      }}
      className="text-xs bg-red-500 text-white px-2 py-1 rounded font-mono hover:bg-red-600 transition ml-2"
      title={oculto ? 'Mostrar tempo' : 'Ocultar tempo'}
    >
      {oculto ? ' ---' : ` ${tempo}`}
    </button>
  );
}