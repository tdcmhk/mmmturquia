import {
  PrayerBlock,
  CalendarEvent,
  Poll,
  MissionaryProject,
  ChatMessage,
  MissionaryBirthday,
  OnlineIntercessor,
  DailyPrayerEntry
} from '../types';

export const INITIAL_PRAYER_BLOCKS: PrayerBlock[] = [
  {
    id: 'seccion-1',
    number: 1,
    title: 'Mujeres dispersas en Turquía: llamadas a una vida santa',
    scriptureRef: '1 Pedro 1:15',
    scriptureText: '«Sino, como aquel que os llamó es santo, sed también vosotros santos en toda vuestra manera de vivir.»',
    context: 'Pedro se dirige a creyentes que viven la realidad de la diáspora (dispersión). En este entorno, donde la cultura presiona para amoldarse a sus costumbres, el texto bíblico las llama a «ceñir los lomos de su entendimiento» y recordar que fueron rescatadas con la sangre preciosa de Cristo para vivir vidas santas y transformadas, reflejando su verdadera identidad por encima del aislamiento.',
    challenge: 'Superar la soledad, el aislamiento geográfico y la presión social en un entorno cultural ajeno o desfavorable a la fe cristiana, protegiendo su identidad y testimonio en el hogar y la comunidad frente a la incomprensión familiar.',
    items: [
      {
        title: 'Santidad',
        description: 'Oremos para que las mujeres latinas y turcas que viven dispersas por las distintas ciudades de Turquía comprendan su identidad en Cristo y respondan al llamado de Dios a vivir en santidad. Que mantengan su esperanza puesta en Jesús.'
      },
      {
        title: 'Regeneración',
        description: 'Pidamos que la Palabra transforme sus pensamientos, decisiones y relaciones, y que sus vidas sean un testimonio del Evangelio en sus hogares y comunidades.'
      }
    ],
    imageUrl: '/src/assets/images/bible_study_fellowship_1792130895365.jpg',
    prayedCount: 384,
    hasPrayed: false,
    isSaved: false,
    comments: [
      { id: 'c1', author: 'Hna. Marcela (Bogotá)', text: 'Unida en clamor por cada hermana dispersa. ¡El Señor las guardará santas y firmes!', date: 'Hace 2 horas' },
      { id: 'c2', author: 'Pr. Carlos (Lima)', text: 'Dios consuela a los solitarios en familia; orando desde Perú.', date: 'Hace 5 horas' }
    ]
  },
  {
    id: 'seccion-2',
    number: 2,
    title: 'Hambre y crecimiento en la Palabra de Dios',
    scriptureRef: '1 Pedro 2:1-3',
    scriptureText: '«Desechando, pues, toda malicia, todo engaño, hipocresía, envidias, y todas las detracciones, desead, como niños recién nacidos, la leche espiritual no adulterada, para que por ella crezcáis para salvación, si es que habéis gustado la benignidad del Señor.»',
    context: 'El apóstol compara al creyente con un niño recién nacido que anhela la «leche espiritual no adulterada». En el Cuaderno, este pasaje subraya que el crecimiento espiritual no es automático, sino que requiere desechar los estorbos del entorno y alimentarse continuamente de las Escrituras para madurar en medio de un contexto sin redes de apoyo cristiano.',
    challenge: 'Superar la falta de hábitos de lectura bíblica y la escasez o dificultad de acceso a literatura y materiales de discipulado de calidad (tanto en español como en turco), además de la barrera del idioma para las mujeres migrantes.',
    items: [
      {
        title: 'Crecimiento Espiritual',
        description: 'Oremos para que nazca y crezca en cada creyente un hambre genuina por la Palabra de Dios. Que anhelen conocer más a Cristo y encuentren en las Escrituras el alimento necesario.'
      },
      {
        title: 'Instrumentos de Dios',
        description: 'Pidamos que tengan acceso a Biblias en español y turco, materiales de discipulado y personas que las acompañen en su crecimiento espiritual.'
      }
    ],
    imageUrl: '/src/assets/images/bursa_mission_field_1792130896037.jpg',
    prayedCount: 291,
    hasPrayed: false,
    isSaved: false,
    comments: [
      { id: 'c3', author: 'Hno. David (Madrid)', text: 'Enviando oraciones por los nuevos ejemplares de la Biblia en turco.', date: 'Ayer' }
    ]
  },
  {
    id: 'seccion-3',
    number: 3,
    title: 'Los matrimonios y las familias',
    scriptureRef: '1 Pedro 3:1-7',
    scriptureText: '«Asimismo vosotras, mujeres, estad sujetas a vuestros maridos; para que también los que no creen a la palabra, sean ganados sin palabra por la conducta de sus esposas... Vosotros, maridos, igualmente, vivid con ellas sabiamente, dando honor a la mujer...»',
    context: 'En el primer siglo, ser creyente dentro de un hogar pagano o multicultural generaba fuertes roces. Pedro da pautas para la vida conyugal, destacando la belleza de la conducta pura, el respeto, el amor y un espíritu afable. El testimonio silencioso pero diario de la fe es el medio más poderoso para transformar el hogar.',
    challenge: 'Manejar el choque cultural, idiomático y las tensiones en matrimonios mixtos o interculturales, garantizando la asistencia y participación regular en espacios de formación a pesar de los horarios laborales o las restricciones impuestas por familiares no creyentes.',
    items: [
      {
        title: 'Ayuda idónea',
        description: 'Oremos por las mujeres casadas y sus hogares. Que Dios les conceda sabiduría para vivir sus responsabilidades con amor, respeto, humildad y un espíritu afable.'
      },
      {
        title: 'Matrimonios multiculturales',
        description: 'Pidamos por matrimonios multiculturales, por las diferencias de costumbres y por las familias que atraviesan tensiones. Que el Señor fortalezca la unidad matrimonial.'
      }
    ],
    imageUrl: '/src/assets/images/bible_study_fellowship_1792130895365.jpg',
    prayedCount: 312,
    hasPrayed: false,
    isSaved: false,
    comments: []
  },
  {
    id: 'seccion-4',
    number: 4,
    title: 'Una buena conciencia y un testimonio fiel',
    scriptureRef: '1 Pedro 3:8-17',
    scriptureText: '«...estad siempre preparados para presentar defensa con mansedumbre y reverencia ante todo el que os demande razón de la esperanza que hay en vosotros; teniendo buena conciencia...»',
    context: 'Ante la posibilidad de sufrir calumnias, incomprensión o rechazo por causa de la fe en un entorno hostil, Pedro enseña a no responder con amargura, sino a «santificar a Dios en el corazón» y estar siempre preparados para defender la esperanza cristiana con mansedumbre, respeto y una conducta irreprochable.',
    challenge: 'Vencer el rechazo, la desconfianza o las tensiones religiosas al compartir la fe con vecinos, familiares y conocidos, respondiendo con firmeza, amor y respeto ante acusaciones o actitudes de hostilidad.',
    items: [
      {
        title: 'Firmeza',
        description: 'Oremos para que las creyentes respondan con amor, compasión y humildad ante las dificultades. Que permanezcan firmes en su fe y mantengan una buena conciencia.'
      },
      {
        title: 'Mansedumbre',
        description: 'Pidamos que, incluso cuando enfrenten incomprensión por causa de su fe, respondan con mansedumbre y respeto, y que su conducta glorifique al Señor.'
      }
    ],
    imageUrl: '/src/assets/images/intranet_hero_bosphorus_1792130893706.jpg',
    prayedCount: 265,
    hasPrayed: false,
    isSaved: false,
    comments: []
  },
  {
    id: 'seccion-5',
    number: 5,
    title: 'Andrea y Natalia: capacitadas para servir',
    scriptureRef: '1 Pedro 4:10-11',
    scriptureText: '«Cada uno según el don que ha recibido, minístrelo a los otros, como buenos administradores de la multiforme gracia de Dios... para que en todo sea Dios glorificado por Jesucristo...»',
    context: 'El servicio cristiano en medio de una minoría demanda una entrega total sostenida por la gracia. Pedro exhorta a ministrar según el poder que Dios concede, recordando a las obreras que su fuerza no radica en recursos humanos, sino en el respaldo del Espíritu Santo.',
    challenge: 'Prevenir el desgaste físico, emocional y espiritual de las movilizadoras ante la alta demanda de atención personalizada, la dispersión de las personas que acompañan y la necesidad de discernimiento para priorizar a quienes acompañan.',
    items: [
      {
        title: 'Servicio',
        description: 'Oremos especialmente por Andrea y Natalia, para que cada una use los dones que Dios le ha dado para servir y edificar a otros con gozo y fortaleza renovada.'
      },
      {
        title: 'Sabiduría y Provisión',
        description: 'Pidamos al Señor que les conceda discernimiento, salud, protección física y provisión integral en cada etapa de su labor en Turquía.'
      }
    ],
    imageUrl: '/src/assets/images/bible_study_fellowship_1792130895365.jpg',
    prayedCount: 418,
    hasPrayed: false,
    isSaved: false,
    comments: [
      { id: 'c4', author: 'Hna. Ruth (Quito)', text: 'Clamando por cobertura angelical y salud para Andrea y Natalia.', date: 'Hace 1 día' }
    ],
    isExtra: true
  },
  {
    id: 'seccion-6',
    number: 6,
    title: 'Pastores y quienes cuidan del rebaño',
    scriptureRef: '1 Pedro 5:1-4',
    scriptureText: '«Apacentad la grey de Dios que está entre vosotros, cuidando de ella, no por fuerza, sino voluntariamente; no por ganancia deshonesta, sino con ánimo pronto...»',
    context: 'Dirigiéndose a los ancianos y líderes que pastoreaban rebaños pequeños y dispersos, Pedro apela a cuidar a la iglesia con voluntad, disposición sincera y dando el ejemplo, sin dejarse llevar por la ambición ni el desánimo, con la mirada puesta en la corona incorruptible que dará el Príncipe de los pastores.',
    challenge: 'Fortalecer el liderazgo local que a menudo ministra en condiciones de precariedad, sin templos o cultos formales consolidados, enfrentando el cansancio y la constante vigilancia o presión externa.',
    items: [
      {
        title: 'Obreros',
        description: 'Oremos por los pastores, líderes y obreros que tienen la responsabilidad de cuidar al pueblo de Dios en Turquía. Que sirvan voluntariamente, con amor genuino.'
      },
      {
        title: 'Liderazgo y Fidelidad',
        description: 'Pidamos que Dios los fortalezca, les conceda fidelidad inquebrantable a la Palabra, sabiduría pastoral y perseverancia en medio de los desafíos.'
      }
    ],
    imageUrl: '/src/assets/images/intranet_hero_bosphorus_1792130893706.jpg',
    prayedCount: 350,
    hasPrayed: false,
    isSaved: false,
    comments: [],
    isExtra: true
  },
  {
    id: 'seccion-7',
    number: 7,
    title: 'Recursos para los próximos viajes (Bursa y Balıkesir)',
    scriptureRef: '1 Pedro 4:11',
    scriptureText: '«El que habla, hable conforme a las palabras de Dios; el que sirve, sirva conforme al poder que Dios da, para que en todo sea Dios glorificado por Jesucristo...»',
    context: 'En el contexto apostólico, la expansión del Evangelio por las provincias de Asia Menor requería movilidad y la provisión del Señor a través del apoyo mutuo. Viajar a ciudades clave representaba la oportunidad de consolidar redes, sembrar la verdad y estrechar lazos comunitarios.',
    challenge: 'Cubrir los costos de transporte, alojamiento y logística, sumado a la brevedad del tiempo para establecer contactos efectivos y convocar a las mujeres en dichas ciudades.',
    items: [
      {
        title: 'Logística y Provisión',
        description: 'Oremos por la provisión económica necesaria para realizar los viajes a Bursa y Balıkesir, transporte seguro y cobertura para cada gasto de la movilización.'
      },
      {
        title: 'Relaciones y Discipulado',
        description: 'Pidamos por los encuentros con familias y mujeres latinas, por las nuevas relaciones que puedan establecerse y por oportunidades de compartir a Cristo.'
      }
    ],
    imageUrl: '/src/assets/images/bursa_mission_field_1792130896037.jpg',
    prayedCount: 377,
    hasPrayed: false,
    isSaved: false,
    comments: [],
    isExtra: true
  },
  {
    id: 'seccion-8',
    number: 8,
    title: 'Viajar a Grecia en noviembre',
    scriptureRef: '1 Pedro 1:17b',
    scriptureText: '«...conducíos en temor todo el tiempo de vuestra peregrinación.»',
    context: 'La historia del Nuevo Testamento muestra cómo el mensaje cruzó mares desde Asia Menor hacia la región de Macedonia y Acaya (Grecia). Este trasfondo fundamenta la búsqueda de dirección, confirmación divina y puertas abiertas para extender las redes de discipulado.',
    challenge: 'Gestionar la complejidad tramitológica, visados y requisitos documentales de ingreso a la Unión Europea, así como la provisión de fondos y la alineación de agenda con los contactos locales en Grecia.',
    items: [
      {
        title: 'Dirección Divina',
        description: 'Oremos para que el Señor confirme esta posibilidad de viaje, abra las puertas necesarias y provea los recursos, la documentación y la organización que se requieran.'
      },
      {
        title: 'Apertura de Puertas',
        description: 'Que, si este viaje forma parte de su voluntad, se concrete en el tiempo oportuno y permita establecer nuevos contactos y fortalecer a los creyentes.'
      }
    ],
    imageUrl: '/src/assets/images/missionary_expedition_aegean_1792130896065.jpg',
    prayedCount: 403,
    hasPrayed: false,
    isSaved: false,
    comments: [],
    isExtra: true
  },
  {
    id: 'seccion-9',
    number: 9,
    title: 'Acción de gracias por lo alcanzado (Estambul, Tekirdağ, Capadocia)',
    scriptureRef: '1 Pedro 1:1–2',
    scriptureText: '«Pedro, apóstol de Jesucristo, a los expatriados de la dispersión en el Ponto, Galacia, Capadocia, Asia y Bitinia, elegidos según la presciencia de Dios Padre en santificación del Espíritu... Gracia y paz os sean multiplicadas.»',
    context: 'Con base en el principio paulino y apostólico («Yo planté, Apolos regó; pero el crecimiento lo ha dado Dios», 1 Cor 3:6), el trasfondo bíblico reconoce que la fructificación y la vida en las semillas sembradas son obra exclusiva de Dios.',
    challenge: 'Lograr el seguimiento a largo plazo y la continuidad del discipulado de los nuevos creyentes y personas contactadas, evitando que la distancia geográfica o el aislamiento pongan en riesgo la semilla sembrada.',
    items: [
      {
        title: 'Evangelismo',
        description: 'Demos gracias al Señor por cada puerta abierta, cada encuentro, cada conversación y cada persona alcanzada durante la labor.'
      },
      {
        title: 'Crecimiento y Frutos',
        description: 'Agradezcamos por los materiales entregados y las relaciones fortalecidas. Confiemos en que Dios puede hacer crecer aquello que se ha sembrado fielmente.'
      }
    ],
    imageUrl: '/src/assets/images/intranet_hero_bosphorus_1792130893706.jpg',
    prayedCount: 520,
    hasPrayed: false,
    isSaved: false,
    comments: [],
    isExtra: true
  }
];

export const INITIAL_CALENDAR_EVENTS: CalendarEvent[] = [
  {
    id: 'ev-1',
    day: 18,
    month: 'OCT',
    year: 2026,
    title: 'Vigilia Nocturna de Clamor por Turquía',
    time: '21:00 - 00:00 (Hora Estambul / UTC+3)',
    location: 'Sala Virtual de Intercesión Zoom',
    category: 'vigilia',
    description: 'Encuentro mensual de intercesión unida con hermanos de América Latina, Europa y obreros en campo.',
    linkText: 'Unirme a la Sala Zoom'
  },
  {
    id: 'ev-2',
    day: 25,
    month: 'OCT',
    year: 2026,
    title: 'Taller de Discipulado Bíblico (Español / Turco)',
    time: '18:30 - 20:00 (Hora Estambul)',
    location: 'Estambul (Híbrido)',
    category: 'discipulado',
    description: 'Capacitación bíblica para mujeres creyentes en la diáspora. Estudio sobre 1 Pedro y santidad cotidiana.',
    linkText: 'Ver Material de Estudio'
  },
  {
    id: 'ev-3',
    day: 2,
    month: 'NOV',
    year: 2026,
    title: 'Salida y Visita Pastoral: Bursa y Balıkesir',
    time: 'Todo el día (02 al 06 de Nov)',
    location: 'Bursa y Balıkesir, Turquía',
    category: 'mision',
    description: 'Viaje de consolidación, entrega de literatura y acompañamiento a familias creyentes dispersas.',
    linkText: 'Detalles de la Expedición'
  },
  {
    id: 'ev-4',
    day: 14,
    month: 'NOV',
    year: 2026,
    title: 'Encuentro Transfronterizo (Grecia)',
    time: '10:00 am - 16:00 pm',
    location: 'Tesalónica / Frontera Helénica',
    category: 'reunion',
    description: 'Reunión estratégica para afianzar lazos en la ruta de Macedonia y apoyar a obreros en tránsito.',
    linkText: 'Agenda Pastoral'
  }
];

export const INITIAL_POLL: Poll = {
  id: 'poll-semana-actual',
  question: '¿Por cuál frente te comprometes a clamar con mayor intensidad esta semana?',
  options: [
    { id: 1, text: 'Provisión para viajes a Bursa y Balıkesir', votes: 142 },
    { id: 2, text: 'Crecimiento y hambre de la Palabra en mujeres latinas y turcas', votes: 198 },
    { id: 3, text: 'Protección, salud y cobertura para Andrea y Natalia', votes: 165 },
    { id: 4, text: 'Confirmación y apertura de puertas para la movilización a Grecia', votes: 89 }
  ],
  totalVotes: 594,
  userVotedOptionId: null
};

export const INITIAL_PROJECTS: MissionaryProject[] = [
  {
    id: 'proj-bursa',
    title: 'Expedición Bursa y Balıkesir',
    description: 'Transporte, estadía y distribución de folletos y Biblias para visitas pastorales en dos provincias clave.',
    progressPercent: 76,
    goal: '$3,200 USD',
    current: '$2,430 USD',
    status: 'active',
    image: '/src/assets/images/bursa_mission_field_1792130896037.jpg'
  },
  {
    id: 'proj-biblias',
    title: 'Dotación de Biblias en Turco & Discipulado',
    description: 'Fondo para impresión y envío seguro de Biblias completas (Kutsal Kitap) a hogares contactados.',
    progressPercent: 100,
    goal: '1,500 Ejemplares',
    current: '1,500 Entregadas',
    status: 'completed',
    image: '/src/assets/images/bible_study_fellowship_1792130895365.jpg'
  },
  {
    id: 'proj-grecia',
    title: 'Visita a Grecia (Noviembre)',
    description: 'Gestión de visados, pasajes y coordinación con pastores colaboradores en la región de Macedonia.',
    progressPercent: 42,
    goal: '$2,800 USD',
    current: '$1,180 USD',
    status: 'preparation',
    image: '/src/assets/images/missionary_expedition_aegean_1792130896065.jpg'
  }
];

export const INITIAL_CHAT_MESSAGES: ChatMessage[] = [
  {
    id: 'msg-1',
    userId: 'u101',
    userName: 'Pr. Vicente Tapia',
    role: 'Pastor / Coordinador',
    content: '¡Paz de Cristo, amados intercesores! Saludos desde Estambul. Gracias por cada clamor levantado por la obra.',
    timestamp: '09:15',
    avatar: 'VT'
  },
  {
    id: 'msg-2',
    userId: 'u102',
    userName: 'Movilizadora Andrea',
    role: 'Movilizadora en Campo',
    content: 'Dios está abriendo puertas maravillosas en la reunión de mujeres. Sigan orando por el Bloque 1 y 2.',
    timestamp: '10:42',
    avatar: 'AN'
  },
  {
    id: 'msg-3',
    userId: 'u103',
    userName: 'Hna. Elizabeth (Bogotá)',
    role: 'Intercesora',
    content: '¡Amén! Grupo de intercesión en Colombia activado en oración por Bursa. ¡Gloria a Dios!',
    timestamp: '11:20',
    avatar: 'EL'
  },
  {
    id: 'msg-4',
    userId: 'u104',
    userName: 'Hno. Matteo (Milán)',
    role: 'Intercesore',
    content: 'Preghiamo ogni mattina per la protezione delle famiglie e dei pastori in Turchia. Coraggio!',
    timestamp: '12:05',
    avatar: 'MA'
  }
];

export const INITIAL_BIRTHDAYS: MissionaryBirthday[] = [
  {
    id: 'b-1',
    name: 'Movilizadora Natalia',
    role: 'Obrera en Estambul',
    age: 32,
    date: '20 Octubre',
    avatar: 'NA'
  },
  {
    id: 'b-2',
    name: 'Pr. Vicente Tapia',
    role: 'Pastor Coordinador',
    age: 51,
    date: '04 Noviembre',
    avatar: 'VT'
  },
  {
    id: 'b-3',
    name: 'Movilizadora Andrea',
    role: 'Discipulado y Familias',
    age: 34,
    date: '18 Noviembre',
    avatar: 'AN'
  }
];

export const INITIAL_ONLINE_INTERCESSORS: OnlineIntercessor[] = [
  { id: 'oi-1', name: 'Douglas', country: 'Perú', city: 'Lima', flag: '🇵🇪', activeMinutes: 4 },
  { id: 'oi-2', name: 'Carmen R.', country: 'Colombia', city: 'Medellín', flag: '🇨🇴', activeMinutes: 12 },
  { id: 'oi-3', name: 'Antonio V.', country: 'España', city: 'Madrid', flag: '🇪🇸', activeMinutes: 18 },
  { id: 'oi-4', name: 'Fatma & Onur', country: 'Turquía', city: 'Estambul', flag: '🇹🇷', activeMinutes: 25 },
  { id: 'oi-5', name: 'Giuseppe B.', country: 'Italia', city: 'Roma', flag: '🇮🇹', activeMinutes: 32 },
  { id: 'oi-6', name: 'Miriam T.', country: 'Estados Unidos', city: 'Miami', flag: '🇺🇸', activeMinutes: 45 }
];

export const INITIAL_DIARY_ENTRIES: DailyPrayerEntry[] = [
  {
    id: 'd-1',
    title: 'Santidad de las mujeres en la dispersión (Bloque 1)',
    scripture: '1 Pedro 1:15',
    category: 'orado',
    date: 'Hoy, 08:30',
    notes: 'Clamé por fortaleza emocional y pureza en medio del entorno hostil.',
    blockId: 'seccion-1',
    blockNumber: 1,
    items: [
      {
        id: 'd1-m1',
        title: 'Santidad',
        description: 'Oremos para que las mujeres latinas y turcas que viven dispersas por las distintas ciudades comprendan su identidad en Cristo.',
        isAnswered: false,
        responseComments: []
      },
      {
        id: 'd1-m2',
        title: 'Regeneración',
        description: 'Pidamos que la Palabra transforme sus pensamientos, decisiones y relaciones en sus hogares.',
        isAnswered: true,
        answeredDate: 'Hoy',
        responseComments: [
          {
            id: 'rc-d1-1',
            author: 'Intercesora María',
            text: 'Una hermana en Ankara testificó que su esposo le permitió orar abiertamente en casa.',
            date: 'Hoy, 09:15'
          }
        ]
      }
    ]
  },
  {
    id: 'd-2',
    title: 'Provisión y fidelidad para la obra en Turquía (Bloque 7)',
    scripture: '1 Pedro 4:11',
    category: 'guardado',
    date: 'Ayer, 21:00',
    notes: 'Recordar en el ayuno congregacional de este viernes.',
    blockId: 'seccion-7',
    blockNumber: 7,
    items: [
      {
        id: 'd2-m1',
        title: 'Fidelidad en el Servicio',
        description: 'Que cada hermano que ministre lo haga según el poder que Dios da, con dedicación y perseverancia.',
        isAnswered: true,
        answeredDate: 'Ayer',
        responseComments: [
          {
            id: 'rc-d2-1',
            author: 'Pastor Ricardo',
            text: '¡Gloria a Dios! Se sumaron 2 colaboradores locales para apoyar la distribución de folletos bíblicos.',
            date: 'Ayer, 22:30'
          }
        ]
      },
      {
        id: 'd2-m2',
        title: 'Provisión del Reino',
        description: 'Sustento para los viajes de visitación a las familias aisladas en Balıkesir y Bursa.',
        isAnswered: false,
        responseComments: []
      }
    ]
  },
  {
    id: 'd-3',
    title: 'Concesión de visado para el viaje de exploración a Grecia',
    scripture: '1 Pedro 1:17b',
    category: 'propio',
    date: '14 Oct 2026',
    notes: 'Pidiendo dirección para el equipo que acompañará la logística y apertura legal.',
    isAnswered: false,
    items: [
      {
        id: 'd3-m1',
        title: 'Cita Consular',
        description: 'Favor de Dios ante los oficiales de inmigración en la entrevista.',
        isAnswered: true,
        answeredDate: '13 Oct',
        responseComments: [
          {
            id: 'rc-d3-1',
            author: 'Intercesor Douglas',
            text: 'Nos recibieron todos los documentos sin ninguna objeción inicial.',
            date: '13 Oct 2026'
          }
        ]
      },
      {
        id: 'd3-m2',
        title: 'Fondos de Traslado',
        description: 'Provisión completa para los boletos aéreos y hospedaje.',
        isAnswered: true,
        answeredDate: '14 Oct',
        responseComments: [
          {
            id: 'rc-d3-2',
            author: 'Intercesor Douglas',
            text: 'Una ofrenda no esperada cubrió el 100% de los pasajes. ¡Dios es fiel!',
            date: '14 Oct 2026'
          }
        ]
      }
    ],
    responseComments: [
      {
        id: 'rc-d3-main',
        author: 'Intercesor Douglas',
        text: 'Viendo la mano de Dios obrando paso a paso en esta petición familiar.',
        date: '14 Oct 2026'
      }
    ]
  },
  {
    id: 'd-4',
    title: 'Testimonio: Nueva familia abierta al estudio de la Biblia en Estambul',
    scripture: '1 Pedro 1:1-2',
    category: 'contestado',
    date: '10 Oct 2026',
    notes: '¡Alabado sea el Señor! Se completó la primera entrega de Biblias en turco y ya comenzaron las reuniones.',
    isAnswered: true,
    answeredDate: '10 Oct 2026',
    responseComments: [
      {
        id: 'rc-d4-1',
        author: 'Hna. Claudia',
        text: 'La familia nos recibió con té y oramos juntos por la paz en su hogar.',
        date: '10 Oct 2026'
      }
    ]
  }
];
