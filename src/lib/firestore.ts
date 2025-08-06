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
  serverTimestamp,
  type Timestamp,
  type DocumentData,
  type QueryDocumentSnapshot,
  type CollectionReference
} from 'firebase/firestore';
import { db } from '../../firebase';

// Check if we're on the server side and use admin SDK
// let isServer = false;
// try {
//   isServer = typeof window === 'undefined';
// } catch {
//   isServer = true;
// }

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
  date: Date;
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
  published: boolean;
  registrationsAvailable: boolean;
}

export interface Team {
  id?: string;
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
}

// Generic CRUD operations
export class FirestoreService<T> {
  private collectionRef: CollectionReference;

  constructor(collectionName: string) {
    this.collectionRef = collection(db, collectionName);
  }

  async getAll(): Promise<T[]> {
    const querySnapshot = await getDocs(this.collectionRef);
    const result = querySnapshot.docs.map(docSnapshot => ({
      id: docSnapshot.id,
      ...docSnapshot.data()
    })) as T[];
    return result;
  }

  async getById(id: string): Promise<T | null> {
    const docRef = doc(this.collectionRef, id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data()
      } as T;
    }
    return null;
  }

  async create(data: Omit<T, 'id'>): Promise<T> {
    const docRef = await addDoc(this.collectionRef, {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    
    return {
      id: docRef.id,
      ...data
    } as T;
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
        id: docRef.id,
        ...data
      } as T;
    } catch (error) {
      console.error('Error in createWithId:', error);
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
      console.error('Error in update:', error);
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    const docRef = doc(this.collectionRef, id);
    await deleteDoc(docRef);
  }

  async findOne(field: string, value: unknown): Promise<T | null> {
    const q = query(this.collectionRef, where(field, "==", value), limit(1));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty && querySnapshot.docs[0]) {
      const docSnapshot: QueryDocumentSnapshot = querySnapshot.docs[0];
      return {
        id: docSnapshot.id,
        ...docSnapshot.data()
      } as T;
    }
    return null;
  }

  async findMany(field: string, value: unknown): Promise<T[]> {
    const q = query(this.collectionRef, where(field, "==", value));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(docSnapshot => ({
      id: docSnapshot.id,
      ...docSnapshot.data()
    })) as T[];
  }

  async findManyOrdered(orderByField: string, direction: 'asc' | 'desc' = 'desc'): Promise<T[]> {
    const q = query(this.collectionRef, orderBy(orderByField, direction));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(docSnapshot => ({
      id: docSnapshot.id,
      ...docSnapshot.data()
    })) as T[];
  }
}

// Specific service instances
export const userService = new FirestoreService<User>('users');
export const coreService = new FirestoreService<Core>('core');
export const teamMemberService = new FirestoreService<TeamMember>('team-members');
export const eventService = new FirestoreService<Event>('events');
export const teamService = new FirestoreService<Team>('teams');
export const recruitService = new FirestoreService<Recruit>('recruits'); 