import { google } from 'googleapis';
import dotenv from 'dotenv';

dotenv.config();

const calendar = google.calendar('v3');

const auth = new google.auth.GoogleAuth({
  credentials: {
    type: 'service_account',
    project_id: process.env.GOOGLE_PROJECT_ID,
    private_key_id: process.env.GOOGLE_PRIVATE_KEY_ID,
    private_key: process.env.GOOGLE_PRIVATE_KEY ? process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n') : undefined,
    client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    client_id: process.env.GOOGLE_CLIENT_ID,
    auth_uri: 'https://accounts.google.com/o/oauth2/auth',
    token_uri: 'https://oauth2.googleapis.com/token',
  },
  scopes: ['https://www.googleapis.com/auth/calendar'],
});

export async function createCalendarEvent(appointment) {
  try {
    if (!process.env.GOOGLE_CALENDAR_ID || !process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL) {
      console.log('Google Calendar no configurado, saltando creación de evento');
      return null;
    }

    const itemsList = appointment.items
      .map((item) => `${item.nombre} - $${item.precio.toFixed(2)}`)
      .join('\n');

    const event = {
      summary: `Cita: ${appointment.client_name}`,
      description: `Cliente: ${appointment.client_name}\nEmail: ${appointment.client_email}\nTeléfono: ${appointment.client_phone || '-'}\n\nServicios:\n${itemsList}\n\nNotas: ${appointment.notes || 'Sin notas'}`,
      start: {
        dateTime: new Date(`${appointment.appointment_date}T${appointment.appointment_time}`).toISOString(),
        timeZone: 'America/Caracas',
      },
      end: {
        dateTime: new Date(new Date(`${appointment.appointment_date}T${appointment.appointment_time}`).getTime() + 60 * 60 * 1000).toISOString(),
        timeZone: 'America/Caracas',
      },
      attendees: [{ email: appointment.client_email }],
    };

    const response = await calendar.events.insert({
      auth,
      calendarId: process.env.GOOGLE_CALENDAR_ID,
      resource: event,
      sendUpdates: 'all',
    });

    console.log('Evento de Google Calendar creado:', response.data.id);
    return response.data.id;
  } catch (error) {
    console.error('Error creando evento en Google Calendar:', error.message);
    return null;
  }
}

export async function updateCalendarEvent(eventId, appointment) {
  try {
    if (!process.env.GOOGLE_CALENDAR_ID || !eventId) {
      return;
    }

    const itemsList = appointment.items
      .map((item) => `${item.nombre} - $${item.precio.toFixed(2)}`)
      .join('\n');

    const event = {
      summary: `Cita: ${appointment.client_name}`,
      description: `Cliente: ${appointment.client_name}\nEmail: ${appointment.client_email}\nTeléfono: ${appointment.client_phone || '-'}\n\nServicios:\n${itemsList}\n\nNotas: ${appointment.notes || 'Sin notas'}`,
      start: {
        dateTime: new Date(`${appointment.appointment_date}T${appointment.appointment_time}`).toISOString(),
        timeZone: 'America/Caracas',
      },
      end: {
        dateTime: new Date(new Date(`${appointment.appointment_date}T${appointment.appointment_time}`).getTime() + 60 * 60 * 1000).toISOString(),
        timeZone: 'America/Caracas',
      },
    };

    await calendar.events.update({
      auth,
      calendarId: process.env.GOOGLE_CALENDAR_ID,
      eventId,
      resource: event,
      sendUpdates: 'all',
    });

    console.log('Evento de Google Calendar actualizado:', eventId);
  } catch (error) {
    console.error('Error actualizando evento en Google Calendar:', error.message);
  }
}

export async function deleteCalendarEvent(eventId) {
  try {
    if (!process.env.GOOGLE_CALENDAR_ID || !eventId) {
      return;
    }

    await calendar.events.delete({
      auth,
      calendarId: process.env.GOOGLE_CALENDAR_ID,
      eventId,
      sendUpdates: 'all',
    });

    console.log('Evento de Google Calendar eliminado:', eventId);
  } catch (error) {
    console.error('Error eliminando evento en Google Calendar:', error.message);
  }
}
