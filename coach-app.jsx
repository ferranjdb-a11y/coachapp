import React, { useState, useEffect, useMemo } from 'react';
import { Calendar, TrendingUp, Target, Dumbbell, Plus, Check, ChevronRight, ChevronLeft, X, BarChart3, Home, Edit2, Trash2 } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

// ============================================================
// DATOS DEL PLAN
// ============================================================

const PLAN = {
  intensiva: {
    label: 'Intensiva',
    workEnd: { lun: '17:30', mar: '17:30', mie: '17:30', jue: '17:30', vie: '14:00' },
    bloques: {
      lun: [
        { hora: '17:30-18:00', tipo: 'descanso', titulo: 'Casa + snack + ropa' },
        { hora: '18:00-19:00', tipo: 'gym', titulo: 'GYM 1 — Pecho + Hombro + Tríceps', sesionId: 'gym_lunes' },
        { hora: '19:30-20:45', tipo: 'descanso', titulo: 'Cena ligera pre-hockey' },
        { hora: '21:30-23:00', tipo: 'hockey', titulo: 'HOCKEY', sesionId: 'hockey' }
      ],
      mar: [
        { hora: '17:30-17:45', tipo: 'descanso', titulo: 'Salida directa al club' },
        { hora: '17:50-19:15', tipo: 'golf', titulo: 'GOLF — Juego corto', sesionId: 'golf_martes' },
        { hora: '19:45-20:45', tipo: 'descanso', titulo: 'Cena (no negociable)' },
        { hora: '21:30-23:00', tipo: 'hockey', titulo: 'HOCKEY', sesionId: 'hockey' }
      ],
      mie: [
        { hora: '17:30-18:00', tipo: 'descanso', titulo: 'Casa + snack' },
        { hora: '18:15-19:00', tipo: 'gym', titulo: 'GYM 2 — Espalda + Bíceps', sesionId: 'gym_miercoles' },
        { hora: '19:00-20:00', tipo: 'pt', titulo: 'PT — Tren inferior + Core', sesionId: 'pt' },
        { hora: '20:30-22:30', tipo: 'descanso', titulo: 'Cena recovery + dormir 22:30' }
      ],
      jue: [
        { hora: '17:30-17:45', tipo: 'descanso', titulo: 'Salida directa al club' },
        { hora: '18:00-19:15', tipo: 'golf', titulo: 'GOLF — Range técnico', sesionId: 'golf_jueves' },
        { hora: '19:45-20:30', tipo: 'descanso', titulo: 'Cena ligera pre-hockey' },
        { hora: '20:45-22:15', tipo: 'hockey', titulo: 'HOCKEY (más temprano)', sesionId: 'hockey' }
      ],
      vie: [
        { hora: '14:00-15:00', tipo: 'descanso', titulo: 'Comida en casa' },
        { hora: '15:00-15:45', tipo: 'golf', titulo: 'GOLF — Calentamiento (opcional)', sesionId: 'golf_calentamiento', opcional: true },
        { hora: '15:30-17:30', tipo: 'golf', titulo: 'GOLF — 9 hoyos', sesionId: 'golf_viernes_9' },
        { hora: '18:00+', tipo: 'descanso', titulo: 'Tarde libre / social' }
      ]
    }
  },
  noIntensiva: {
    label: 'No intensiva',
    workEnd: { lun: '17:00', mar: '17:00', mie: '17:00', jue: '17:00', vie: '18:00' },
    bloques: {
      lun: [
        { hora: '17:00-17:30', tipo: 'descanso', titulo: 'Casa + snack' },
        { hora: '17:30-18:30', tipo: 'gym', titulo: 'GYM 1 — Pecho + Hombro + Tríceps', sesionId: 'gym_lunes' },
        { hora: '20:00-20:45', tipo: 'descanso', titulo: 'Cena ligera pre-hockey' },
        { hora: '21:30-23:00', tipo: 'hockey', titulo: 'HOCKEY', sesionId: 'hockey' }
      ],
      mar: [
        { hora: '17:00-17:30', tipo: 'descanso', titulo: 'Salida directa al club' },
        { hora: '17:30-19:00', tipo: 'golf', titulo: 'GOLF — Juego corto', sesionId: 'golf_martes' },
        { hora: '19:30-20:45', tipo: 'descanso', titulo: 'Cena (no negociable)' },
        { hora: '21:30-23:00', tipo: 'hockey', titulo: 'HOCKEY', sesionId: 'hockey' }
      ],
      mie: [
        { hora: '17:00-17:30', tipo: 'descanso', titulo: 'Casa + snack' },
        { hora: '17:30-18:15', tipo: 'gym', titulo: 'GYM 2 — Espalda + Bíceps', sesionId: 'gym_miercoles' },
        { hora: '19:00-20:00', tipo: 'pt', titulo: 'PT — Tren inferior + Core', sesionId: 'pt' },
        { hora: '20:30-22:30', tipo: 'descanso', titulo: 'Cena recovery + dormir 22:30' }
      ],
      jue: [
        { hora: '17:00-17:30', tipo: 'descanso', titulo: 'Salida directa al club' },
        { hora: '17:30-18:45', tipo: 'golf', titulo: 'GOLF — Range técnico', sesionId: 'golf_jueves' },
        { hora: '19:45-20:30', tipo: 'descanso', titulo: 'Cena ligera pre-hockey' },
        { hora: '20:45-22:15', tipo: 'hockey', titulo: 'HOCKEY (más temprano)', sesionId: 'hockey' }
      ],
      vie: [
        { hora: '18:00-18:30', tipo: 'descanso', titulo: 'Casa + snack rápido' },
        { hora: '18:30-20:00', tipo: 'golf', titulo: 'GOLF — Range largo juego corto', sesionId: 'golf_viernes_corto' },
        { hora: '20:30+', tipo: 'descanso', titulo: 'Cena tranquila + libre' }
      ]
    }
  }
};

const DIAS = [
  { id: 'lun', nombre: 'Lunes', corto: 'L' },
  { id: 'mar', nombre: 'Martes', corto: 'M' },
  { id: 'mie', nombre: 'Miércoles', corto: 'X' },
  { id: 'jue', nombre: 'Jueves', corto: 'J' },
  { id: 'vie', nombre: 'Viernes', corto: 'V' }
];

const COLOR_TIPO = {
  golf: { bg: 'rgba(0, 98, 255, 0.14)', text: '#7dd3fc', border: '#0062ff', accent: '#0062ff' },
  gym: { bg: 'rgba(244, 114, 182, 0.12)', text: '#f9a8d4', border: '#ec4899', accent: '#ec4899' },
  pt: { bg: 'rgba(250, 204, 21, 0.12)', text: '#fde68a', border: '#facc15', accent: '#facc15' },
  hockey: { bg: 'rgba(56, 189, 248, 0.13)', text: '#bae6fd', border: '#38bdf8', accent: '#38bdf8' },
  descanso: { bg: 'rgba(148, 163, 184, 0.10)', text: '#cbd5e1', border: '#475569', accent: '#94a3b8' },
  custom: { bg: 'rgba(129, 140, 248, 0.14)', text: '#c4b5fd', border: '#818cf8', accent: '#818cf8' }
};

// ============================================================
// EJERCICIOS DE GYM (con detalle)
// ============================================================
const EJERCICIOS_GYM = {
  gym_lunes: {
    titulo: 'Pecho + Hombro + Tríceps',
    duracion: '60 min',
    ejercicios: [
      { id: 'press_banca', nombre: 'Press banca (barra/mancuernas)', series: 4, repsObjetivo: '8-10', principal: true, notas: '2 reps en la recámara' },
      { id: 'press_inclinado', nombre: 'Press inclinado mancuerna', series: 3, repsObjetivo: '10-12', notas: 'Banco 30°' },
      { id: 'press_militar', nombre: 'Press militar mancuerna', series: 3, repsObjetivo: '8-10', principal: true, notas: 'Foco estabilidad' },
      { id: 'elevaciones', nombre: 'Elevaciones laterales', series: 4, repsObjetivo: '12-15', notas: 'El que más cambia silueta' },
      { id: 'tricep', nombre: 'Press francés o fondos', series: 3, repsObjetivo: '10-12' },
      { id: 'pallof', nombre: 'Pallof press (anti-rotación)', series: 3, repsObjetivo: '10/lado', notas: 'Core para golf' }
    ]
  },
  gym_miercoles: {
    titulo: 'Espalda + Bíceps',
    duracion: '45 min (antes del PT)',
    ejercicios: [
      { id: 'jalon', nombre: 'Jalón al pecho', series: 4, repsObjetivo: '8-10', principal: true, notas: 'SIN peso muerto hoy' },
      { id: 'remo', nombre: 'Remo en máquina o polea baja', series: 3, repsObjetivo: '10-12', principal: true, notas: 'Sin barra libre' },
      { id: 'face_pull', nombre: 'Face pull', series: 3, repsObjetivo: '12-15', notas: 'Hombro posterior + postura' },
      { id: 'curl_z', nombre: 'Curl con barra Z o mancuernas', series: 3, repsObjetivo: '10-12' },
      { id: 'curl_martillo', nombre: 'Curl martillo', series: 3, repsObjetivo: '10-12' }
    ]
  },
  pt: {
    titulo: 'PT — Tren inferior + Core',
    duracion: '60 min',
    ejercicios: [],
    nota: 'Lo dirige tu PT. Avísale: vienes de hacer espalda+bíceps, sin peso muerto. Preferencia: fuerza submáxima 4-6 reps.'
  }
};

// ============================================================
// SESIONES DE GOLF (con drills y métricas)
// ============================================================
const SESIONES_GOLF = {
  golf_martes: {
    titulo: 'Juego corto',
    duracion: '85 min',
    bloques: [
      { id: 'pitching', nombre: '⭐ Pitching 30-50m', tiempo: '25 min',
        descripcion: '6 bolas a 30m, 40m y 50m. Vuelve a 30m con 6 más. Objetivo: dentro de 5m de la bandera.',
        metricas: [
          { id: 'pitch_30', label: 'Pitch 30m dentro 5m', tipo: 'fraccion', max: 12 },
          { id: 'pitch_40', label: 'Pitch 40m dentro 5m', tipo: 'fraccion', max: 6 },
          { id: 'pitch_50', label: 'Pitch 50m dentro 5m', tipo: 'fraccion', max: 6 }
        ]
      },
      { id: 'chipping', nombre: 'Chipping 5-20m', tiempo: '25 min',
        descripcion: '9 desde lie limpio (3 con PW/9/8), 9 desde rough corto, 6 desde lie complicado. Drill: 3 chips seguidos dentro de 1.5m.',
        metricas: [
          { id: 'chip_aciertos', label: 'Chips dentro de 1.5m', tipo: 'fraccion', max: 24 },
          { id: 'chip_seguidos', label: 'Mejor racha 3 seguidos (intentos)', tipo: 'numero' }
        ]
      },
      { id: 'putting_largo', nombre: 'Putting medio-largo 5-12m', tiempo: '15 min',
        descripcion: '12 a 5m, 9 a 8m, 6 a 12m. Foco: pasar el hoyo (regla del 17).',
        metricas: [
          { id: 'putt_5m_pasados', label: 'Putts 5m pasando hoyo', tipo: 'fraccion', max: 12 },
          { id: 'putt_8m_dentro', label: 'Putts 8m dentro de 1m', tipo: 'fraccion', max: 9 },
          { id: 'putt_12m_dentro', label: 'Putts 12m dentro de 1m', tipo: 'fraccion', max: 6 }
        ]
      },
      { id: 'putting_corto', nombre: '⭐ Putting corto 1-2m', tiempo: '15 min',
        descripcion: 'Drill puerta + reloj 6 seguidos + 3 putts presión.',
        metricas: [
          { id: 'reloj_intentos', label: 'Intentos para meter 6 seguidos (reloj)', tipo: 'numero' },
          { id: 'puerta_aciertos', label: 'Puerta: bolas limpias', tipo: 'fraccion', max: 10 },
          { id: 'presion_3', label: 'Presión 3/3 a 2m', tipo: 'siNo' }
        ]
      }
    ]
  },
  golf_jueves: {
    titulo: 'Range técnico',
    duracion: '75 min',
    bloques: [
      { id: 'tecnico', nombre: '⭐ Trabajo técnico', tiempo: '25 min',
        descripcion: 'UN solo foco técnico. 35-40 bolas con descansos. Hierro 7-8.',
        metricas: [
          { id: 'foco_tecnico', label: 'Foco técnico de hoy', tipo: 'texto' },
          { id: 'sensacion_tecnica', label: 'Sensación con el foco (1-5)', tipo: 'escala' }
        ]
      },
      { id: 'wedges_dist', nombre: 'Wedges 30-50-70-90m', tiempo: '20 min',
        descripcion: '6 bolas × 4 distancias. Sistema Pelz: longitud del backswing controla distancia.',
        metricas: [
          { id: 'w_30', label: 'Wedges 30m dentro 5m', tipo: 'fraccion', max: 6 },
          { id: 'w_50', label: 'Wedges 50m dentro 5m', tipo: 'fraccion', max: 6 },
          { id: 'w_70', label: 'Wedges 70m dentro 5m', tipo: 'fraccion', max: 6 },
          { id: 'w_90', label: 'Wedges 90m dentro 5m', tipo: 'fraccion', max: 6 }
        ]
      },
      { id: 'hierro_driver', nombre: 'Hierro 7 + Driver', tiempo: '15 min',
        descripcion: '10 hierro 7 + 10 driver. Rutina pre-tiro completa cada bola.',
        metricas: [
          { id: 'h7_buenos', label: 'Hierro 7 contactos limpios', tipo: 'fraccion', max: 10 },
          { id: 'driver_fairway', label: 'Driver bolas en fairway imaginario', tipo: 'fraccion', max: 10 }
        ]
      },
      { id: 'putt_cierre', nombre: 'Putting cierre', tiempo: '5 min',
        descripcion: 'Caídas de 2m + putts largos + putts cortos para cerrar.',
        metricas: [
          { id: 'putt_2m', label: 'Putts 2m metidos', tipo: 'fraccion', max: 10 }
        ]
      }
    ]
  },
  golf_calentamiento: {
    titulo: 'Calentamiento pre-vuelta (opcional)',
    duracion: '30-45 min',
    bloques: [
      { id: 'cal_completo', nombre: 'Calentamiento completo', tiempo: '40 min',
        descripcion: '5min movilidad → 10min wedges progresivos → 10min hierro 7 → 5min driver → 10min putting (calibrar velocidad green).',
        metricas: [
          { id: 'sensacion_cal', label: 'Sensación general (1-5)', tipo: 'escala' },
          { id: 'tiempo_cal', label: 'Tiempo real (min)', tipo: 'numero' }
        ]
      }
    ]
  },
  golf_viernes_9: {
    titulo: '9 hoyos en campo',
    duracion: '2h',
    bloques: [
      { id: 'modo', nombre: 'Modo de hoy', tiempo: '',
        descripcion: 'Modo A: vuelta de scoring (semanas pares) — driver solo en par 5/par 4 abierto. Modo B: 9 hoyos con 2 bolas desde 100m (semanas impares).',
        metricas: [
          { id: 'modo_vuelta', label: 'Modo (A scoring / B 2 bolas)', tipo: 'opciones', opciones: ['A - Scoring', 'B - 2 bolas 100m'] }
        ]
      },
      { id: 'scorecard', nombre: 'Scorecard 9 hoyos', tiempo: '',
        descripcion: 'Apunta hoyo a hoyo: par del hoyo, golpes totales, fairway (si apuntaste), GIR, número de putts.',
        scorecard: true
      },
      { id: 'resumen', nombre: 'Resumen vuelta', tiempo: '',
        descripcion: 'Métricas globales de la vuelta.',
        metricas: [
          { id: 'fairways_total', label: 'Fairways alcanzados (de los que apuntaste)', tipo: 'numero' },
          { id: 'gir_total', label: 'GIR total (greens en regulación)', tipo: 'numero' },
          { id: 'putts_total', label: 'Putts totales', tipo: 'numero' },
          { id: 'up_downs', label: 'Up & downs', tipo: 'numero' },
          { id: 'dobles_bogey', label: 'Dobles bogeys o peor', tipo: 'numero' }
        ]
      }
    ]
  },
  golf_viernes_corto: {
    titulo: 'Range largo juego corto',
    duracion: '90 min',
    bloques: [
      { id: 'bunker', nombre: '⭐ Bunker + Chip-pitch', tiempo: '30 min',
        descripcion: 'Bunker desde 3 lies (limpio, hundido, levantado). Chip-pitch desde rough/fairway/lie complicado.',
        metricas: [
          { id: 'bunker_aciertos', label: 'Salidas de bunker en green', tipo: 'fraccion', max: 15 },
          { id: 'chip_lies_aciertos', label: 'Chips dentro de 2m', tipo: 'fraccion', max: 15 }
        ]
      },
      { id: 'wedges_v', nombre: 'Wedges aproximación', tiempo: '30 min',
        descripcion: '24 bolas a 4 distancias. Drill final: 5 seguidas dentro de 5m.',
        metricas: [
          { id: 'w_30v', label: 'Wedges 30m dentro 5m', tipo: 'fraccion', max: 6 },
          { id: 'w_50v', label: 'Wedges 50m dentro 5m', tipo: 'fraccion', max: 6 },
          { id: 'w_70v', label: 'Wedges 70m dentro 5m', tipo: 'fraccion', max: 6 },
          { id: 'w_90v', label: 'Wedges 90m dentro 5m', tipo: 'fraccion', max: 6 },
          { id: 'drill_5_seg', label: 'Drill 5 seguidas: completado?', tipo: 'siNo' }
        ]
      },
      { id: 'putt_v', nombre: 'Putting con drills', tiempo: '30 min',
        descripcion: 'Puerta + Reloj 4-4-4 + Lag con escaleras + cierre.',
        metricas: [
          { id: 'puerta_v', label: 'Puerta: bolas limpias', tipo: 'fraccion', max: 20 },
          { id: 'reloj_max_dist', label: 'Reloj: distancia máxima alcanzada (m)', tipo: 'numero' },
          { id: 'lag_dorada', label: 'Lag putts en zona dorada', tipo: 'fraccion', max: 20 }
        ]
      }
    ]
  }
};

// ============================================================
// HELPERS DE STORAGE
// ============================================================
async function safeGet(key) {
  try {
    const r = await window.storage.get(key);
    return r ? JSON.parse(r.value) : null;
  } catch { return null; }
}
async function safeSet(key, value) {
  try { await window.storage.set(key, JSON.stringify(value)); return true; }
  catch { return false; }
}
async function safeList(prefix) {
  try { const r = await window.storage.list(prefix); return r ? r.keys : []; }
  catch { return []; }
}

function getISOWeek(date) {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const weekNum = Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
  return `${d.getUTCFullYear()}-W${String(weekNum).padStart(2, '0')}`;
}
function getDayId(date) {
  const dia = date.getDay();
  return ['dom', 'lun', 'mar', 'mie', 'jue', 'vie', 'sab'][dia];
}
function dateKey(date) {
  return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;
}

const MOTIVATION_PHRASES = [
  'Hoy no se negocia la versión fuerte.',
  'Una sesión precisa vale más que una sesión perfecta.',
  'Entrena con cabeza, compite con hambre.',
  'Pequeñas victorias, cuerpo grande.',
  'Haz el trabajo invisible. Se nota el día clave.',
  'Calidad, foco y una repetición más limpia.',
  'Construye ritmo. El resultado viene detrás.'
];

const appBg = {
  background:
    'radial-gradient(circle at top left, rgba(0, 98, 255, 0.22), transparent 30%), radial-gradient(circle at 80% 0%, rgba(56, 189, 248, 0.10), transparent 28%), #020617'
};

const overlayBg = {
  background:
    'radial-gradient(circle at top, rgba(0, 98, 255, 0.18), transparent 32%), #020617'
};

const cardStyle = {
  background: 'linear-gradient(180deg, rgba(15, 23, 42, 0.94), rgba(2, 6, 23, 0.92))',
  boxShadow: '0 20px 55px rgba(0, 0, 0, 0.38)'
};

const inputClass = 'bg-slate-950/80 border border-white/10 rounded-xl text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/60 focus:border-blue-400';
const primaryButtonClass = 'rounded-2xl bg-blue-600 text-white text-sm font-semibold shadow-[0_14px_35px_rgba(0,98,255,0.35)] hover:bg-blue-500 active:scale-[0.99] transition';
const secondaryButtonClass = 'rounded-2xl border border-white/10 bg-white/[0.04] text-sm font-medium text-slate-200 hover:bg-white/[0.08] transition';
const iconButtonClass = 'p-2 rounded-2xl border border-white/10 bg-white/[0.04] text-slate-200 hover:bg-white/[0.08] transition';
const sectionLabelClass = 'text-[11px] text-slate-500 uppercase mb-3 font-bold tracking-[0.16em]';

function getMotivation(fecha) {
  const seed = fecha.getFullYear() + fecha.getMonth() + fecha.getDate();
  return MOTIVATION_PHRASES[seed % MOTIVATION_PHRASES.length];
}

// ============================================================
// COMPONENTES UI
// ============================================================

function Badge({ tipo, children }) {
  const c = COLOR_TIPO[tipo] || COLOR_TIPO.descanso;
  return (
    <span style={{
      backgroundColor: c.bg, color: c.text, border: `1px solid ${c.border}66`, padding: '4px 10px',
      borderRadius: 999, fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em'
    }}>{children}</span>
  );
}

function MetricInput({ metrica, valor, onChange }) {
  if (metrica.tipo === 'fraccion') {
    return (
      <div className="flex items-center gap-2">
        <input
          type="number" min="0" max={metrica.max}
          value={valor ?? ''}
          onChange={e => onChange(e.target.value === '' ? null : Number(e.target.value))}
          className={`w-20 px-3 py-2 ${inputClass}`}
          placeholder="0"
        />
        <span className="text-sm text-slate-500 font-medium">/ {metrica.max}</span>
      </div>
    );
  }
  if (metrica.tipo === 'numero') {
    return (
      <input
        type="number" value={valor ?? ''}
        onChange={e => onChange(e.target.value === '' ? null : Number(e.target.value))}
        className={`w-24 px-3 py-2 ${inputClass}`}
      />
    );
  }
  if (metrica.tipo === 'escala') {
    return (
      <div className="flex gap-1">
        {[1,2,3,4,5].map(n => (
          <button key={n}
            onClick={() => onChange(n)}
            className={`w-10 h-10 rounded-2xl text-sm font-bold transition ${valor === n ? 'bg-blue-600 text-white shadow-[0_10px_28px_rgba(0,98,255,0.35)]' : 'bg-white/[0.06] text-slate-400 hover:bg-white/[0.10]'}`}
          >{n}</button>
        ))}
      </div>
    );
  }
  if (metrica.tipo === 'siNo') {
    return (
      <div className="flex gap-2">
        <button onClick={() => onChange(true)}
          className={`px-4 py-2 rounded-2xl text-sm font-semibold transition ${valor === true ? 'bg-blue-600 text-white shadow-[0_10px_28px_rgba(0,98,255,0.35)]' : 'bg-white/[0.06] text-slate-300 hover:bg-white/[0.10]'}`}>
          Sí</button>
        <button onClick={() => onChange(false)}
          className={`px-4 py-2 rounded-2xl text-sm font-semibold transition ${valor === false ? 'bg-rose-500 text-white shadow-[0_10px_28px_rgba(244,63,94,0.28)]' : 'bg-white/[0.06] text-slate-300 hover:bg-white/[0.10]'}`}>
          No</button>
      </div>
    );
  }
  if (metrica.tipo === 'opciones') {
    return (
      <div className="flex gap-2 flex-wrap">
        {metrica.opciones.map(op => (
          <button key={op} onClick={() => onChange(op)}
            className={`px-4 py-2 rounded-2xl text-sm font-semibold transition ${valor === op ? 'bg-blue-600 text-white shadow-[0_10px_28px_rgba(0,98,255,0.35)]' : 'bg-white/[0.06] text-slate-300 hover:bg-white/[0.10]'}`}>
            {op}</button>
        ))}
      </div>
    );
  }
  if (metrica.tipo === 'texto') {
    return (
      <input type="text" value={valor ?? ''}
        onChange={e => onChange(e.target.value)}
        className={`px-3 py-2 w-full ${inputClass}`}
        placeholder="ej: transferencia de peso"
      />
    );
  }
  return null;
}

// ============================================================
// PANTALLA: TRACKER GOLF
// ============================================================
function TrackerGolf({ sesionId, fecha, onClose, onSaved }) {
  const sesion = SESIONES_GOLF[sesionId];
  const [datos, setDatos] = useState({});
  const [scorecard, setScorecard] = useState(Array.from({length: 9}, () => ({ par: 4, golpes: '', fairway: null, gir: null, putts: '' })));
  const [notas, setNotas] = useState('');
  const [cargado, setCargado] = useState(false);

  const storageKey = `sesion_golf:${dateKey(fecha)}:${sesionId}`;

  useEffect(() => {
    (async () => {
      const guardado = await safeGet(storageKey);
      if (guardado) {
        setDatos(guardado.datos || {});
        if (guardado.scorecard) setScorecard(guardado.scorecard);
        setNotas(guardado.notas || '');
      }
      setCargado(true);
    })();
  }, [storageKey]);

  if (!sesion) return null;

  const updateMetrica = (id, valor) => {
    setDatos(prev => ({ ...prev, [id]: valor }));
  };

  const guardar = async () => {
    await safeSet(storageKey, { datos, scorecard, notas, fecha: dateKey(fecha), sesionId });
    onSaved && onSaved();
    onClose();
  };

  if (!cargado) return <div className="min-h-screen p-6 text-slate-300" style={overlayBg}>Cargando…</div>;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto text-slate-100" style={overlayBg}>
      <div className="sticky top-0 bg-slate-950/88 backdrop-blur-xl border-b border-white/10 px-4 py-4 flex items-center justify-between z-10">
        <div>
          <div className="text-[11px] text-blue-300 uppercase font-bold tracking-[0.16em]">{fecha.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'short' })}</div>
          <h2 className="text-xl font-black text-white mt-1">⛳ {sesion.titulo}</h2>
        </div>
        <button onClick={onClose} className={iconButtonClass}><X size={20} /></button>
      </div>

      <div className="p-4 max-w-2xl mx-auto pb-32">
        <div className="text-sm text-slate-400 mb-4 font-medium">{sesion.duracion}</div>

        {sesion.bloques.map(bloque => (
          <div key={bloque.id} className="mb-5 rounded-3xl p-4 border border-white/10" style={cardStyle}>
            <div className="flex items-baseline justify-between mb-1">
              <h3 className="font-bold text-white">{bloque.nombre}</h3>
              {bloque.tiempo && <span className="text-xs text-blue-300 font-bold">{bloque.tiempo}</span>}
            </div>
            <p className="text-sm text-slate-400 mb-4 leading-relaxed">{bloque.descripcion}</p>

            {bloque.scorecard && (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-xs text-slate-500">
                      <th className="text-left py-1">Hoyo</th>
                      <th className="px-1">Par</th>
                      <th className="px-1">Golpes</th>
                      <th className="px-1">FW</th>
                      <th className="px-1">GIR</th>
                      <th className="px-1">Putts</th>
                    </tr>
                  </thead>
                  <tbody>
                    {scorecard.map((row, i) => (
                      <tr key={i} className="border-t border-white/10">
                        <td className="py-2 font-bold text-slate-200">{i+1}</td>
                        <td className="px-1">
                          <select value={row.par}
                            onChange={e => setScorecard(s => s.map((r,j) => j===i ? {...r, par: Number(e.target.value)} : r))}
                            className={`w-14 px-2 py-1 ${inputClass}`}>
                            <option value={3}>3</option><option value={4}>4</option><option value={5}>5</option>
                          </select>
                        </td>
                        <td className="px-1">
                          <input type="number" value={row.golpes}
                            onChange={e => setScorecard(s => s.map((r,j) => j===i ? {...r, golpes: e.target.value} : r))}
                            className={`w-14 px-2 py-1 ${inputClass}`} />
                        </td>
                        <td className="px-1 text-center">
                          <button
                            onClick={() => setScorecard(s => s.map((r,j) => j===i ? {...r, fairway: r.fairway === true ? null : true} : r))}
                            className={`w-8 h-8 rounded-xl text-xs font-bold transition ${row.fairway === true ? 'bg-blue-600 text-white shadow-[0_10px_28px_rgba(0,98,255,0.35)]' : 'bg-white/[0.06] text-slate-500'}`}>✓</button>
                        </td>
                        <td className="px-1 text-center">
                          <button
                            onClick={() => setScorecard(s => s.map((r,j) => j===i ? {...r, gir: r.gir === true ? null : true} : r))}
                            className={`w-8 h-8 rounded-xl text-xs font-bold transition ${row.gir === true ? 'bg-blue-600 text-white shadow-[0_10px_28px_rgba(0,98,255,0.35)]' : 'bg-white/[0.06] text-slate-500'}`}>✓</button>
                        </td>
                        <td className="px-1">
                          <input type="number" value={row.putts}
                            onChange={e => setScorecard(s => s.map((r,j) => j===i ? {...r, putts: e.target.value} : r))}
                            className={`w-14 px-2 py-1 ${inputClass}`} />
                        </td>
                      </tr>
                    ))}
                    <tr className="border-t-2 border-blue-500/40 font-bold text-slate-100">
                      <td colSpan={2} className="py-2">Total</td>
                      <td className="px-1">{scorecard.reduce((a,r)=>a+(Number(r.golpes)||0),0)}</td>
                      <td className="px-1 text-center">{scorecard.filter(r => r.fairway).length}</td>
                      <td className="px-1 text-center">{scorecard.filter(r => r.gir).length}</td>
                      <td className="px-1">{scorecard.reduce((a,r)=>a+(Number(r.putts)||0),0)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}

            {bloque.metricas && bloque.metricas.map(m => (
              <div key={m.id} className="mb-3 last:mb-0">
                <label className="text-sm text-slate-300 block mb-2 font-medium">{m.label}</label>
                <MetricInput metrica={m} valor={datos[m.id]} onChange={v => updateMetrica(m.id, v)} />
              </div>
            ))}
          </div>
        ))}

        <div className="mb-4">
          <label className="text-sm text-slate-300 block mb-2 font-semibold">Notas / sensaciones</label>
          <textarea value={notas} onChange={e => setNotas(e.target.value)}
            className={`w-full px-4 py-3 ${inputClass}`} rows={3}
            placeholder="Cómo te has encontrado, qué has aprendido, qué probarías la próxima vez…" />
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-slate-950/90 backdrop-blur-xl border-t border-white/10 p-3 flex gap-2 max-w-2xl mx-auto">
        <button onClick={onClose} className={`flex-1 px-4 py-3 ${secondaryButtonClass}`}>Cancelar</button>
        <button onClick={guardar} className={`flex-1 px-4 py-3 ${primaryButtonClass}`}>Guardar sesión</button>
      </div>
    </div>
  );
}

// ============================================================
// PANTALLA: TRACKER GYM
// ============================================================
function TrackerGym({ sesionId, fecha, onClose }) {
  const sesion = EJERCICIOS_GYM[sesionId];
  const [series, setSeries] = useState({});
  const [ultimoData, setUltimoData] = useState({});
  const [notas, setNotas] = useState('');
  const [cargado, setCargado] = useState(false);
  const storageKey = `sesion_gym:${dateKey(fecha)}:${sesionId}`;

  useEffect(() => {
    (async () => {
      const guardado = await safeGet(storageKey);
      if (guardado) {
        setSeries(guardado.series || {});
        setNotas(guardado.notas || '');
      }
      // Buscar última sesión del mismo tipo para mostrar referencia
      const keys = await safeList(`sesion_gym:`);
      const previas = keys
        .filter(k => k.includes(`:${sesionId}`) && !k.includes(dateKey(fecha)))
        .sort()
        .reverse();
      if (previas.length > 0) {
        const ultima = await safeGet(previas[0]);
        if (ultima) setUltimoData(ultima.series || {});
      }
      setCargado(true);
    })();
  }, [storageKey, sesionId]);

  if (!sesion) return null;

  const updateSerie = (ejId, idx, campo, valor) => {
    setSeries(prev => {
      const ejSeries = prev[ejId] || [];
      const nuevas = [...ejSeries];
      nuevas[idx] = { ...nuevas[idx], [campo]: valor };
      return { ...prev, [ejId]: nuevas };
    });
  };

  const guardar = async () => {
    await safeSet(storageKey, { series, notas, fecha: dateKey(fecha), sesionId });
    onClose();
  };

  if (!cargado) return <div className="min-h-screen p-6 text-slate-300" style={overlayBg}>Cargando…</div>;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto text-slate-100" style={overlayBg}>
      <div className="sticky top-0 bg-slate-950/88 backdrop-blur-xl border-b border-white/10 px-4 py-4 flex items-center justify-between z-10">
        <div>
          <div className="text-[11px] text-blue-300 uppercase font-bold tracking-[0.16em]">{fecha.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'short' })}</div>
          <h2 className="text-xl font-black text-white mt-1">💪 {sesion.titulo}</h2>
        </div>
        <button onClick={onClose} className={iconButtonClass}><X size={20} /></button>
      </div>

      <div className="p-4 max-w-2xl mx-auto pb-32">
        <div className="text-sm text-slate-400 mb-4 font-medium">{sesion.duracion}</div>

        {sesion.nota && (
          <div className="bg-amber-500/10 border border-amber-300/20 rounded-2xl p-3 mb-4 text-sm text-amber-100">
            {sesion.nota}
          </div>
        )}

        {sesion.ejercicios.map(ej => {
          const ultimoEj = ultimoData[ej.id];
          const ultimaSerieReal = ultimoEj ? ultimoEj.find(s => s && s.peso) : null;
          return (
            <div key={ej.id} className="mb-4 rounded-3xl p-4 border border-white/10" style={cardStyle}>
              <div className="flex items-baseline justify-between mb-1">
                <h3 className="font-bold text-white">{ej.nombre}</h3>
                {ej.principal && <span className="text-[10px] bg-blue-500/15 text-blue-200 border border-blue-400/30 px-2 py-1 rounded-full font-bold uppercase tracking-[0.08em]">⭐ principal</span>}
              </div>
              <div className="text-xs text-slate-500 mb-3">
                {ej.series} series × {ej.repsObjetivo} reps
                {ej.notas && <span> · {ej.notas}</span>}
              </div>
              {ultimaSerieReal && (
                <div className="text-xs text-blue-300 mb-3 font-medium">
                  📊 Última vez: {ultimaSerieReal.peso}kg × {ultimaSerieReal.reps} reps
                </div>
              )}
              <div className="space-y-2">
                {Array.from({length: ej.series}).map((_, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span className="text-xs text-slate-500 w-12 font-bold">Serie {idx+1}</span>
                    <input type="number" placeholder="kg" step="0.5"
                      value={(series[ej.id]?.[idx]?.peso) ?? ''}
                      onChange={e => updateSerie(ej.id, idx, 'peso', e.target.value)}
                      className={`w-20 px-3 py-2 ${inputClass}`} />
                    <span className="text-xs text-slate-500">×</span>
                    <input type="number" placeholder="reps"
                      value={(series[ej.id]?.[idx]?.reps) ?? ''}
                      onChange={e => updateSerie(ej.id, idx, 'reps', e.target.value)}
                      className={`w-20 px-3 py-2 ${inputClass}`} />
                    <span className="text-xs text-slate-500 font-bold">RIR</span>
                    <input type="number" placeholder="2" min="0" max="5"
                      value={(series[ej.id]?.[idx]?.rir) ?? ''}
                      onChange={e => updateSerie(ej.id, idx, 'rir', e.target.value)}
                      className={`w-14 px-3 py-2 ${inputClass}`} />
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        {sesion.ejercicios.length === 0 && (
          <div className="rounded-3xl p-4 border border-white/10 mb-4" style={cardStyle}>
            <p className="text-sm text-slate-400 mb-3">Sesión libre con tu PT. Apunta lo que hayas hecho:</p>
            <textarea value={notas} onChange={e => setNotas(e.target.value)}
              className={`w-full px-4 py-3 ${inputClass}`} rows={6}
              placeholder="Ejercicios, series, peso, sensaciones…" />
          </div>
        )}

        {sesion.ejercicios.length > 0 && (
          <div className="mb-4">
            <label className="text-sm text-slate-300 block mb-2 font-semibold">Notas</label>
            <textarea value={notas} onChange={e => setNotas(e.target.value)}
              className={`w-full px-4 py-3 ${inputClass}`} rows={3}
              placeholder="Cómo te has encontrado, qué progresar la próxima vez…" />
          </div>
        )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-slate-950/90 backdrop-blur-xl border-t border-white/10 p-3 flex gap-2 max-w-2xl mx-auto">
        <button onClick={onClose} className={`flex-1 px-4 py-3 ${secondaryButtonClass}`}>Cancelar</button>
        <button onClick={guardar} className={`flex-1 px-4 py-3 ${primaryButtonClass}`}>Guardar sesión</button>
      </div>
    </div>
  );
}

// ============================================================
// PANTALLA: TRACKER HOCKEY
// ============================================================
function TrackerHockey({ fecha, onClose }) {
  const [datos, setDatos] = useState({ asistido: null, sensacion: null, notas: '' });
  const [cargado, setCargado] = useState(false);
  const storageKey = `sesion_hockey:${dateKey(fecha)}`;

  useEffect(() => {
    (async () => {
      const g = await safeGet(storageKey);
      if (g) setDatos(g);
      setCargado(true);
    })();
  }, [storageKey]);

  const guardar = async () => {
    await safeSet(storageKey, datos);
    onClose();
  };

  if (!cargado) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto text-slate-100" style={overlayBg}>
      <div className="sticky top-0 bg-slate-950/88 backdrop-blur-xl border-b border-white/10 px-4 py-4 flex items-center justify-between z-10">
        <div>
          <div className="text-[11px] text-blue-300 uppercase font-bold tracking-[0.16em]">{fecha.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'short' })}</div>
          <h2 className="text-xl font-black text-white mt-1">🏑 Hockey</h2>
        </div>
        <button onClick={onClose} className={iconButtonClass}><X size={20} /></button>
      </div>

      <div className="p-4 max-w-2xl mx-auto">
        <div className="mb-5 rounded-3xl p-4 border border-white/10" style={cardStyle}>
          <label className="text-sm font-semibold text-slate-300 block mb-3">¿Asististe?</label>
          <div className="flex gap-2">
            <button onClick={() => setDatos(d => ({ ...d, asistido: true }))}
              className={`flex-1 px-4 py-3 rounded-2xl text-sm font-semibold transition ${datos.asistido === true ? 'bg-blue-600 text-white shadow-[0_10px_28px_rgba(0,98,255,0.35)]' : 'bg-white/[0.06] text-slate-300 hover:bg-white/[0.10]'}`}>Sí</button>
            <button onClick={() => setDatos(d => ({ ...d, asistido: false }))}
              className={`flex-1 px-4 py-3 rounded-2xl text-sm font-semibold transition ${datos.asistido === false ? 'bg-rose-500 text-white shadow-[0_10px_28px_rgba(244,63,94,0.28)]' : 'bg-white/[0.06] text-slate-300 hover:bg-white/[0.10]'}`}>No</button>
          </div>
        </div>
        <div className="mb-5 rounded-3xl p-4 border border-white/10" style={cardStyle}>
          <label className="text-sm font-semibold text-slate-300 block mb-3">Cómo te encontraste (1-5)</label>
          <div className="flex gap-1">
            {[1,2,3,4,5].map(n => (
              <button key={n} onClick={() => setDatos(d => ({ ...d, sensacion: n }))}
                className={`flex-1 h-12 rounded-2xl font-bold transition ${datos.sensacion === n ? 'bg-blue-600 text-white shadow-[0_10px_28px_rgba(0,98,255,0.35)]' : 'bg-white/[0.06] text-slate-400 hover:bg-white/[0.10]'}`}>{n}</button>
            ))}
          </div>
          <div className="text-xs text-slate-500 mt-2">1 = reventado · 5 = en plenitud</div>
        </div>
        <div className="mb-4">
          <label className="text-sm font-semibold text-slate-300 block mb-2">Notas</label>
          <textarea value={datos.notas} onChange={e => setDatos(d => ({ ...d, notas: e.target.value }))}
            className={`w-full px-4 py-3 ${inputClass}`} rows={3} />
        </div>

        <div className="flex gap-2 mt-6">
          <button onClick={onClose} className={`flex-1 px-4 py-3 ${secondaryButtonClass}`}>Cancelar</button>
          <button onClick={guardar} className={`flex-1 px-4 py-3 ${primaryButtonClass}`}>Guardar</button>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// PANTALLA: HOY
// ============================================================
function PantallaHoy({ semana, fecha, setFecha, onAbrirTracker }) {
  const diaId = getDayId(fecha);
  const planSemana = PLAN[semana];
  const bloques = (diaId === 'sab' || diaId === 'dom') ? [] : (planSemana.bloques[diaId] || []);
  const [tareasExtra, setTareasExtra] = useState([]);
  const [nuevaTarea, setNuevaTarea] = useState('');
  const [horaNueva, setHoraNueva] = useState('');
  const [sesionesGuardadas, setSesionesGuardadas] = useState({});

  const fechaKey = dateKey(fecha);

  useEffect(() => {
    (async () => {
      const t = await safeGet(`tareas:${fechaKey}`);
      setTareasExtra(t || []);
      // Comprobar qué sesiones ya están guardadas
      const guardadas = {};
      for (const b of bloques) {
        if (b.sesionId) {
          const tipo = b.tipo === 'gym' || b.tipo === 'pt' ? 'gym' : (b.tipo === 'hockey' ? 'hockey' : 'golf');
          const key = b.tipo === 'hockey'
            ? `sesion_hockey:${fechaKey}`
            : `sesion_${tipo}:${fechaKey}:${b.sesionId}`;
          const r = await safeGet(key);
          if (r) guardadas[b.sesionId + b.hora] = true;
        }
      }
      setSesionesGuardadas(guardadas);
    })();
  }, [fechaKey, semana]);

  const cambiarDia = (delta) => {
    const nueva = new Date(fecha);
    nueva.setDate(nueva.getDate() + delta);
    setFecha(nueva);
  };

  const addTarea = async () => {
    if (!nuevaTarea.trim()) return;
    const t = [...tareasExtra, { id: Date.now(), hora: horaNueva, texto: nuevaTarea, hecho: false }];
    setTareasExtra(t);
    await safeSet(`tareas:${fechaKey}`, t);
    setNuevaTarea(''); setHoraNueva('');
  };

  const toggleTarea = async (id) => {
    const t = tareasExtra.map(x => x.id === id ? { ...x, hecho: !x.hecho } : x);
    setTareasExtra(t);
    await safeSet(`tareas:${fechaKey}`, t);
  };

  const borrarTarea = async (id) => {
    const t = tareasExtra.filter(x => x.id !== id);
    setTareasExtra(t);
    await safeSet(`tareas:${fechaKey}`, t);
  };

  const esHoy = dateKey(new Date()) === fechaKey;
  const motivacion = getMotivation(fecha);

  // huecos libres para mostrar al usuario
  const horasLibres = useMemo(() => {
    if (diaId === 'sab' || diaId === 'dom') return [];
    const workEnd = planSemana.workEnd[diaId];
    const ultimoBloque = bloques[bloques.length - 1];
    const slots = [];
    if (workEnd) slots.push(`Hasta ${workEnd}: trabajo`);
    return slots;
  }, [diaId, semana, bloques]);

  return (
    <div className="pb-24 text-slate-100">
      {/* Header navegación día */}
      <div className="flex items-center justify-between px-4 py-4 bg-slate-950/70 backdrop-blur-xl border-b border-white/10">
        <button onClick={() => cambiarDia(-1)} className={iconButtonClass}><ChevronLeft size={20} /></button>
        <div className="text-center">
          <div className="text-[11px] text-blue-300 uppercase font-bold tracking-[0.16em]">{esHoy && 'Hoy · '}{fecha.toLocaleDateString('es-ES', { weekday: 'long' })}</div>
          <div className="font-black text-white">{fecha.toLocaleDateString('es-ES', { day: 'numeric', month: 'long' })}</div>
        </div>
        <button onClick={() => cambiarDia(1)} className={iconButtonClass}><ChevronRight size={20} /></button>
      </div>

      <div className="px-4 pt-5">
        <div className="rounded-[28px] border border-blue-400/20 p-5" style={{
          background: 'linear-gradient(135deg, rgba(0, 98, 255, 0.24), rgba(15, 23, 42, 0.96) 48%, rgba(2, 6, 23, 0.98))',
          boxShadow: '0 22px 60px rgba(0, 0, 0, 0.42), inset 0 1px 0 rgba(255, 255, 255, 0.08)'
        }}>
          <div className="text-[11px] text-blue-200 uppercase font-bold tracking-[0.18em]">Plan de hoy</div>
          <h2 className="text-3xl font-black text-white mt-2 leading-tight">Buenos días, Ferran</h2>
          <p className="text-sm text-slate-300 mt-2 leading-relaxed">{motivacion}</p>
        </div>
      </div>

      {(diaId === 'sab' || diaId === 'dom') ? (
        <div className="p-8 text-center text-slate-400">
          <div className="text-4xl mb-2">🌴</div>
          <div className="font-bold text-white">Fin de semana libre</div>
          <div className="text-sm mt-1 text-slate-500">Descansa, juega golf si quieres bonus, pasa tiempo con la gente.</div>
        </div>
      ) : (
        <div className="p-4">
          {bloques.length > 0 && (
            <div className={sectionLabelClass}>Bloques del día</div>
          )}
          {bloques.map((b, i) => {
            const c = COLOR_TIPO[b.tipo];
            const completado = sesionesGuardadas[b.sesionId + b.hora];
            const tieneTracker = b.sesionId && (b.tipo === 'golf' || b.tipo === 'gym' || b.tipo === 'hockey' || b.tipo === 'pt');
            return (
              <div key={i}
                onClick={() => tieneTracker && onAbrirTracker(b)}
                className={`mb-3 p-4 rounded-3xl border ${tieneTracker ? 'cursor-pointer hover:-translate-y-0.5 hover:border-blue-400/40' : ''} transition`}
                style={{ backgroundColor: c.bg, borderColor: c.border + '66', boxShadow: '0 16px 40px rgba(0,0,0,0.22)' }}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="text-xs font-black uppercase tracking-[0.12em]" style={{ color: c.text }}>{b.hora}</div>
                    <div className="font-bold mt-1 text-white">
                      {completado && '✅ '}{b.titulo}
                    </div>
                  </div>
                  {tieneTracker && (
                    <ChevronRight size={18} style={{ color: c.text, opacity: 0.5 }} />
                  )}
                </div>
              </div>
            );
          })}

          {/* Tareas extra */}
          <div className="mt-6">
            <div className={sectionLabelClass}>Tareas / recados libres</div>
            {tareasExtra.map(t => (
              <div key={t.id} className="mb-2 p-3 rounded-2xl border border-white/10 bg-white/[0.04] flex items-center gap-3">
                <button onClick={() => toggleTarea(t.id)}
                  className={`w-6 h-6 rounded-xl border ${t.hecho ? 'bg-blue-600 border-blue-500' : 'border-white/15 bg-white/[0.03]'} flex items-center justify-center transition`}>
                  {t.hecho && <Check size={14} className="text-white" />}
                </button>
                <div className="flex-1">
                  {t.hora && <span className="text-xs text-blue-300 mr-2 font-bold">{t.hora}</span>}
                  <span className={`text-sm ${t.hecho ? 'line-through text-slate-500' : 'text-slate-200'}`}>{t.texto}</span>
                </div>
                <button onClick={() => borrarTarea(t.id)} className="text-slate-500 hover:text-rose-400 transition">
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
            <div className="flex gap-2 mt-2">
              <input type="time" value={horaNueva} onChange={e => setHoraNueva(e.target.value)}
                className={`px-3 py-2 w-28 ${inputClass}`} />
              <input type="text" value={nuevaTarea} onChange={e => setNuevaTarea(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addTarea()}
                placeholder="Añadir tarea/recado…"
                className={`flex-1 px-3 py-2 ${inputClass}`} />
              <button onClick={addTarea} className={`px-4 py-2 ${primaryButtonClass}`}>
                <Plus size={16} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================
// PANTALLA: SEMANA
// ============================================================
function PantallaSemana({ semana, fecha, setFecha, onAbrirTracker }) {
  const planSemana = PLAN[semana];
  const inicioSemana = useMemo(() => {
    const d = new Date(fecha);
    const dia = d.getDay();
    const diff = dia === 0 ? -6 : 1 - dia;
    d.setDate(d.getDate() + diff);
    return d;
  }, [fecha]);

  const dias = DIAS.map((dia, i) => {
    const d = new Date(inicioSemana);
    d.setDate(d.getDate() + i);
    return { ...dia, fecha: d, bloques: planSemana.bloques[dia.id] || [] };
  });

  return (
    <div className="p-4 pb-24 text-slate-100">
      <div className={sectionLabelClass}>
        Semana del {inicioSemana.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}
      </div>
      {dias.map(d => (
        <div key={d.id} className="mb-4 rounded-3xl border border-white/10 p-4" style={cardStyle}>
          <div className="flex items-center gap-2 mb-3">
            <button
              onClick={() => setFecha(d.fecha)}
              className="text-sm font-black text-white hover:text-blue-300 transition">
              {d.nombre} {d.fecha.getDate()}
            </button>
          </div>
          <div className="space-y-1">
            {d.bloques.filter(b => b.tipo !== 'descanso').map((b, i) => {
              const c = COLOR_TIPO[b.tipo];
              return (
                <div key={i}
                  onClick={() => { setFecha(d.fecha); onAbrirTracker(b); }}
                  className="flex items-center gap-3 p-3 rounded-2xl text-sm cursor-pointer hover:bg-white/[0.06] transition">
                  <span className="text-xs text-slate-500 w-24 font-bold">{b.hora}</span>
                  <Badge tipo={b.tipo}>{b.tipo}</Badge>
                  <span className="text-slate-200 flex-1 font-medium">{b.titulo}</span>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

// ============================================================
// PANTALLA: PROGRESO (DASHBOARD)
// ============================================================
function PantallaProgreso() {
  const [datos, setDatos] = useState({ golf: [], gym: [], hockey: [] });
  const [cargado, setCargado] = useState(false);

  useEffect(() => {
    (async () => {
      const golfKeys = await safeList('sesion_golf:');
      const gymKeys = await safeList('sesion_gym:');
      const hockeyKeys = await safeList('sesion_hockey:');

      const golf = (await Promise.all(golfKeys.map(k => safeGet(k)))).filter(Boolean);
      const gym = (await Promise.all(gymKeys.map(k => safeGet(k)))).filter(Boolean);
      const hockey = (await Promise.all(hockeyKeys.map(k => safeGet(k)))).filter(Boolean);

      setDatos({ golf, gym, hockey });
      setCargado(true);
    })();
  }, []);

  if (!cargado) return <div className="min-h-screen p-6 text-slate-300" style={appBg}>Cargando progreso…</div>;

  const totalSesiones = datos.golf.length + datos.gym.length + datos.hockey.length;

  // Datos para gráfica de wedges 50m
  const wedges50 = datos.golf
    .filter(s => (s.datos?.w_50 != null) || (s.datos?.w_50v != null))
    .sort((a, b) => a.fecha.localeCompare(b.fecha))
    .map(s => ({
      fecha: s.fecha.slice(5),
      acertados: s.datos.w_50 ?? s.datos.w_50v
    }));

  // Datos para gráfica de press banca
  const pressBanca = datos.gym
    .filter(s => s.sesionId === 'gym_lunes' && s.series?.press_banca)
    .sort((a, b) => a.fecha.localeCompare(b.fecha))
    .map(s => {
      const series = s.series.press_banca.filter(x => x?.peso);
      const maxPeso = Math.max(...series.map(x => Number(x.peso) || 0), 0);
      return { fecha: s.fecha.slice(5), peso: maxPeso };
    });

  // Datos scoring 9 hoyos
  const scoring9 = datos.golf
    .filter(s => s.sesionId === 'golf_viernes_9' && s.scorecard)
    .sort((a, b) => a.fecha.localeCompare(b.fecha))
    .map(s => ({
      fecha: s.fecha.slice(5),
      golpes: s.scorecard.reduce((a, r) => a + (Number(r.golpes) || 0), 0),
      putts: s.scorecard.reduce((a, r) => a + (Number(r.putts) || 0), 0)
    }));

  // Driver fairways
  const driverFW = datos.golf
    .filter(s => s.datos?.driver_fairway != null)
    .sort((a, b) => a.fecha.localeCompare(b.fecha))
    .map(s => ({ fecha: s.fecha.slice(5), fairways: s.datos.driver_fairway }));

  // Hockey asistencia última semana
  const hockey7d = datos.hockey
    .filter(s => {
      const f = new Date(s.fecha || datos.hockey.indexOf(s));
      const diff = (Date.now() - f.getTime()) / (1000 * 60 * 60 * 24);
      return diff <= 7;
    });

  return (
    <div className="p-4 pb-24 text-slate-100">
      <div className="mb-5">
        <div className={sectionLabelClass}>Dashboard</div>
        <h2 className="text-3xl font-black text-white">Progreso</h2>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="p-4 rounded-3xl border border-blue-400/20 bg-blue-500/10">
          <div className="text-[10px] text-blue-200 uppercase font-bold tracking-[0.14em]">Sesiones golf</div>
          <div className="text-3xl font-black text-white mt-1">{datos.golf.length}</div>
        </div>
        <div className="p-4 rounded-3xl border border-pink-400/20 bg-pink-500/10">
          <div className="text-[10px] text-pink-200 uppercase font-bold tracking-[0.14em]">Sesiones gym</div>
          <div className="text-3xl font-black text-white mt-1">{datos.gym.length}</div>
        </div>
        <div className="p-4 rounded-3xl border border-cyan-400/20 bg-cyan-500/10">
          <div className="text-[10px] text-cyan-200 uppercase font-bold tracking-[0.14em]">Hockey</div>
          <div className="text-3xl font-black text-white mt-1">{datos.hockey.length}</div>
        </div>
        <div className="p-4 rounded-3xl border border-white/10 bg-white/[0.05]">
          <div className="text-[10px] text-slate-400 uppercase font-bold tracking-[0.14em]">Total registros</div>
          <div className="text-3xl font-black text-white mt-1">{totalSesiones}</div>
        </div>
      </div>

      {totalSesiones === 0 && (
        <div className="bg-amber-500/10 border border-amber-300/20 rounded-3xl p-4 text-sm text-amber-100 mb-4">
          📊 Aún no has registrado sesiones. Empieza a entrenar y aparecerán aquí las gráficas de progreso.
        </div>
      )}

      {wedges50.length > 0 && (
        <div className="mb-6">
          <h3 className="font-bold mb-2 text-sm text-white">⛳ Wedges 50m (acertados dentro de 5m)</h3>
          <div className="border border-white/10 rounded-3xl p-3" style={{ ...cardStyle, height: 220 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={wedges50}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.16)" />
                <XAxis dataKey="fecha" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 6]} tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: '#020617', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 16, color: '#e2e8f0' }} />
                <Line type="monotone" dataKey="acertados" stroke="#0062ff" strokeWidth={3} dot={{ r: 4, fill: '#38bdf8' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {pressBanca.length > 0 && (
        <div className="mb-6">
          <h3 className="font-bold mb-2 text-sm text-white">💪 Press banca (peso máximo por sesión)</h3>
          <div className="border border-white/10 rounded-3xl p-3" style={{ ...cardStyle, height: 220 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={pressBanca}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.16)" />
                <XAxis dataKey="fecha" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: '#020617', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 16, color: '#e2e8f0' }} />
                <Line type="monotone" dataKey="peso" stroke="#ec4899" strokeWidth={3} dot={{ r: 4, fill: '#f9a8d4' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {scoring9.length > 0 && (
        <div className="mb-6">
          <h3 className="font-bold mb-2 text-sm text-white">📈 Score 9 hoyos</h3>
          <div className="border border-white/10 rounded-3xl p-3" style={{ ...cardStyle, height: 220 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={scoring9}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.16)" />
                <XAxis dataKey="fecha" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: '#020617', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 16, color: '#e2e8f0' }} />
                <Legend wrapperStyle={{ fontSize: 11, color: '#cbd5e1' }} />
                <Line type="monotone" dataKey="golpes" stroke="#38bdf8" strokeWidth={3} name="Golpes" dot={{ r: 4 }} />
                <Line type="monotone" dataKey="putts" stroke="#818cf8" strokeWidth={3} name="Putts" dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {driverFW.length > 0 && (
        <div className="mb-6">
          <h3 className="font-bold mb-2 text-sm text-white">🎯 Driver: bolas en fairway (de 10)</h3>
          <div className="border border-white/10 rounded-3xl p-3" style={{ ...cardStyle, height: 220 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={driverFW}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.16)" />
                <XAxis dataKey="fecha" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 10]} tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: '#020617', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 16, color: '#e2e8f0' }} />
                <Bar dataKey="fairways" fill="#0062ff" radius={[10, 10, 4, 4]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-3 text-xs text-slate-400">
        💡 Las gráficas se actualizan según vayas registrando sesiones. Aparecerán nuevas métricas conforme acumules datos.
      </div>
    </div>
  );
}

// ============================================================
// APP PRINCIPAL
// ============================================================
export default function App() {
  const [vista, setVista] = useState('hoy');
  const [semana, setSemana] = useState('intensiva');
  const [fecha, setFecha] = useState(new Date());
  const [trackerAbierto, setTrackerAbierto] = useState(null);
  const [trackerKey, setTrackerKey] = useState(0); // forzar refresh

  useEffect(() => {
    (async () => {
      const s = await safeGet('config:semana');
      if (s) setSemana(s);
    })();
  }, []);

  const cambiarSemana = async (nueva) => {
    setSemana(nueva);
    await safeSet('config:semana', nueva);
  };

  const abrirTracker = (bloque) => {
    setTrackerAbierto(bloque);
  };

  const cerrarTracker = () => {
    setTrackerAbierto(null);
    setTrackerKey(k => k + 1);
  };

  return (
    <div className="min-h-screen text-slate-100" style={{ ...appBg, fontFamily: 'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>
      {/* Header global */}
      <div className="bg-slate-950/78 backdrop-blur-xl border-b border-white/10 sticky top-0 z-30">
        <div className="px-4 py-3 flex items-center justify-between max-w-3xl mx-auto">
          <div>
            <h1 className="text-lg font-black text-white">Coach</h1>
            <div className="text-[11px] text-slate-500 font-bold uppercase tracking-[0.14em]">Golf · Hockey · Gym</div>
          </div>
          <select value={semana} onChange={e => cambiarSemana(e.target.value)}
            className={`px-3 py-2 ${inputClass}`}>
            <option value="intensiva">Semana intensiva</option>
            <option value="noIntensiva">Semana no intensiva</option>
          </select>
        </div>
      </div>

      {/* Contenido vista */}
      <div key={trackerKey}>
        {vista === 'hoy' && <PantallaHoy semana={semana} fecha={fecha} setFecha={setFecha} onAbrirTracker={abrirTracker} />}
        {vista === 'semana' && <PantallaSemana semana={semana} fecha={fecha} setFecha={(f) => { setFecha(f); setVista('hoy'); }} onAbrirTracker={abrirTracker} />}
        {vista === 'progreso' && <PantallaProgreso />}
      </div>

      {/* Tracker overlays */}
      {trackerAbierto && (trackerAbierto.tipo === 'golf') && (
        <TrackerGolf sesionId={trackerAbierto.sesionId} fecha={fecha} onClose={cerrarTracker} />
      )}
      {trackerAbierto && (trackerAbierto.tipo === 'gym' || trackerAbierto.tipo === 'pt') && (
        <TrackerGym sesionId={trackerAbierto.sesionId} fecha={fecha} onClose={cerrarTracker} />
      )}
      {trackerAbierto && trackerAbierto.tipo === 'hockey' && (
        <TrackerHockey fecha={fecha} onClose={cerrarTracker} />
      )}

      {/* Bottom nav */}
      <div className="fixed bottom-0 left-0 right-0 bg-slate-950/90 backdrop-blur-xl border-t border-white/10 flex z-40">
        <button onClick={() => setVista('hoy')}
          className={`flex-1 flex flex-col items-center py-2.5 transition ${vista === 'hoy' ? 'text-blue-300' : 'text-slate-500 hover:text-slate-300'}`}>
          <Home size={20} />
          <span className="text-xs mt-0.5 font-bold">Hoy</span>
        </button>
        <button onClick={() => setVista('semana')}
          className={`flex-1 flex flex-col items-center py-2.5 transition ${vista === 'semana' ? 'text-blue-300' : 'text-slate-500 hover:text-slate-300'}`}>
          <Calendar size={20} />
          <span className="text-xs mt-0.5 font-bold">Semana</span>
        </button>
        <button onClick={() => setVista('progreso')}
          className={`flex-1 flex flex-col items-center py-2.5 transition ${vista === 'progreso' ? 'text-blue-300' : 'text-slate-500 hover:text-slate-300'}`}>
          <BarChart3 size={20} />
          <span className="text-xs mt-0.5 font-bold">Progreso</span>
        </button>
      </div>
    </div>
  );
}
