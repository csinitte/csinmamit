import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { getEventsByYear } from '~/lib/firestore';
import type { Event } from '~/lib/firestore';

interface EventsListProps {
  date: string;
}

const EventsList: React.FC<EventsListProps> = ({ date }) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

    useEffect(() => {
      const fetchEvents = async () => {
        try {
          setLoading(true);
          setError(null);
          const yearNumber = parseInt(date);
          const fetchedEvents = await getEventsByYear(yearNumber);
          // Filter out the Web Designing Workshop event
          const filteredEvents = fetchedEvents.filter(
            event => !(event.title === 'Web Designing Workshop' && event.year === 2019)
          );
          setEvents(filteredEvents);
        } catch (err) {
          console.error('Error fetching events:', err);
          setError('Failed to load events');
        } finally {
          setLoading(false);
        }
      };

      void fetchEvents();
    }, [date]);

  if (loading) {
    return (
      <div className="text-center py-8">
        <p className="text-sm sm:text-base text-gray-500">Loading events...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-sm sm:text-base text-red-500">{error}</p>
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-sm sm:text-base text-gray-500">No events found for {date}-{parseInt(date) + 1}</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mt-6 sm:mt-8 px-4 sm:px-0">
      {events.map((event) => (
        <div 
          key={event.id} 
          className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 sm:p-6 hover:shadow-lg transition-shadow"
        >
          {event.cloudinaryUrl && (
            <div className="relative w-full h-40 sm:h-48 mb-3 sm:mb-4">
              <Image
                src={event.cloudinaryUrl}
                alt={event.title}
                className="object-cover rounded-md"
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                priority={events.indexOf(event) === 0}
                {...(events.indexOf(event) !== 0 && { loading: "lazy" })}
              />
            </div>
          )}
          <h3 className="text-base sm:text-lg lg:text-xl font-bold mb-2 line-clamp-2">
            {event.title}
          </h3>
        </div>
      ))}
    </div>
  );
};

export default EventsList;
