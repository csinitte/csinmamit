import { db } from '../../firebase';
import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  startAfter,
  DocumentSnapshot,
  Timestamp
} from 'firebase/firestore';

// Types
export interface Recruit {
  id: string;
  name: string;
  dateOfBirth: Date;
  usn: string;
  yearOfStudy: string;
  branch: string;
  mobileNumber: string;
  personalEmail: string;
  collegeEmail?: string;
  membershipPlan: string;
  csiIdea: string;
  createdAt: Date;
  updatedAt: Date;
  paymentStatus?: 'pending' | 'completed' | 'failed';
  paymentId?: string;
  orderId?: string;
}

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

// Recruit Service
export const recruitService = {
  /**
   * Create a new recruit entry
   */
  async create(recruitData: Omit<Recruit, 'id' | 'createdAt' | 'updatedAt'>): Promise<Recruit> {
    try {
      const now = new Date();
      const recruitsCollection = collection(db, 'recruits');
      
      const newRecruit = {
        ...recruitData,
        createdAt: now,
        updatedAt: now,
        paymentStatus: 'pending' as const
      };
      
      const docRef = await addDoc(recruitsCollection, newRecruit);
      
      return {
        id: docRef.id,
        ...newRecruit
      };
    } catch (error) {
      console.error('Error creating recruit:', error);
      throw error;
    }
  },

  /**
   * Get recruit by ID
   */
  async findById(id: string): Promise<Recruit | null> {
    try {
      const recruitDoc = doc(db, 'recruits', id);
      const docSnapshot = await getDoc(recruitDoc);
      
      if (docSnapshot.exists()) {
        const data = docSnapshot.data();
        return {
          id: docSnapshot.id,
          ...data,
          dateOfBirth: data.dateOfBirth instanceof Timestamp ? data.dateOfBirth.toDate() : data.dateOfBirth,
          createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : data.createdAt,
          updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate() : data.updatedAt,
        } as Recruit;
      } else {
        return null;
      }
    } catch (error) {
      console.error(`Error fetching recruit ${id}:`, error);
      throw error;
    }
  },

  /**
   * Get all recruits with ordering
   */
  async findManyOrdered(orderField: keyof Recruit, direction: 'asc' | 'desc' = 'desc'): Promise<Recruit[]> {
    try {
      const recruitsCollection = collection(db, 'recruits');
      const recruitsQuery = query(
        recruitsCollection,
        orderBy(orderField, direction)
      );
      
      const querySnapshot = await getDocs(recruitsQuery);
      const recruits: Recruit[] = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        recruits.push({
          id: doc.id,
          ...data,
          dateOfBirth: data.dateOfBirth instanceof Timestamp ? data.dateOfBirth.toDate() : data.dateOfBirth,
          createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : data.createdAt,
          updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate() : data.updatedAt,
        } as Recruit);
      });
      
      return recruits;
    } catch (error) {
      console.error('Error fetching recruits:', error);
      throw error;
    }
  },

  /**
   * Update recruit by ID
   */
  async update(id: string, updateData: Partial<Omit<Recruit, 'id' | 'createdAt'>>): Promise<Recruit> {
    try {
      const recruitDoc = doc(db, 'recruits', id);
      const updatePayload = {
        ...updateData,
        updatedAt: new Date()
      };
      
      await updateDoc(recruitDoc, updatePayload);
      
      // Return updated recruit
      const updatedRecruit = await this.findById(id);
      if (!updatedRecruit) {
        throw new Error('Failed to fetch updated recruit');
      }
      
      return updatedRecruit;
    } catch (error) {
      console.error(`Error updating recruit ${id}:`, error);
      throw error;
    }
  },

  /**
   * Update payment status
   */
  async updatePaymentStatus(id: string, paymentStatus: 'pending' | 'completed' | 'failed', paymentId?: string, orderId?: string): Promise<Recruit> {
    try {
      const updateData: Partial<Recruit> = {
        paymentStatus,
        updatedAt: new Date()
      };
      
      if (paymentId) updateData.paymentId = paymentId;
      if (orderId) updateData.orderId = orderId;
      
      return await this.update(id, updateData);
    } catch (error) {
      console.error(`Error updating payment status for recruit ${id}:`, error);
      throw error;
    }
  },

  /**
   * Get recruits by payment status
   */
  async findByPaymentStatus(status: 'pending' | 'completed' | 'failed'): Promise<Recruit[]> {
    try {
      const recruitsCollection = collection(db, 'recruits');
      const recruitsQuery = query(
        recruitsCollection,
        where('paymentStatus', '==', status),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(recruitsQuery);
      const recruits: Recruit[] = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        recruits.push({
          id: doc.id,
          ...data,
          dateOfBirth: data.dateOfBirth instanceof Timestamp ? data.dateOfBirth.toDate() : data.dateOfBirth,
          createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : data.createdAt,
          updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate() : data.updatedAt,
        } as Recruit);
      });
      
      return recruits;
    } catch (error) {
      console.error(`Error fetching recruits by payment status ${status}:`, error);
      throw error;
    }
  },

  /**
   * Search recruits by name or USN
   */
  async search(searchTerm: string): Promise<Recruit[]> {
    try {
      const recruitsCollection = collection(db, 'recruits');
      const searchTermLower = searchTerm.toLowerCase();
      
      // Search by name (you might want to add a searchName field for better performance)
      const nameQuery = query(
        recruitsCollection,
        where('name', '>=', searchTermLower),
        where('name', '<=', searchTermLower + '\uf8ff'),
        limit(20)
      );
      
      const querySnapshot = await getDocs(nameQuery);
      const recruits: Recruit[] = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        recruits.push({
          id: doc.id,
          ...data,
          dateOfBirth: data.dateOfBirth instanceof Timestamp ? data.dateOfBirth.toDate() : data.dateOfBirth,
          createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : data.createdAt,
          updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate() : data.updatedAt,
        } as Recruit);
      });
      
      return recruits;
    } catch (error) {
      console.error('Error searching recruits:', error);
      throw error;
    }
  },

  /**
   * Get recruit statistics
   */
  async getStatistics() {
    try {
      const recruits = await this.findManyOrdered('createdAt', 'desc');
      
      const stats = {
        totalRecruits: recruits.length,
        recruitsByYear: {} as Record<string, number>,
        recruitsByBranch: {} as Record<string, number>,
        recruitsByMembershipPlan: {} as Record<string, number>,
        recruitsByPaymentStatus: {} as Record<string, number>,
        completedPayments: 0,
        pendingPayments: 0
      };
      
      recruits.forEach(recruit => {
        // By year of study
        stats.recruitsByYear[recruit.yearOfStudy] = (stats.recruitsByYear[recruit.yearOfStudy] || 0) + 1;
        
        // By branch
        stats.recruitsByBranch[recruit.branch] = (stats.recruitsByBranch[recruit.branch] || 0) + 1;
        
        // By membership plan
        stats.recruitsByMembershipPlan[recruit.membershipPlan] = (stats.recruitsByMembershipPlan[recruit.membershipPlan] || 0) + 1;
        
        // By payment status
        const paymentStatus = recruit.paymentStatus || 'pending';
        stats.recruitsByPaymentStatus[paymentStatus] = (stats.recruitsByPaymentStatus[paymentStatus] || 0) + 1;
        
        if (paymentStatus === 'completed') {
          stats.completedPayments++;
        } else if (paymentStatus === 'pending') {
          stats.pendingPayments++;
        }
      });
      
      return stats;
    } catch (error) {
      console.error('Error calculating recruit statistics:', error);
      throw error;
    }
  }
};
