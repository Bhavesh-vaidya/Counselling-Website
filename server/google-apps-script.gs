/**
<<<<<<< HEAD
 * Anora Counseling - helper script (Google Apps Script)
 * Runs inside the anoracounselling@gmail.com account. The website server calls it to:
 *   - create a Google Calendar event with a unique Google Meet link   (action "create")
 *   - create the event AND send the booking emails in one go           (action "booking")
 *   - send an email from this Gmail account                            (action "sendMail")
 *   - delete the test event                                            (action "delete")
 * Setup steps: DEPLOY.md -> "Update the Google script".
 *
 * 1) Replace the SECRET below with a long random text (and put the SAME text in the
 *    server settings as GOOGLE_SCRIPT_SECRET).
 * 2) Left menu: Services (+) -> "Google Calendar API" -> Add.
 * 3) Run "authorize" once, then Deploy > Manage deployments > pencil > New version > Deploy.
 */
const SECRET = 'PASTE_A_LONG_RANDOM_TEXT_HERE';
const MEET_TOKEN = '__MEET_LINK__'; // placeholder the website puts in the email text
=======
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
>>>>>>> ae9c0337741534602ece59deb41f0ada407b45bb

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
<<<<<<< HEAD
    if (SECRET.indexOf('PASTE_') === 0) {
      return out({ ok: false, error: 'unauthorized - the LIVE script still has the placeholder secret. Paste your secret, Ctrl+S, then Deploy > Manage deployments > pencil > Version: New version > Deploy.' });
    }
    if (data.secret !== SECRET) {
=======
    if (!SECRET || SECRET === 'PASTE_A_LONG_RANDOM_TEXT_HERE' || data.secret !== SECRET) {
>>>>>>> ae9c0337741534602ece59deb41f0ada407b45bb
      return out({ ok: false, error: 'unauthorized' });
    }

    if (data.action === 'create') {
<<<<<<< HEAD
      const ev = {
        summary: data.summary,
        description: data.description,
        start: data.start,
        end: data.end,
        timeZone: data.timeZone,
        requestId: data.requestId,
      };
      const found = findByRequestId(ev.requestId);
      const event = found || insertEvent(ev);
      const meetLink = meetLinkOf(event);
      return out({ ok: Boolean(meetLink), eventId: event.id, meetLink: meetLink, error: meetLink ? undefined : 'No Meet link returned' });
    }

    if (data.action === 'booking') {
      return out(handleBooking(data));
    }

    if (data.action === 'sendMail') {
      if (!isEmail(data.to) || !data.subject) {
        return out({ ok: false, error: 'missing or invalid to/subject' });
      }
      sendOne({
        to: data.to,
        subject: data.subject,
        text: data.text,
        html: data.html,
        replyTo: data.replyTo,
        fromName: data.fromName,
      });
      return out({ ok: true, remainingToday: MailApp.getRemainingDailyQuota() });
    }

=======
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

>>>>>>> ae9c0337741534602ece59deb41f0ada407b45bb
    if (data.action === 'delete') {
      Calendar.Events.remove('primary', data.eventId, { sendUpdates: 'none' });
      return out({ ok: true });
    }

    return out({ ok: false, error: 'unknown action' });
  } catch (err) {
    return out({ ok: false, error: String(err) });
  }
}

<<<<<<< HEAD
// Creates the event, then sends each email: "withLink" wording if a Meet link exists,
// otherwise the "without" wording. A repeated request for the same payment returns the
// existing event and does NOT send the emails again.
function handleBooking(data) {
  const ev = data.event || {};
  let event = findByRequestId(ev.requestId);
  const duplicate = Boolean(event);
  let eventError = null;

  if (!event) {
    try {
      event = insertEvent(ev);
    } catch (err) {
      eventError = String(err);
    }
  }

  const meetLink = event ? meetLinkOf(event) : null;
  const mailed = [];
  if (!duplicate) {
    (data.emails || []).forEach(function (m) {
      try {
        const v = (meetLink ? m.withLink : m.without) || {};
        sendOne({
          to: m.to,
          subject: v.subject,
          text: fillLink(v.text, meetLink),
          html: fillLink(v.html, meetLink),
          replyTo: m.replyTo,
          fromName: m.fromName,
        });
        mailed.push(true);
      } catch (err) {
        mailed.push(false);
      }
    });
  }

  return {
    ok: true,
    meetLink: meetLink,
    eventId: event ? event.id : null,
    mailed: mailed,
    duplicate: duplicate,
    eventError: eventError,
  };
}

function insertEvent(ev) {
  return Calendar.Events.insert(
    {
      summary: ev.summary,
      description: ev.description,
      start: { dateTime: ev.start, timeZone: ev.timeZone },
      end: { dateTime: ev.end, timeZone: ev.timeZone },
      conferenceData: {
        createRequest: {
          requestId: ev.requestId,
          conferenceSolutionKey: { type: 'hangoutsMeet' },
        },
      },
      extendedProperties: { private: { requestId: String(ev.requestId || '') } },
    },
    'primary',
    { conferenceDataVersion: 1, sendUpdates: 'none' }
  );
}

// Finds an event created earlier for the same payment (so retries never duplicate it)
function findByRequestId(requestId) {
  if (!requestId) return null;
  const res = Calendar.Events.list('primary', {
    privateExtendedProperty: 'requestId=' + requestId,
    maxResults: 1,
    showDeleted: false,
  });
  return (res.items && res.items[0]) || null;
}

function meetLinkOf(event) {
  const video = ((event.conferenceData && event.conferenceData.entryPoints) || []).filter(
    function (p) {
      return p.entryPointType === 'video';
    }
  )[0];
  return event.hangoutLink || (video && video.uri) || null;
}

function fillLink(text, link) {
  return String(text || '').split(MEET_TOKEN).join(link || '');
}

function isEmail(v) {
  return typeof v === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v) && v.length <= 254;
}

// Sends one email from this Gmail account (shows as "<fromName> <anoracounselling@gmail.com>")
function sendOne(m) {
  if (!isEmail(m.to) || !m.subject) throw new Error('invalid email request');
  if (MailApp.getRemainingDailyQuota() < 1) throw new Error('daily email limit reached');
  const opts = {
    to: m.to,
    subject: m.subject,
    body: m.text || ' ',
    name: m.fromName || 'Anora Counseling',
  };
  if (m.html) opts.htmlBody = m.html;
  if (m.replyTo && isEmail(m.replyTo)) opts.replyTo = m.replyTo;
  MailApp.sendEmail(opts);
}

// Opening the web app URL in a browser shows this, so you can check it is live.
function doGet() {
  return out({
    ok: true,
    status: 'Anora calendar helper is running',
    secretSet: SECRET.indexOf('PASTE_') !== 0,
  });
}

// Run this ONCE from the editor (select "authorize" -> Run) to grant calendar + email permission.
function authorize() {
  Calendar.Calendars.get('primary');
  MailApp.getRemainingDailyQuota();
=======
// Opening the web app URL in a browser shows this, so you can check it is live.
function doGet() {
  return out({ ok: true, status: 'Anora calendar helper is running' });
}

// Run this ONCE from the editor (select "authorize" -> Run) to grant calendar permission.
function authorize() {
  Calendar.Calendars.get('primary');
>>>>>>> ae9c0337741534602ece59deb41f0ada407b45bb
}

function out(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
