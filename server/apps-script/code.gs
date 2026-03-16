/**
 * BK Visual Production – Apps Script Web App
 *
 * IMPORTANT SECURITY NOTE:
 * - This is a lightweight example for a static site.
 * - Do NOT add an unauthenticated delete endpoint.
 *   If you need cancellations, handle them inside Google Calendar or add auth.
 */

const DEFAULT_TIMEZONE = Session.getScriptTimeZone();

function doPost(e) {
  try {
    const data = parseBody_(e);
    const action = (data.action || '').toString();

    switch (action) {
      case 'send':
        return json_(handleSend_(data));
      case 'availability':
        return json_(handleAvailability_(data));
      case 'book':
        return json_(handleBook_(data));
      default:
        return json_({ ok: false, error: 'Unknown action. Use send | availability | book.' });
    }
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  }
}

function doGet(e) {
  return ContentService
    .createTextOutput('BKVP Apps Script Web App is running. Use POST requests.')
    .setMimeType(ContentService.MimeType.TEXT);
}

// ========== EMAIL ==========  
function handleSend_(data) {
  const to = (data.to || '').toString().trim();
  const subject = (data.subject || 'BKVP Form Submission').toString();
  const htmlBody = (data.html || '').toString();
  const textBody = (data.text || '').toString();

  if (!to) return { ok: false, error: 'Missing recipient email (to).' };
  if (!textBody && !htmlBody) return { ok: false, error: 'Missing body.' };

  MailApp.sendEmail({
    to,
    subject,
    htmlBody: htmlBody || undefined,
    body: textBody || stripHtml_(htmlBody)
  });

  return { ok: true };
}

// ========== AVAILABILITY ==========
function handleAvailability_(data) {
  const calendarId = (data.calendarId || '').toString().trim();
  const startIso = (data.startIso || '').toString().trim();
  const endIso = (data.endIso || '').toString().trim();

  if (!calendarId) return { ok: false, error: 'Missing calendarId.' };
  if (!startIso || !endIso) return { ok: false, error: 'Missing startIso/endIso.' };

  const cal = CalendarApp.getCalendarById(calendarId);
  if (!cal) return { ok: false, error: 'Calendar not found. Check CALENDAR_ID.' };

  const start = new Date(startIso);
  const end = new Date(endIso);
  const events = cal.getEvents(start, end);

  // Return a list of busy intervals.
  const busy = events.map(ev => ({
    start: ev.getStartTime().toISOString(),
    end: ev.getEndTime().toISOString(),
    title: ev.getTitle()
  }));

  return { ok: true, busy };
}

// ========== BOOKING ==========
function handleBook_(data) {
  const calendarId = (data.calendarId || '').toString().trim();
  const startIso = (data.startIso || '').toString().trim();
  const endIso = (data.endIso || '').toString().trim();
  const title = (data.title || 'BKVP Booking').toString();
  const description = (data.description || '').toString();
  const location = (data.location || '').toString();

  if (!calendarId) return { ok: false, error: 'Missing calendarId.' };
  if (!startIso || !endIso) return { ok: false, error: 'Missing startIso/endIso.' };

  const cal = CalendarApp.getCalendarById(calendarId);
  if (!cal) return { ok: false, error: 'Calendar not found. Check CALENDAR_ID.' };

  const start = new Date(startIso);
  const end = new Date(endIso);

  // Simple conflict check (no race-proof locking, but OK for a small site).
  const conflicts = cal.getEvents(start, end);
  if (conflicts && conflicts.length) {
    return { ok: false, error: 'Time slot is already taken.' };
  }

  const event = cal.createEvent(title, start, end, {
    description,
    location
  });

  return { ok: true, eventId: event.getId() };
}

// ========== HELPERS ==========
function parseBody_(e) {
  if (!e) return {};
  if (e.postData && e.postData.type === 'application/json') {
    return JSON.parse(e.postData.contents || '{}');
  }

  // Form URL-encoded
  const p = (e.parameter || {});
  return p;
}

function json_(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

function stripHtml_(html) {
  return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}
