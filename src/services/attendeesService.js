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
  onSnapshot,
} from "firebase/firestore";
import { db } from "../../firebase";

const ATTENDEES_COLLECTION = "attendees";

/**
 * Register attendee for event
 */
export const registerAttendee = async (eventId, attendeeData) => {
  try {
    // Check if user is already registered for this event
    const attendeesRef = collection(db, ATTENDEES_COLLECTION);
    const q = query(
      attendeesRef,
      where("eventId", "==", eventId),
      where("userId", "==", attendeeData.userId)
    );
    const existingSnapshot = await getDocs(q);

    if (!existingSnapshot.empty) {
      throw new Error("You are already registered for this event");
    }

    // Add new attendee registration
    const docRef = await addDoc(attendeesRef, {
      eventId,
      ...attendeeData,
      checkedIn: false,
      registeredAt: serverTimestamp(),
    });

    // Update event's registered count
    const { updateEvent } = await import('./eventsService.js');
    const eventRef = doc(db, "events", eventId);
    const eventSnap = await getDoc(eventRef);
    
    if (eventSnap.exists()) {
      const currentRegistered = eventSnap.data().registered || 0;
      await updateDoc(eventRef, {
        registered: currentRegistered + 1,
        updatedAt: serverTimestamp(),
      });
    }

    return {
      id: docRef.id,
      eventId,
      ...attendeeData,
    };
  } catch (error) {
    console.error("Error registering attendee:", error);
    throw error;
  }
};

/**
 * Get attendees for an event
 */
export const getEventAttendees = async (eventId) => {
  try {
    const attendeesRef = collection(db, ATTENDEES_COLLECTION);
    const q = query(attendeesRef, where("eventId", "==", eventId));
    const snapshot = await getDocs(q);

    const attendees = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return attendees;
  } catch (error) {
    console.error("Error fetching event attendees:", error);
    throw error;
  }
};

/**
 * Check in an attendee
 */
export const checkInAttendee = async (attendeeId) => {
  try {
    const attendeeRef = doc(db, ATTENDEES_COLLECTION, attendeeId);
    await updateDoc(attendeeRef, {
      checkedIn: true,
      checkedInAt: serverTimestamp(),
    });

    return true;
  } catch (error) {
    console.error("Error checking in attendee:", error);
    throw error;
  }
};

/**
 * Update attendee info
 */
export const updateAttendee = async (attendeeId, updates) => {
  try {
    const attendeeRef = doc(db, ATTENDEES_COLLECTION, attendeeId);
    await updateDoc(attendeeRef, {
      ...updates,
      updatedAt: serverTimestamp(),
    });

    return true;
  } catch (error) {
    console.error("Error updating attendee:", error);
    throw error;
  }
};

/**
 * Remove attendee registration
 */
export const removeAttendee = async (attendeeId) => {
  try {
    const attendeeRef = doc(db, ATTENDEES_COLLECTION, attendeeId);
    await deleteDoc(attendeeRef);
    return true;
  } catch (error) {
    console.error("Error removing attendee:", error);
    throw error;
  }
};

/**
 * Subscribe to event attendees in real-time
 */
export const subscribeToEventAttendees = (eventId, callback) => {
  try {
    const attendeesRef = collection(db, ATTENDEES_COLLECTION);
    const q = query(attendeesRef, where("eventId", "==", eventId));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const attendees = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      callback(attendees);
    });

    return unsubscribe;
  } catch (error) {
    console.error("Error subscribing to attendees:", error);
    throw error;
  }
};

/**
 * Get attendee by ID
 */
export const getAttendee = async (attendeeId) => {
  try {
    const attendeeRef = doc(db, ATTENDEES_COLLECTION, attendeeId);
    const attendeeSnap = await getDoc(attendeeRef);

    if (!attendeeSnap.exists()) {
      throw new Error("Attendee not found");
    }

    return {
      id: attendeeSnap.id,
      ...attendeeSnap.data(),
    };
  } catch (error) {
    console.error("Error fetching attendee:", error);
    throw error;
  }
};

/**
 * Get all attendees (admin view)
 */
export const getAllAttendees = async () => {
  try {
    const attendeesRef = collection(db, ATTENDEES_COLLECTION);
    const snapshot = await getDocs(attendeesRef);

    const attendees = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return attendees;
  } catch (error) {
    console.error("Error fetching all attendees:", error);
    throw error;
  }
};

/**
 * Check if user is already registered for an event
 */
export const isUserRegisteredForEvent = async (userId, eventId) => {
  try {
    const attendeesRef = collection(db, ATTENDEES_COLLECTION);
    const q = query(
      attendeesRef,
      where("userId", "==", userId),
      where("eventId", "==", eventId)
    );
    const snapshot = await getDocs(q);

    return !snapshot.empty;
  } catch (error) {
    console.error("Error checking registration:", error);
    throw error;
  }
};

/**
 * Get user registrations
 */
export const getUserRegistrations = async (userId) => {
  try {
    const attendeesRef = collection(db, ATTENDEES_COLLECTION);
    const q = query(attendeesRef, where("userId", "==", userId));
    const snapshot = await getDocs(q);

    const registrations = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return registrations;
  } catch (error) {
    console.error("Error fetching user registrations:", error);
    throw error;
  }
};
