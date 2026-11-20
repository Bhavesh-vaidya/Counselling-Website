// Run: npm run test-calendar
// Creates a test event (tomorrow 6:00 AM, 15 min), prints the Meet link, then deletes the event.
import { calendarConfigured, createMeetEvent, deleteEvent } from './calendar.js';

if (!calendarConfigured()) {
  console.error('Google Calendar is not set up yet. Add GOOGLE_SCRIPT_URL and GOOGLE_SCRIPT_SECRET to server/.env (see SETUP.md, "Google Meet links").');
  process.exit(1);
}
console.log(`Using script secret of ${(process.env.GOOGLE_SCRIPT_SECRET || '').trim().length} characters from server/.env`);
try {
  const tomorrow = new Date(Date.now() + 24 * 3600 * 1000).toDateString();
  const { eventId, meetLink } = await createMeetEvent({
    summary: 'TEST - Anora Counseling (safe to ignore)',
    description: 'Created by npm run test-calendar',
    dateStr: tomorrow,
    timeStr: '06:00 AM',
    minutes: 15,
    requestId: `test-${Date.now()}`,
  });
  console.log('Google Calendar OK. Test Meet link:', meetLink);
  await deleteEvent(eventId);
  console.log('Test event removed from the calendar.');
} catch (err) {
  console.error('FAILED:', err.message);
  process.exit(1);
}
