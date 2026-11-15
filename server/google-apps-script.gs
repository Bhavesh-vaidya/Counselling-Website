/**
 * Anora Counseling - calendar helper (Google Apps Script)
 * Runs inside the anoracounselling@gmail.com account. The website server calls it
 * to create a Google Calendar event with a unique Google Meet link, and to delete
 * the test event. Setup steps: SETUP.md -> "Google Meet links".
 *
 * 1) Replace the SECRET below with a long random text (and put the SAME text in
 *    server/.env as GOOGLE_SCRIPT_SECRET).
 * 2) Left menu: Services (+) -> "Google Calendar API" -> Add.
 */
const SECRET = 'PASTE_A_LONG_RANDOM_TEXT_HERE';

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    if (!SECRET || SECRET === 'PASTE_A_LONG_RANDOM_TEXT_HERE' || data.secret !== SECRET) {
      return out({ ok: false, error: 'unauthorized' });
    }

    if (data.action === 'create') {
      const event = Calendar.Events.insert(
        {
          summary: data.summary,
          description: data.description,
          start: { dateTime: data.start, timeZone: data.timeZone },
          end: { dateTime: data.end, timeZone: data.timeZone },
          conferenceData: {
            createRequest: {
              requestId: data.requestId,
              conferenceSolutionKey: { type: 'hangoutsMeet' },
            },
          },
        },
        'primary',
        { conferenceDataVersion: 1, sendUpdates: 'none' }
      );
      const video = ((event.conferenceData && event.conferenceData.entryPoints) || []).filter(
        (p) => p.entryPointType === 'video'
      )[0];
      const meetLink = event.hangoutLink || (video && video.uri) || null;
      return out({ ok: Boolean(meetLink), eventId: event.id, meetLink: meetLink, error: meetLink ? undefined : 'No Meet link returned' });
    }

    if (data.action === 'delete') {
      Calendar.Events.remove('primary', data.eventId, { sendUpdates: 'none' });
      return out({ ok: true });
    }

    return out({ ok: false, error: 'unknown action' });
  } catch (err) {
    return out({ ok: false, error: String(err) });
  }
}

// Opening the web app URL in a browser shows this, so you can check it is live.
function doGet() {
  return out({ ok: true, status: 'Anora calendar helper is running' });
}

// Run this ONCE from the editor (select "authorize" -> Run) to grant calendar permission.
function authorize() {
  Calendar.Calendars.get('primary');
}

function out(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
