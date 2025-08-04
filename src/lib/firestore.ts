import { db } from '../../firebase';
import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  setDoc,
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  startAfter,
  DocumentSnapshot
} from 'firebase/firestore';

// Types
export interface Event {
  id: string;
  title: string;
  description: string;
  brief: string;
  image: string;
  cloudinaryUrl?: string;
  originalImagePath?: string;
  date: string;
  time: string;
  venue: string;
  category: 'PREVIOUS' | 'UPCOMING' | 'CURRENT';
  type: 'SOLO' | 'TEAM';
  entryFee: number;
  organizers: string;
  contactPersons: any[];
  year: number;
  published: boolean;
  registrationsAvailable: boolean;
  participants: any[];
  participantCount: number;
  createdAt: string;
  updatedAt: string;
  searchTitle: string;
  searchDescription: string;
  status: string;
  featured: boolean;
}

export interface EventsMetadata {
  extractedAt: string;
  source: string;
  totalEvents: number;
  firestoreMigration?: {
    migratedAt: string;
    version: string;
    structure: string;
  };
  cloudinaryMigration?: {
    migratedAt: string;
    updatedEvents: number;
    totalMappings: number;
  };
}

/**
 * Get all events from Firestore
 */
export async function getAllEvents(): Promise<Event[]> {
  try {
    const eventsCollection = collection(db, 'events');
    const eventsQuery = query(
      eventsCollection, 
      orderBy('year', 'desc'), 
      orderBy('title', 'asc')
    );
    
    const querySnapshot = await getDocs(eventsQuery);
    const events: Event[] = [];
    
    querySnapshot.forEach((doc) => {
      events.push({ id: doc.id, ...doc.data() } as Event);
    });
    
    return events;
  } catch (error) {
    console.error('Error fetching all events:', error);
    throw error;
  }
}

/**
 * Get events by year
 */
export async function getEventsByYear(year: number): Promise<Event[]> {
  try {
    const eventsCollection = collection(db, 'events');
    const eventsQuery = query(
      eventsCollection,
      where('year', '==', year)
    );
    
    const querySnapshot = await getDocs(eventsQuery);
    const events: Event[] = [];
    
    querySnapshot.forEach((doc) => {
      events.push({ id: doc.id, ...doc.data() } as Event);
    });
    
    // Sort by title on the client side
    events.sort((a, b) => a.title.localeCompare(b.title));
    
    return events;
  } catch (error) {
    console.error(`Error fetching events for year ${year}:`, error);
    throw error;
  }
}

/**
 * Get events by category
 */
export async function getEventsByCategory(category: 'PREVIOUS' | 'UPCOMING' | 'CURRENT'): Promise<Event[]> {
  try {
    const eventsCollection = collection(db, 'events');
    const eventsQuery = query(
      eventsCollection,
      where('category', '==', category),
      orderBy('year', 'desc'),
      orderBy('title', 'asc')
    );
    
    const querySnapshot = await getDocs(eventsQuery);
    const events: Event[] = [];
    
    querySnapshot.forEach((doc) => {
      events.push({ id: doc.id, ...doc.data() } as Event);
    });
    
    return events;
  } catch (error) {
    console.error(`Error fetching events for category ${category}:`, error);
    throw error;
  }
}

/**
 * Get single event by ID
 */
export async function getEventById(eventId: string): Promise<Event | null> {
  try {
    const eventDoc = doc(db, 'events', eventId);
    const docSnapshot = await getDoc(eventDoc);
    
    if (docSnapshot.exists()) {
      return { id: docSnapshot.id, ...docSnapshot.data() } as Event;
    } else {
      return null;
    }
  } catch (error) {
    console.error(`Error fetching event ${eventId}:`, error);
    throw error;
  }
}

/**
 * Search events by title or description
 */
export async function searchEvents(searchTerm: string): Promise<Event[]> {
  try {
    const eventsCollection = collection(db, 'events');
    const searchTermLower = searchTerm.toLowerCase();
    
    // Search by title
    const titleQuery = query(
      eventsCollection,
      where('searchTitle', '>=', searchTermLower),
      where('searchTitle', '<=', searchTermLower + '\uf8ff'),
      orderBy('searchTitle'),
      limit(20)
    );
    
    const titleSnapshot = await getDocs(titleQuery);
    const events: Event[] = [];
    
    titleSnapshot.forEach((doc) => {
      events.push({ id: doc.id, ...doc.data() } as Event);
    });
    
    // Remove duplicates and return
    const uniqueEvents = events.filter((event, index, self) => 
      index === self.findIndex(e => e.id === event.id)
    );
    
    return uniqueEvents;
  } catch (error) {
    console.error('Error searching events:', error);
    throw error;
  }
}

/**
 * Get featured events
 */
export async function getFeaturedEvents(limitCount: number = 6): Promise<Event[]> {
  try {
    const eventsCollection = collection(db, 'events');
    const featuredQuery = query(
      eventsCollection,
      where('featured', '==', true),
      orderBy('year', 'desc'),
      limit(limitCount)
    );
    
    const querySnapshot = await getDocs(featuredQuery);
    const events: Event[] = [];
    
    querySnapshot.forEach((doc) => {
      events.push({ id: doc.id, ...doc.data() } as Event);
    });
    
    return events;
  } catch (error) {
    console.error('Error fetching featured events:', error);
    throw error;
  }
}

/**
 * Get recent events
 */
export async function getRecentEvents(limitCount: number = 10): Promise<Event[]> {
  try {
    const eventsCollection = collection(db, 'events');
    const recentQuery = query(
      eventsCollection,
      where('published', '==', true),
      orderBy('year', 'desc'),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    );
    
    const querySnapshot = await getDocs(recentQuery);
    const events: Event[] = [];
    
    querySnapshot.forEach((doc) => {
      events.push({ id: doc.id, ...doc.data() } as Event);
    });
    
    return events;
  } catch (error) {
    console.error('Error fetching recent events:', error);
    throw error;
  }
}

/**
 * Get events with pagination
 */
export async function getEventsPaginated(
  pageSize: number = 10, 
  lastDoc?: DocumentSnapshot
): Promise<{ events: Event[], lastDoc: DocumentSnapshot | null }> {
  try {
    const eventsCollection = collection(db, 'events');
    let eventsQuery = query(
      eventsCollection,
      where('published', '==', true),
      orderBy('year', 'desc'),
      orderBy('title', 'asc'),
      limit(pageSize)
    );
    
    if (lastDoc) {
      eventsQuery = query(
        eventsCollection,
        where('published', '==', true),
        orderBy('year', 'desc'),
        orderBy('title', 'asc'),
        startAfter(lastDoc),
        limit(pageSize)
      );
    }
    
    const querySnapshot = await getDocs(eventsQuery);
    const events: Event[] = [];
    let newLastDoc: DocumentSnapshot | null = null;
    
    querySnapshot.forEach((doc) => {
      events.push({ id: doc.id, ...doc.data() } as Event);
      newLastDoc = doc;
    });
    
    return { events, lastDoc: newLastDoc };
  } catch (error) {
    console.error('Error fetching paginated events:', error);
    throw error;
  }
}

/**
 * Get events metadata
 */
export async function getEventsMetadata(): Promise<EventsMetadata | null> {
  try {
    const metadataDoc = doc(db, 'metadata', 'events');
    const docSnapshot = await getDoc(metadataDoc);
    
    if (docSnapshot.exists()) {
      return docSnapshot.data() as EventsMetadata;
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error fetching events metadata:', error);
    throw error;
  }
}

/**
 * Get events statistics
 */
export async function getEventsStatistics() {
  try {
    const events = await getAllEvents();
    
    const stats = {
      totalEvents: events.length,
      eventsByYear: {} as Record<string, number>,
      eventsByCategory: {} as Record<string, number>,
      eventsByType: {} as Record<string, number>,
      eventsWithImages: 0,
      publishedEvents: 0
    };
    
    events.forEach(event => {
      // By year
      const year = event.year.toString();
      stats.eventsByYear[year] = (stats.eventsByYear[year] || 0) + 1;
      
      // By category
      stats.eventsByCategory[event.category] = (stats.eventsByCategory[event.category] || 0) + 1;
      
      // By type
      stats.eventsByType[event.type] = (stats.eventsByType[event.type] || 0) + 1;
      
      // With images
      if (event.image && event.image !== '') {
        stats.eventsWithImages++;
      }
      
      // Published
      if (event.published) {
        stats.publishedEvents++;
      }
    });
    
    return stats;
  } catch (error) {
    console.error('Error calculating events statistics:', error);
    throw error;
  }
}
