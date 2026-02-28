import { useEffect, useState } from "react";
import { getTodayEvents, CalendarEvent } from "../services/calendarService";

export function useEvents() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);

  useEffect(() => {
    getTodayEvents().then(setEvents);
  }, []);

  return events;
}