import { type Ticket, type User, TicketStatus } from "./types"

export function generateTicketPDF(ticket: Ticket, student?: User) {
  // Crear contenido del PDF como texto formateado
  const content = `
================================================================================
                    INSTITUTO TECNOLÓGICO DE LAS AMÉRICAS (ITLA)
                         SISTEMA DE SOPORTE ESTUDIANTIL
                              REPORTE DE TICKET
================================================================================

INFORMACIÓN DEL TICKET
----------------------
Número de Ticket:     #${ticket.number}
Fecha de Creación:    ${new Date(ticket.createdAt).toLocaleString("es-DO")}
Última Actualización: ${new Date(ticket.updatedAt).toLocaleString("es-DO")}
Estado Actual:        ${ticket.status}
Prioridad:            ${ticket.priority}
Categoría:            ${ticket.category}

INFORMACIÓN DEL ESTUDIANTE
--------------------------
Nombre:               ${ticket.userName}
Correo:               ${ticket.userEmail || "No especificado"}
Matrícula:            ${ticket.userMatricula || "No especificada"}
${student?.phone ? `Teléfono:             ${student.phone}` : ""}
${student?.career ? `Carrera:              ${student.career}` : ""}

DETALLES DE LA SOLICITUD
------------------------
Asunto: ${ticket.title}

Descripción:
${ticket.description}

${ticket.problemType ? `Tipo de Problema: ${ticket.problemType}` : ""}

INFORMACIÓN DE ATENCIÓN
-----------------------
${ticket.assignedName ? `Asignado a:           ${ticket.assignedName}` : "Sin asignar"}
${ticket.resolvedAt ? `Fecha de Resolución:  ${new Date(ticket.resolvedAt).toLocaleString("es-DO")}` : ""}
${ticket.resolvedByName ? `Resuelto por:         ${ticket.resolvedByName}` : ""}

HISTORIAL DE NOTAS
------------------
${
  ticket.notes.length > 0
    ? ticket.notes
        .map(
          (note, index) => `
[${index + 1}] ${new Date(note.createdAt).toLocaleString("es-DO")}
    Autor: ${note.author}
    ${note.text}
`,
        )
        .join("\n")
    : "No hay notas registradas."
}

================================================================================
                         RESUMEN DEL CASO
================================================================================

Estado Final: ${ticket.status}
${ticket.status === TicketStatus.RESOLVED || ticket.status === TicketStatus.CLOSED ? "✓ CASO COMPLETADO" : "⏳ CASO EN PROCESO"}

Problema Reportado: ${ticket.category}
${ticket.problemType ? `Tipo Específico: ${ticket.problemType}` : ""}

${
  ticket.resolvedByName
    ? `
Este ticket fue atendido y ${ticket.status === TicketStatus.RESOLVED ? "resuelto" : "cerrado"} por:
${ticket.resolvedByName}
Fecha: ${ticket.resolvedAt ? new Date(ticket.resolvedAt).toLocaleString("es-DO") : "N/A"}
`
    : ""
}

================================================================================
Documento generado automáticamente por el Sistema de Soporte ITLA
Fecha de generación: ${new Date().toLocaleString("es-DO")}
================================================================================
`

  // Crear blob y descargar
  const blob = new Blob([content], { type: "text/plain;charset=utf-8" })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = `ITLA_Ticket_${ticket.number}_${ticket.userName.replace(/\s+/g, "_")}.txt`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

export function generateMultipleTicketsPDF(tickets: Ticket[], users: User[]) {
  let content = `
================================================================================
                    INSTITUTO TECNOLÓGICO DE LAS AMÉRICAS (ITLA)
                         SISTEMA DE SOPORTE ESTUDIANTIL
                           REPORTE MÚLTIPLE DE TICKETS
================================================================================

Total de Tickets: ${tickets.length}
Fecha de Generación: ${new Date().toLocaleString("es-DO")}

================================================================================
`

  tickets.forEach((ticket, index) => {
    const student = users.find((u) => u.id === ticket.userId)
    content += `
--------------------------------------------------------------------------------
TICKET ${index + 1} - #${ticket.number}
--------------------------------------------------------------------------------
Estado: ${ticket.status} | Prioridad: ${ticket.priority} | Categoría: ${ticket.category}
Estudiante: ${ticket.userName} (${ticket.userMatricula || "Sin matrícula"})
Correo: ${ticket.userEmail || "No especificado"}
Asunto: ${ticket.title}
Creado: ${new Date(ticket.createdAt).toLocaleString("es-DO")}
${ticket.assignedName ? `Asignado a: ${ticket.assignedName}` : "Sin asignar"}
${ticket.resolvedByName ? `Resuelto por: ${ticket.resolvedByName} el ${new Date(ticket.resolvedAt!).toLocaleString("es-DO")}` : ""}
`
  })

  content += `
================================================================================
                              FIN DEL REPORTE
================================================================================
`

  const blob = new Blob([content], { type: "text/plain;charset=utf-8" })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = `ITLA_Reporte_Tickets_${new Date().toISOString().split("T")[0]}.txt`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
