import * as Calendar from "expo-calendar";

export type CalendarEvent = {
  id: string;
  title: string;
  start: Date;
  end: Date;
};

export async function getTodayEvents(): Promise<CalendarEvent[]> {
  const { status } = await Calendar.requestCalendarPermissionsAsync();
  if (status !== "granted") return [];

  const calendars = await Calendar.getCalendarsAsync(
    Calendar.EntityTypes.EVENT
  );

  const start = new Date();
  start.setHours(0, 0, 0, 0);

  const end = new Date();
  end.setHours(23, 59, 59, 999);

  const events = await Calendar.getEventsAsync(
    calendars.map((c) => c.id),
    start,
    end
  );

  return events.map((e) => ({
    id: e.id,
    title: e.title || "(no title)",
    start: new Date(e.startDate),
    end: new Date(e.endDate),
  }));
}