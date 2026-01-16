/**
 * Seed Data Script for Firebase Firestore
 * 
 * Run this script to populate your Firebase database with initial data.
 * You can execute this from browser console or create a separate script.
 */

import { auth, db } from '../lib/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, collection, addDoc, serverTimestamp } from 'firebase/firestore';

// Demo users
const demoUsers = [
  {
    email: 'admin@event.com',
    password: 'admin123',
    name: 'Admin User',
    role: 'admin',
  },
  {
    email: 'organizer@event.com',
    password: 'organizer123',
    name: 'Sarah Williams',
    role: 'organizer',
  },
  {
    email: 'attendee@event.com',
    password: 'attendee123',
    name: 'John Doe',
    role: 'attendee',
  },
];

// Demo events
const demoEvents = [
  {
    title: 'Tech Conference 2026',
    description: 'Annual technology conference featuring the latest innovations in AI, cloud computing, and software development.',
    date: '2026-03-15',
    time: '09:00 AM',
    location: 'San Francisco Convention Center',
    capacity: 500,
    registered: 342,
    status: 'upcoming',
    category: 'Technology',
    imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80',
  },
  {
    title: 'Music Festival',
    description: 'Three-day music festival featuring top artists from around the world.',
    date: '2026-07-20',
    time: '02:00 PM',
    location: 'Central Park, New York',
    capacity: 10000,
    registered: 8456,
    status: 'upcoming',
    category: 'Music',
    imageUrl: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800&q=80',
  },
  {
    title: 'Business Summit',
    description: 'Network with industry leaders and discover new business opportunities.',
    date: '2026-05-10',
    time: '08:30 AM',
    location: 'London Business Center',
    capacity: 300,
    registered: 287,
    status: 'upcoming',
    category: 'Business',
    imageUrl: 'https://images.unsplash.com/photo-1591115765373-5207764f72e7?w=800&q=80',
  },
  {
    title: 'Art Exhibition',
    description: 'Showcase of contemporary art from emerging artists.',
    date: '2025-12-05',
    time: '11:00 AM',
    location: 'Paris Art Gallery',
    capacity: 200,
    registered: 180,
    status: 'past',
    category: 'Art',
    imageUrl: 'https://images.unsplash.com/photo-1577083552431-6e5fd01988ec?w=800&q=80',
  },
];

/**
 * Create demo users in Firebase Authentication and Firestore
 */
export const seedUsers = async () => {
  console.log('🌱 Seeding users...');
  const createdUsers = [];

  for (const userData of demoUsers) {
    try {
      // Create auth user
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        userData.email,
        userData.password
      );
      
      const user = userCredential.user;
      
      // Create user document in Firestore
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        email: userData.email,
        name: userData.name,
        role: userData.role,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      createdUsers.push({ uid: user.uid, ...userData });
      console.log(`✅ Created user: ${userData.email} (${userData.role})`);
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        console.log(`ℹ️ User already exists: ${userData.email}`);
      } else {
        console.error(`❌ Error creating user ${userData.email}:`, error.message);
      }
    }
  }

  return createdUsers;
};

/**
 * Create demo events in Firestore
 */
export const seedEvents = async (organizerUid) => {
  console.log('🌱 Seeding events...');

  for (const eventData of demoEvents) {
    try {
      await addDoc(collection(db, 'events'), {
        ...eventData,
        organizerId: organizerUid,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      console.log(`✅ Created event: ${eventData.title}`);
    } catch (error) {
      console.error(`❌ Error creating event ${eventData.title}:`, error.message);
    }
  }
};

/**
 * Main seed function
 * 
 * Usage:
 * 1. Open browser console
 * 2. Import this module
 * 3. Run: import { seedDatabase } from './utils/seedData'
 * 4. Run: seedDatabase()
 */
export const seedDatabase = async () => {
  try {
    console.log('🚀 Starting database seeding...');
    
    // Create users
    const users = await seedUsers();
    
    // Find organizer user
    const organizer = users.find(u => u.role === 'organizer');
    
    if (organizer) {
      // Create events for the organizer
      await seedEvents(organizer.uid);
    } else {
      console.warn('⚠️ No organizer user found. Events not created.');
    }
    
    console.log('✨ Database seeding completed!');
    console.log('\nDemo Login Credentials:');
    console.log('Admin: admin@event.com / admin123');
    console.log('Organizer: organizer@event.com / organizer123');
    console.log('Attendee: attendee@event.com / attendee123');
  } catch (error) {
    console.error('❌ Seeding failed:', error);
  }
};

// Export individual functions for flexible usage
export default seedDatabase;