
import { Routine, RoutineType } from './types';

const uid = () => Math.random().toString(36).substr(2, 9);

export const MOTIVATIONAL_QUOTES = [
  "Ese futuro brillante te está esperando. No lo hagas esperar.",
  "Estás a una decisión de cambiar tu historia. Levántate.",
  "Sé que duele, pero crecer duele. Sigue adelante.",
  "No te definen tus caídas, sino las veces que te levantas.",
  "Tu 'yo' del futuro te está mirando con orgullo. No te rindas.",
  "Nietzsche no ofrece consuelo. Ofrece un martillo.",
  "La grandeza es incompatible con la aprobación.",
  "O creces o mueres. La satisfacción es decadencia."
];

export const NIETZSCHE_LAWS = [
  {
    id: 'law_1',
    title: "LEY 1: INVERSIÓN MORAL",
    subtitle: "Crea tus Propios Valores.",
    description: "Los valores no son verdades cósmicas, son herramientas. La pregunta no es '¿Es esto correcto?', sino '¿Este valor me fortalece o me debilita?'. Tu primer acto de poder es dejar de ser esclavo de una moral que no elegiste.",
    iconName: "Compass" 
  },
  {
    id: 'law_2',
    title: "LEY 2: SUFRIMIENTO NECESARIO",
    subtitle: "Elige el Dolor que te Construye.",
    description: "La fuerza solo nace de la resistencia. No todo sufrimiento fortalece; la victimización te hace miserable. Elige activamente el dolor disciplinado que te transforma.",
    iconName: "Hammer"
  },
  {
    id: 'law_3',
    title: "LEY 3: SOLEDAD CREATIVA",
    subtitle: "La Grandeza es Incompatible con la Aprobación.",
    description: "La soledad no es abandono, es un laboratorio. Es el espacio donde puedes construir algo genuino sin el juicio constante de los demás.",
    iconName: "Mountain"
  },
  {
    id: 'law_4',
    title: "LEY 4: VOLUNTAD DE POTENCIA",
    subtitle: "O Creces o Mueres.",
    description: "La vida no busca la paz, busca la expansión. La satisfacción es el inicio de la decadencia. La pregunta no es '¿cuánto es suficiente?', sino '¿cuánto es posible?'.",
    iconName: "TreeDeciduous"
  },
  {
    id: 'law_5',
    title: "LEY 5: AMOR FATI",
    subtitle: "Ama tu Destino.",
    description: "No solo aceptes tu vida, ámala. Cada tragedia, fracaso y cicatriz te forjó. Amor Fati transmuta. Transforma cada obstáculo en combustible.",
    iconName: "Flame"
  },
  {
    id: 'law_6',
    title: "LEY 6: AUTOSUPERACIÓN PERPETUA",
    subtitle: "Mata a Quien Eres Hoy.",
    description: "El Übermensch no es un destino, es un proceso. Tu mayor enemigo es tu versión actual. Debes identificar qué versión de ti necesita morir.",
    iconName: "Swords"
  },
  {
    id: 'law_7',
    title: "LEY 7: CREACIÓN DE SENTIDO",
    subtitle: "Si Dios ha Muerto, Tú eres el Creador.",
    description: "La ausencia de un significado preestablecido es tu máxima libertad. El espíritu fuerte no espera que la vida tenga un propósito, le impone un propósito.",
    iconName: "HandMetal"
  }
];

export const ROUTINES: Record<string, Routine> = {
  [RoutineType.MORNING_PRODUCTIVE]: {
    id: RoutineType.MORNING_PRODUCTIVE,
    name: "Mañana Productiva",
    description: "Ideal para quienes tienen más energía al inicio del día.",
    blocks: [
      { id: uid(), time: '07:00', activity: 'Despertar y Cuidado Personal', type: 'personal', alarmEnabled: true, status: 'pending' },
      { id: uid(), time: '08:00', activity: 'Limpiar el cuarto y Ordenar', type: 'chore', alarmEnabled: true, status: 'pending' },
      { id: uid(), time: '08:30', activity: 'MODO FOCO IA', type: 'work', alarmEnabled: true, status: 'pending' },
      { id: uid(), time: '13:00', activity: 'Almuerzo y Relax', type: 'sacred', alarmEnabled: true, enforceLock: true, status: 'pending' },
    ]
  },
  [RoutineType.DAILY_HABITS]: {
    id: RoutineType.DAILY_HABITS,
    name: "Tareas del Día a Día",
    description: "Mantenimiento del hogar y hábitos básicos esenciales.",
    blocks: [
      { id: uid(), time: '07:30', activity: 'Levantarse y Tender la Cama', type: 'chore', alarmEnabled: true, status: 'pending' },
      { id: uid(), time: '08:00', activity: 'Lavar la Ropa / Poner Lavadora', type: 'chore', alarmEnabled: true, status: 'pending' },
      { id: uid(), time: '09:00', activity: 'Ordenar el Escritorio', type: 'chore', alarmEnabled: true, status: 'pending' },
      { id: uid(), time: '14:00', activity: 'Lavar los Platos', type: 'chore', alarmEnabled: true, status: 'pending' },
      { id: uid(), time: '18:00', activity: 'Organizar Ropa Limpia', type: 'chore', alarmEnabled: true, status: 'pending' },
      { id: uid(), time: '21:00', activity: 'Limpieza de Cocina Rápida', type: 'chore', alarmEnabled: true, status: 'pending' },
    ]
  }
};
