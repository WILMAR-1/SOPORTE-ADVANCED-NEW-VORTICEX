import { TicketCategory } from "./types"

interface SmartResponse {
  message: string
  priority: "Baja" | "Media" | "Alta"
  estimatedTime: string
  tips?: string[]
}

const categoryResponses: Record<TicketCategory, SmartResponse> = {
  [TicketCategory.EMAIL_PASS]: {
    message:
      "Hemos recibido tu solicitud de recuperación de contraseña de correo institucional. Nuestro equipo de CiberSeguridad revisará tu caso y te contactará a través de tu correo personal registrado.",
    priority: "Media",
    estimatedTime: "24-48 horas",
    tips: [
      "Verifica que tengas acceso a tu correo personal registrado",
      "Ten a mano tu número de matrícula para verificación",
      "Si es urgente, puedes acudir presencialmente al Departamento de TI",
    ],
  },
  [TicketCategory.SIGEI_PASS]: {
    message:
      "Tu solicitud de recuperación de contraseña SIGEI ha sido registrada exitosamente. El equipo de Tecnología IT procesará tu caso en breve.",
    priority: "Media",
    estimatedTime: "24-48 horas",
    tips: [
      "Asegúrate de tener tu cédula o pasaporte disponible",
      "La nueva contraseña se enviará a tu correo institucional",
      "Si no tienes acceso al correo, indica esto en tu solicitud",
    ],
  },
  [TicketCategory.VIRTUAL_PASS]: {
    message:
      "Hemos registrado tu solicitud relacionada con la Plataforma Virtual. El Departamento de Tecnología Educativa (DTE) atenderá tu caso.",
    priority: "Media",
    estimatedTime: "24-48 horas",
    tips: [
      'Intenta primero la opción "Olvidé mi contraseña" en la plataforma',
      "Verifica que estés usando el enlace correcto de la plataforma",
      "Ten preparado el nombre exacto de tus cursos activos",
    ],
  },
  [TicketCategory.ACADEMIC_REQUEST]: {
    message:
      "Tu solicitud académica ha sido recibida y será evaluada por el departamento correspondiente. Te mantendremos informado sobre el progreso.",
    priority: "Media",
    estimatedTime: "3-5 días hábiles",
    tips: [
      "Adjunta cualquier documento de soporte si es necesario",
      "Incluye tu número de matrícula en la descripción",
      "Especifica claramente el tipo de solicitud",
    ],
  },
  [TicketCategory.REDES]: {
    message:
      "Tu reporte de problemas con la red ha sido registrado. El equipo de Operaciones TICs investigará el problema.",
    priority: "Media",
    estimatedTime: "12-24 horas",
    tips: [
      "Indica la ubicación exacta donde experimentas el problema",
      "Menciona si otros estudiantes tienen el mismo problema",
      "Verifica si el problema es con WiFi o cable de red",
    ],
  },
  [TicketCategory.EQUIPOS]: {
    message: "Tu solicitud sobre equipos y hardware ha sido recibida. El equipo de Operaciones TICs revisará tu caso.",
    priority: "Media",
    estimatedTime: "24-72 horas",
    tips: [
      "Describe el problema específico del equipo",
      "Indica el número de laboratorio o ubicación del equipo",
      "Menciona si el equipo muestra algún mensaje de error",
    ],
  },
  [TicketCategory.SOFTWARE]: {
    message: "Tu solicitud de software ha sido registrada. El equipo de Tecnología IT atenderá tu caso.",
    priority: "Media",
    estimatedTime: "24-48 horas",
    tips: [
      "Especifica el nombre y versión del software necesario",
      "Indica para qué materia o proyecto lo necesitas",
      "Verifica si ya está disponible en los laboratorios",
    ],
  },
  [TicketCategory.OTHER]: {
    message:
      "Tu solicitud ha sido registrada en nuestro sistema. Un miembro de nuestro equipo de soporte revisará tu caso y te contactará pronto.",
    priority: "Media",
    estimatedTime: "24-72 horas",
    tips: [
      "Proporciona la mayor cantidad de detalles posible",
      "Si tienes capturas de pantalla del problema, descríbelas",
      "Indica el mejor horario para contactarte",
    ],
  },
}

const urgentKeywords = [
  "urgente",
  "emergencia",
  "examen",
  "hoy",
  "ahora",
  "inmediato",
  "prueba",
  "entrega",
  "deadline",
  "fecha límite",
  "bloqueo",
  "bloqueado",
  "no puedo entrar",
  "acceso denegado",
  "crítico",
  "importante",
]

const lowPriorityKeywords = [
  "cuando puedan",
  "sin prisa",
  "consulta",
  "pregunta",
  "información",
  "duda",
  "orientación",
  "ayuda general",
]

export function analyzeTicket(description: string, category: TicketCategory): SmartResponse {
  const lowerDesc = description.toLowerCase()
  const baseResponse = { ...categoryResponses[category] }

  const isUrgent = urgentKeywords.some((keyword) => lowerDesc.includes(keyword))
  const isLowPriority = lowPriorityKeywords.some((keyword) => lowerDesc.includes(keyword))

  if (isUrgent) {
    baseResponse.priority = "Alta"
    baseResponse.estimatedTime = "4-12 horas"
    baseResponse.message = `PRIORIDAD ALTA: ${baseResponse.message} Debido a la urgencia indicada, tu caso será atendido de manera prioritaria.`
  } else if (isLowPriority) {
    baseResponse.priority = "Baja"
  }

  return baseResponse
}

export const statusMessages = {
  created: {
    title: "Solicitud Creada",
    message: "Tu solicitud ha sido registrada exitosamente en nuestro sistema.",
  },
  assigned: {
    title: "Técnico Asignado",
    message: "Un técnico de soporte ha sido asignado a tu caso y comenzará a trabajar en él.",
  },
  inProgress: {
    title: "En Proceso",
    message: "Tu solicitud está siendo atendida activamente por nuestro equipo.",
  },
  resolved: {
    title: "Solicitud Resuelta",
    message: "Tu solicitud ha sido resuelta. Por favor verifica y confirma que todo está funcionando correctamente.",
  },
  closed: {
    title: "Caso Cerrado",
    message: "Este caso ha sido cerrado. Si necesitas más ayuda, puedes crear una nueva solicitud.",
  },
  transferred: {
    title: "Transferido",
    message: "Tu solicitud ha sido transferida al departamento correspondiente para mejor atención.",
  },
}

export function getSystemNote(action: string, adminName: string, details?: string): string {
  const notes: Record<string, string> = {
    assigned: `${adminName} ha tomado este caso y comenzará a trabajar en la solución.`,
    statusChange: `Estado actualizado a "${details}" por ${adminName}.`,
    transferred: `Caso transferido a "${details}" por ${adminName} para mejor atención.`,
    resolved: `Caso marcado como RESUELTO por ${adminName}. Solución aplicada exitosamente.`,
    closed: `Caso CERRADO por ${adminName}. Gracias por usar el sistema de soporte ITLA.`,
  }
  return notes[action] || `Acción realizada por ${adminName}.`
}

export function getWelcomeMessage(category: TicketCategory): string {
  const messages: Record<TicketCategory, string> = {
    [TicketCategory.EMAIL_PASS]:
      "Entendemos lo importante que es acceder a tu correo institucional. Nuestro equipo de CiberSeguridad te ayudará lo antes posible.",
    [TicketCategory.SIGEI_PASS]:
      "El acceso a SIGEI es fundamental para tu vida académica. Trabajaremos para restablecer tu acceso rápidamente.",
    [TicketCategory.VIRTUAL_PASS]:
      "La plataforma virtual es tu conexión con tus cursos. Te ayudaremos a recuperar el acceso.",
    [TicketCategory.ACADEMIC_REQUEST]:
      "Tu solicitud académica es importante para nosotros. La procesaremos con la debida atención.",
    [TicketCategory.REDES]:
      "Sabemos que la conectividad es esencial. Investigaremos y resolveremos el problema de red.",
    [TicketCategory.EQUIPOS]: "Los equipos son herramientas fundamentales para tu aprendizaje. Atenderemos tu reporte.",
    [TicketCategory.SOFTWARE]: "El software adecuado es clave para tus proyectos. Te ayudaremos con tu solicitud.",
    [TicketCategory.OTHER]: "Gracias por contactarnos. Evaluaremos tu caso y te brindaremos la mejor solución posible.",
  }
  return messages[category]
}
