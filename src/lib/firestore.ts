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
  serverTimestamp,
  type Timestamp,
  type DocumentData,
  type QueryDocumentSnapshot,
  type CollectionReference,
  type DocumentSnapshot
} from 'firebase/firestore';
import { db } from '../../firebase';

// Types for our data models
export interface User {
  id?: string;
  name?: string;
  email?: string;
  phone?: string;
  branch?: string;
  year?: number;
  emailVerified?: Date;
  username?: string;
  image?: string;
  role?: string;
  bio?: string;
  isAdmin?: boolean;
  github?: string;
  linkedin?: string;
}

export interface Core {
  id?: string;
  name: string;
  email?: string;
  branch: string;
  position: string;
  linkedin?: string;
  github?: string;
  imageSrc: string;
  year: number;
  order: number;
}

export interface TeamMember {
  id?: string;
  name: string;
  email?: string;
  branch: string;
  position: string;
  linkedin?: string;
  github?: string;
  imageSrc: string;
  year: number;
  order: number;
  phone?: string;
  bio?: string;
  role?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Event {
  id?: string;
  title: string;
  description?: string;
  brief?: string;
  image: string;
  cloudinaryUrl?: string;
  originalImagePath?: string;
  date: Date | string;
  time?: string;
  venue?: string;
  qr?: string;
  entryFee?: number;
  category: 'PREVIOUS' | 'UPCOMING' | 'CURRENT';
  type: 'SOLO' | 'TEAM';
  minTeamSize: number;
  maxTeamSize: number;
  maxTeams?: number;
  guests: string[];
  organizers?: string;
  contactPersons?: any[];
  year?: number;
  published: boolean;
  registrationsAvailable: boolean;
  participants?: any[];
  participantCount?: number;
  createdAt?: string;
  updatedAt?: string;
  searchTitle?: string;
  searchDescription?: string;
  status?: string;
  featured?: boolean;
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

export interface Team {
  id?: string;
  name: string;
  custid: string;
  email: string;
  name?: string;
  leaderId?: string;
  transactionId?: string;
  eventId?: string;
  branch: string;
  role: string;
  linkedin?: string;
  github?: string;
  imageLink?: string;
  position?: 'FIRST' | 'SECOND' | 'THIRD' | 'PARTICIPATION' | 'TO_BE_DETERMINED';
  attended?: boolean;
  isConfirmed?: boolean;
}

export interface Recruit {
  id?: string;
  name: string;
  dateOfBirth: Date | Timestamp;
  usn: string;
  yearOfStudy: string;
  branch: string;
  mobileNumber: string;
  personalEmail: string;
  collegeEmail?: string;
  membershipPlan: string;
  csiIdea: string;
  userId?: string; // Add user ID for permission checking
  createdAt?: Date;
  updatedAt?: Date;
  paymentStatus?: 'pending' | 'completed' | 'failed';
  paymentId?: string;
  orderId?: string;
}

// Generic Firestore Service Class (preserved from your original implementation)
export class FirestoreService<T> {
  private collectionRef: CollectionReference;

  constructor(collectionName: string) {
    this.collectionRef = collection(db, collectionName);
  }

  async getAll(): Promise<T[]> {
    try {
    const querySnapshot = await getDocs(this.collectionRef);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    })) as T[];
    } catch (error) {
      console.error(`Error getting all documents from ${this.collectionRef.path}:`, error);
      throw error;
    }
  }

  async getById(id: string): Promise<T | null> {
    try {
    const docRef = doc(this.collectionRef, id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data()
      } as T;
    }
    return null;
    } catch (error) {
      console.error(`Error getting document ${id} from ${this.collectionRef.path}:`, error);
      throw error;
    }
  }

  async create(data: Omit<T, 'id'>): Promise<T> {
    try {
    const docRef = await addDoc(this.collectionRef, {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    
    return {
      id: docRef.id,
      ...data
    } as T;
    } catch (error) {
      console.error(`Error creating document in ${this.collectionRef.path}:`, error);
      throw error;
    }
  }

  async createWithId(id: string, data: Omit<T, 'id'>): Promise<T> {
    try {
      const docRef = doc(this.collectionRef, id);
      await setDoc(docRef, {
        ...data,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      
      return {
        id,
        ...data
      } as T;
    } catch (error) {
      console.error(`Error creating document with ID ${id} in ${this.collectionRef.path}:`, error);
      throw error;
    }
  }

  async update(id: string, data: Partial<T>): Promise<void> {
    try {
      const docRef = doc(this.collectionRef, id);
      await updateDoc(docRef, {
        ...data,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error(`Error updating document ${id} in ${this.collectionRef.path}:`, error);
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    try {
    const docRef = doc(this.collectionRef, id);
    await deleteDoc(docRef);
    } catch (error) {
      console.error(`Error deleting document ${id} from ${this.collectionRef.path}:`, error);
      throw error;
    }
  }

  async findOne(field: string, value: unknown): Promise<T | null> {
    try {
      const q = query(this.collectionRef, where(field, '==', value), limit(1));
    const querySnapshot = await getDocs(q);
    
      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
      return {
          id: doc.id,
          ...doc.data()
      } as T;
    }
    return null;
    } catch (error) {
      console.error(`Error finding document with ${field}=${value} in ${this.collectionRef.path}:`, error);
      throw error;
    }
  }

  async findMany(field: string, value: unknown): Promise<T[]> {
    try {
      const q = query(this.collectionRef, where(field, '==', value));
    const querySnapshot = await getDocs(q);
    
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    })) as T[];
    } catch (error) {
      console.error(`Error finding documents with ${field}=${value} in ${this.collectionRef.path}:`, error);
      throw error;
    }
  }

  async findManyOrdered(orderByField: string, direction: 'asc' | 'desc' = 'desc'): Promise<T[]> {
    try {
    const q = query(this.collectionRef, orderBy(orderByField, direction));
    const querySnapshot = await getDocs(q);
    
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    })) as T[];
    } catch (error) {
      console.error(`Error getting ordered documents from ${this.collectionRef.path}:`, error);
      throw error;
    }
  }
}

// Enhanced Event Functions (from fork)
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
    console.error('Error getting all events:', error);
    throw error;
  }
}

export async function getEventsByYear(year: number): Promise<Event[]> {
  try {
    const eventsCollection = collection(db, 'events');
    const eventsQuery = query(
      eventsCollection,
      where('year', '==', year),
      orderBy('title', 'asc')
    );
    
    const querySnapshot = await getDocs(eventsQuery);
    const events: Event[] = [];
    
    querySnapshot.forEach((doc) => {
      events.push({ id: doc.id, ...doc.data() } as Event);
    });
    
    return events;
  } catch (error) {
    console.error(`Error getting events for year ${year}:`, error);
    throw error;
  }
}

export async function getEventsByCategory(category: 'PREVIOUS' | 'UPCOMING' | 'CURRENT'): Promise<Event[]> {
  try {
    const eventsCollection = collection(db, 'events');
    const eventsQuery = query(
      eventsCollection,
      where('category', '==', category),
      orderBy('date', 'desc')
    );
    
    const querySnapshot = await getDocs(eventsQuery);
    const events: Event[] = [];
    
    querySnapshot.forEach((doc) => {
      events.push({ id: doc.id, ...doc.data() } as Event);
    });
    
    return events;
  } catch (error) {
    console.error(`Error getting events for category ${category}:`, error);
    throw error;
  }
}

export async function getEventById(eventId: string): Promise<Event | null> {
  try {
    const eventDoc = doc(db, 'events', eventId);
    const eventSnapshot = await getDoc(eventDoc);
    
    if (eventSnapshot.exists()) {
      return { id: eventSnapshot.id, ...eventSnapshot.data() } as Event;
    }
    
    return null;
  } catch (error) {
    console.error(`Error getting event ${eventId}:`, error);
    throw error;
  }
}

export async function searchEvents(searchTerm: string): Promise<Event[]> {
  try {
    const eventsCollection = collection(db, 'events');
    const eventsQuery = query(
      eventsCollection,
      where('searchTitle', '>=', searchTerm.toLowerCase()),
      where('searchTitle', '<=', searchTerm.toLowerCase() + '\uf8ff'),
      orderBy('searchTitle', 'asc')
    );
    
    const querySnapshot = await getDocs(eventsQuery);
    const events: Event[] = [];
    
    querySnapshot.forEach((doc) => {
      events.push({ id: doc.id, ...doc.data() } as Event);
    });
    
    return events;
  } catch (error) {
    console.error(`Error searching events with term "${searchTerm}":`, error);
    throw error;
  }
}

export async function getFeaturedEvents(limitCount: number = 6): Promise<Event[]> {
  try {
    const eventsCollection = collection(db, 'events');
    const eventsQuery = query(
      eventsCollection,
      where('featured', '==', true),
      orderBy('date', 'desc'),
      limit(limitCount)
    );
    
    const querySnapshot = await getDocs(eventsQuery);
    const events: Event[] = [];
    
    querySnapshot.forEach((doc) => {
      events.push({ id: doc.id, ...doc.data() } as Event);
    });
    
    return events;
  } catch (error) {
    console.error('Error getting featured events:', error);
    throw error;
  }
}

export async function getRecentEvents(limitCount: number = 10): Promise<Event[]> {
  try {
    const eventsCollection = collection(db, 'events');
    const eventsQuery = query(
      eventsCollection,
      orderBy('date', 'desc'),
      limit(limitCount)
    );
    
    const querySnapshot = await getDocs(eventsQuery);
    const events: Event[] = [];
    
    querySnapshot.forEach((doc) => {
      events.push({ id: doc.id, ...doc.data() } as Event);
    });
    
    return events;
  } catch (error) {
    console.error('Error getting recent events:', error);
    throw error;
  }
}

export async function getEventsPaginated(
  pageSize: number = 10, 
  lastDoc?: DocumentSnapshot
): Promise<{ events: Event[], lastDoc: DocumentSnapshot | null }> {
  try {
    const eventsCollection = collection(db, 'events');
    let eventsQuery = query(
      eventsCollection,
      orderBy('date', 'desc'),
      limit(pageSize)
    );
    
    if (lastDoc) {
      eventsQuery = query(
        eventsCollection,
        orderBy('date', 'desc'),
        startAfter(lastDoc),
        limit(pageSize)
      );
    }
    
    const querySnapshot = await getDocs(eventsQuery);
    const events: Event[] = [];
    
    querySnapshot.forEach((doc) => {
      events.push({ id: doc.id, ...doc.data() } as Event);
    });
    
    const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1] || null;
    
    return {
      events,
      lastDoc: lastVisible
    };
  } catch (error) {
    console.error('Error getting paginated events:', error);
    throw error;
  }
}

export async function getEventsMetadata(): Promise<EventsMetadata | null> {
  try {
    const metadataDoc = doc(db, 'metadata', 'events');
    const metadataSnapshot = await getDoc(metadataDoc);
    
    if (metadataSnapshot.exists()) {
      return metadataSnapshot.data() as EventsMetadata;
    }
    
    return null;
  } catch (error) {
    console.error('Error getting events metadata:', error);
    throw error;
  }
}

export async function getEventsStatistics() {
  try {
    const events = await getAllEvents();
    
    const totalEvents = events.length;
    const eventsByYear = events.reduce((acc, event) => {
      const year = event.year || new Date(event.date).getFullYear();
      acc[year] = (acc[year] || 0) + 1;
      return acc;
    }, {} as Record<number, number>);
    
    const eventsByCategory = events.reduce((acc, event) => {
      acc[event.category] = (acc[event.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const featuredEvents = events.filter(event => event.featured).length;
    
    return {
      totalEvents,
      eventsByYear,
      eventsByCategory,
      featuredEvents
    };
  } catch (error) {
    console.error('Error getting events statistics:', error);
    throw error;
  }
}

// Enhanced Recruit Functions (from fork)
export class RecruitService {
  private collectionRef = collection(db, 'recruits');

  async create(recruitData: Omit<Recruit, 'id' | 'createdAt' | 'updatedAt'>): Promise<Recruit> {
    try {
      const docRef = await addDoc(this.collectionRef, {
        ...recruitData,
        createdAt: new Date(),
        updatedAt: new Date(),
        paymentStatus: 'pending'
      });
      
      return {
        id: docRef.id,
        ...recruitData,
        createdAt: new Date(),
        updatedAt: new Date(),
        paymentStatus: 'pending'
      };
    } catch (error) {
      console.error('Error creating recruit:', error);
      throw error;
    }
  }

  async findById(id: string): Promise<Recruit | null> {
    try {
      const recruitDoc = doc(this.collectionRef, id);
      const recruitSnapshot = await getDoc(recruitDoc);
      
      if (recruitSnapshot.exists()) {
        const data = recruitSnapshot.data();
        return {
          id: recruitSnapshot.id,
          ...data,
          dateOfBirth: data.dateOfBirth?.toDate?.() || data.dateOfBirth,
          createdAt: data.createdAt?.toDate?.() || data.createdAt,
          updatedAt: data.updatedAt?.toDate?.() || data.updatedAt
        } as Recruit;
      }
      
      return null;
    } catch (error) {
      console.error(`Error finding recruit ${id}:`, error);
      throw error;
    }
  }

  async findManyOrdered(orderField: keyof Recruit, direction: 'asc' | 'desc' = 'desc'): Promise<Recruit[]> {
    try {
      const recruitsQuery = query(
        this.collectionRef,
        orderBy(orderField as string, direction)
      );
      
      const querySnapshot = await getDocs(recruitsQuery);
      const recruits: Recruit[] = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        recruits.push({
          id: doc.id,
          ...data,
          dateOfBirth: data.dateOfBirth?.toDate?.() || data.dateOfBirth,
          createdAt: data.createdAt?.toDate?.() || data.createdAt,
          updatedAt: data.updatedAt?.toDate?.() || data.updatedAt
        } as Recruit);
      });
      
      return recruits;
    } catch (error) {
      console.error(`Error getting ordered recruits by ${orderField}:`, error);
      throw error;
    }
  }

  async update(id: string, updateData: Partial<Omit<Recruit, 'id' | 'createdAt'>>): Promise<Recruit> {
    try {
      const recruitDoc = doc(this.collectionRef, id);
      await updateDoc(recruitDoc, {
        ...updateData,
        updatedAt: new Date()
      });
      
      const updatedRecruit = await this.findById(id);
      if (!updatedRecruit) {
        throw new Error('Recruit not found after update');
      }
      
      return updatedRecruit;
    } catch (error) {
      console.error(`Error updating recruit ${id}:`, error);
      throw error;
    }
  }

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
  }

  async findByPaymentStatus(status: 'pending' | 'completed' | 'failed'): Promise<Recruit[]> {
    try {
      const recruitsQuery = query(
        this.collectionRef,
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
          dateOfBirth: data.dateOfBirth?.toDate?.() || data.dateOfBirth,
          createdAt: data.createdAt?.toDate?.() || data.createdAt,
          updatedAt: data.updatedAt?.toDate?.() || data.updatedAt
        } as Recruit);
      });
      
      return recruits;
    } catch (error) {
      console.error(`Error finding recruits with payment status ${status}:`, error);
      throw error;
    }
  }

  async search(searchTerm: string): Promise<Recruit[]> {
    try {
      const recruitsQuery = query(
        this.collectionRef,
        where('name', '>=', searchTerm),
        where('name', '<=', searchTerm + '\uf8ff'),
        orderBy('name', 'asc')
      );
      
      const querySnapshot = await getDocs(recruitsQuery);
      const recruits: Recruit[] = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        recruits.push({
          id: doc.id,
          ...data,
          dateOfBirth: data.dateOfBirth?.toDate?.() || data.dateOfBirth,
          createdAt: data.createdAt?.toDate?.() || data.createdAt,
          updatedAt: data.updatedAt?.toDate?.() || data.updatedAt
        } as Recruit);
      });
      
      return recruits;
    } catch (error) {
      console.error(`Error searching recruits with term "${searchTerm}":`, error);
      throw error;
    }
  }

  async getStatistics() {
    try {
      const allRecruits = await this.findManyOrdered('createdAt');
      
      const totalRecruits = allRecruits.length;
      const pendingPayments = allRecruits.filter(r => r.paymentStatus === 'pending').length;
      const completedPayments = allRecruits.filter(r => r.paymentStatus === 'completed').length;
      const failedPayments = allRecruits.filter(r => r.paymentStatus === 'failed').length;
      
      const recruitsByBranch = allRecruits.reduce((acc, recruit) => {
        acc[recruit.branch] = (acc[recruit.branch] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      
      const recruitsByYear = allRecruits.reduce((acc, recruit) => {
        acc[recruit.yearOfStudy] = (acc[recruit.yearOfStudy] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      
      return {
        totalRecruits,
        pendingPayments,
        completedPayments,
        failedPayments,
        recruitsByBranch,
        recruitsByYear
      };
    } catch (error) {
      console.error('Error getting recruit statistics:', error);
      throw error;
    }
  }
}

// Export service instances
export const recruitService = new RecruitService(); 