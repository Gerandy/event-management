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
} from "firebase/firestore";
import { db } from "../../firebase";

const ORGANIZERS_COLLECTION = "organizers";

/**
 * Get all organizers
 */
export const getOrganizers = async () => {
  try {
    const organizersRef = collection(db, ORGANIZERS_COLLECTION);
    const snapshot = await getDocs(organizersRef);

    const organizers = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return organizers;
  } catch (error) {
    console.error("Error fetching organizers:", error);
    throw error;
  }
};

/**
 * Get organizer by ID
 */
export const getOrganizer = async (organizerId) => {
  try {
    const organizerRef = doc(db, ORGANIZERS_COLLECTION, organizerId);
    const organizerSnap = await getDoc(organizerRef);

    if (!organizerSnap.exists()) {
      throw new Error("Organizer not found");
    }

    return {
      id: organizerSnap.id,
      ...organizerSnap.data(),
    };
  } catch (error) {
    console.error("Error fetching organizer:", error);
    throw error;
  }
};

/**
 * Create organizer profile
 */
export const createOrganizer = async (organizerData) => {
  try {
    const organizersRef = collection(db, ORGANIZERS_COLLECTION);
    const docRef = await addDoc(organizersRef, {
      ...organizerData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    return {
      id: docRef.id,
      ...organizerData,
    };
  } catch (error) {
    console.error("Error creating organizer:", error);
    throw error;
  }
};

/**
 * Update organizer
 */
export const updateOrganizer = async (organizerId, updates) => {
  try {
    const organizerRef = doc(db, ORGANIZERS_COLLECTION, organizerId);
    await updateDoc(organizerRef, {
      ...updates,
      updatedAt: serverTimestamp(),
    });

    return true;
  } catch (error) {
    console.error("Error updating organizer:", error);
    throw error;
  }
};

/**
 * Delete organizer
 */
export const deleteOrganizer = async (organizerId) => {
  try {
    const organizerRef = doc(db, ORGANIZERS_COLLECTION, organizerId);
    await deleteDoc(organizerRef);
    return true;
  } catch (error) {
    console.error("Error deleting organizer:", error);
    throw error;
  }
};
