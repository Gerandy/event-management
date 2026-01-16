import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../../firebase';

/**
 * Register a new user with email and password
 */
export const register = async (email, password, displayName, role = 'attendee') => {
  try {
    // Create user in Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Create user document in Firestore
    await setDoc(doc(db, 'users', user.uid), {
      uid: user.uid,
      email: user.email,
      displayName: displayName || '',
      role: role || 'attendee',
      emailVerified: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    return {
      uid: user.uid,
      email: user.email,
      displayName: displayName || '',
      role: role || 'attendee',
      emailVerified: user.emailVerified,
      createdAt: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Registration error:', error);
    throw new Error(error.message || 'Registration failed');
  }
};

/**
 * Sign in user with email and password
 */
export const login = async (email, password) => {
  try {
    // Sign in with Firebase Auth
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Get user data from Firestore
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    
    if (userDoc.exists()) {
      const userData = userDoc.data();
      localStorage.setItem('currentUser', JSON.stringify(userData));
      return userData;
    } else {
      // If user doc doesn't exist, create it
      const newUserData = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || '',
        role: 'attendee',
        emailVerified: user.emailVerified,
        createdAt: new Date().toISOString(),
      };
      
      await setDoc(doc(db, 'users', user.uid), newUserData);
      localStorage.setItem('currentUser', JSON.stringify(newUserData));
      return newUserData;
    }
  } catch (error) {
    console.error('Login error:', error);
    throw new Error(error.message || 'Login failed');
  }
};

/**
 * Get current user
 */
export const getCurrentUser = () => {
  return auth.currentUser;
};

/**
 * Subscribe to auth state changes
 */
export const onAuthStateChangedListener = (callback) => {
  return onAuthStateChanged(auth, callback);
};

/**
 * Sign out user
 */
export const logout = async () => {
  try {
    localStorage.removeItem('currentUser');
    await firebaseSignOut(auth);
  } catch (error) {
    console.error('Logout error:', error);
    throw new Error(error.message || 'Logout failed');
  }
};

/**
 * Get user data from Firestore
 */
export const getUserData = async (uid) => {
  try {
    const userDoc = await getDoc(doc(db, 'users', uid));
    if (userDoc.exists()) {
      return userDoc.data();
    }
    return null;
  } catch (error) {
    console.error('Error getting user data:', error);
    throw error;
  }
};
