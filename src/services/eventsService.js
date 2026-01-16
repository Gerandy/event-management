import {
  collection,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  query,
  where,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../../firebase";

const EVENTS_COLLECTION = "events";

/**
 * Get all events
 */
export const getEvents = async (filters = {}) => {
  try {
    const eventsRef = collection(db, EVENTS_COLLECTION);
    let q = eventsRef;

    const snapshot = await getDocs(eventsRef);
    const events = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return events;
  } catch (error) {
    console.error("Error fetching events:", error);
    throw error;
  }
};

/**
 * Get event by ID
 */
export const getEvent = async (eventId) => {
  try {
    const eventRef = doc(db, EVENTS_COLLECTION, eventId);
    const eventSnap = await getDoc(eventRef);

    if (!eventSnap.exists()) {
      throw new Error("Event not found");
    }

    return {
      id: eventSnap.id,
      ...eventSnap.data(),
    };
  } catch (error) {
    console.error("Error fetching event:", error);
    throw error;
  }
};

/**
 * Get events by organizer ID
 */
export const getEventsByOrganizer = async (organizerId) => {
  try {
    const eventsRef = collection(db, EVENTS_COLLECTION);
    const q = query(eventsRef, where("organizerId", "==", organizerId));
    const snapshot = await getDocs(q);

    const events = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return events;
  } catch (error) {
    console.error("Error fetching organizer events:", error);
    throw error;
  }
};

/**
 * Create a new event
 */
export const createEvent = async (eventData) => {
  try {
    const eventsRef = collection(db, EVENTS_COLLECTION);
    const docRef = await addDoc(eventsRef, {
      ...eventData,
      registered: 0,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    return {
      id: docRef.id,
      ...eventData,
    };
  } catch (error) {
    console.error("Error creating event:", error);
    throw error;
  }
};

/**
 * Update an event
 */
export const updateEvent = async (eventId, updates) => {
  try {
    const eventRef = doc(db, EVENTS_COLLECTION, eventId);
    await updateDoc(eventRef, {
      ...updates,
      updatedAt: serverTimestamp(),
    });

    return true;
  } catch (error) {
    console.error("Error updating event:", error);
    throw error;
  }
};

/**
 * Delete an event
 */
export const deleteEvent = async (eventId) => {
  try {
    const eventRef = doc(db, EVENTS_COLLECTION, eventId);
    await deleteDoc(eventRef);
    return true;
  } catch (error) {
    console.error("Error deleting event:", error);
    throw error;
  }
};

/**
 * Subscribe to real-time event updates
 */
export const subscribeToEvents = (callback) => {
  try {
    const eventsRef = collection(db, EVENTS_COLLECTION);
    const unsubscribe = onSnapshot(eventsRef, (snapshot) => {
      const events = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      callback(events);
    });

    return unsubscribe;
  } catch (error) {
    console.error("Error subscribing to events:", error);
    throw error;
  }
};

/**
 * Subscribe to organizer's events
 */
export const subscribeToOrganizerEvents = (organizerId, callback) => {
  try {
    const eventsRef = collection(db, EVENTS_COLLECTION);
    const q = query(eventsRef, where("organizerId", "==", organizerId));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const events = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      callback(events);
    });

    return unsubscribe;
  } catch (error) {
    console.error("Error subscribing to organizer events:", error);
    throw error;
  }
};
