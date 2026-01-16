// Mock data - inline const definitions
const mockEvents = [
  {
    id: 'evt_001',
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
    organizerId: 'org_001',
    createdAt: '2026-01-10T08:30:00Z',
    updatedAt: '2026-01-15T10:22:00Z',
  },
  {
    id: 'evt_002',
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
    organizerId: 'org_001',
    createdAt: '2026-01-08T14:15:00Z',
    updatedAt: '2026-01-14T09:30:00Z',
  },
  {
    id: 'evt_003',
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
    organizerId: 'org_001',
    createdAt: '2026-01-05T11:45:00Z',
    updatedAt: '2026-01-13T16:20:00Z',
  },
];

const mockAttendees = [
  {
    id: 'att_001',
    name: 'Maria Garcia',
    email: 'maria.garcia@email.com',
    eventId: 'evt_001',
    checkedIn: true,
    registeredAt: '2026-01-12T10:30:00Z',
  },
  {
    id: 'att_002',
    name: 'James Chen',
    email: 'james.chen@email.com',
    eventId: 'evt_001',
    checkedIn: true,
    registeredAt: '2026-01-11T14:22:00Z',
  },
  {
    id: 'att_003',
    name: 'Sofia Rodriguez',
    email: 'sofia.r@email.com',
    eventId: 'evt_002',
    checkedIn: false,
    registeredAt: '2026-01-10T08:15:00Z',
  },
  {
    id: 'att_004',
    name: 'Akira Tanaka',
    email: 'akira.tanaka@email.com',
    eventId: 'evt_003',
    checkedIn: true,
    registeredAt: '2026-01-09T12:45:00Z',
  },
  {
    id: 'att_005',
    name: 'Emma Thompson',
    email: 'emma.t@email.com',
    eventId: 'evt_001',
    checkedIn: false,
    registeredAt: '2026-01-13T09:20:00Z',
  },
];

const mockUsers = [];

// localStorage keys
const EVENTS_KEY = 'events_db';
const ATTENDEES_KEY = 'attendees_db';

// Initialize from localStorage or use mock data
const loadFromStorage = (key, defaultData) => {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : defaultData;
  } catch (error) {
    console.error(`Error loading ${key}:`, error);
    return defaultData;
  }
};

const saveToStorage = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Error saving ${key}:`, error);
  }
};

// In-memory database with localStorage persistence
let eventsDB = loadFromStorage(EVENTS_KEY, [...mockEvents]);
let attendeesDB = loadFromStorage(ATTENDEES_KEY, [...mockAttendees]);

/**
 * Events Collection Operations
 */

export const getEvents = async (filters = {}) => {
  try {
    let events = [...eventsDB];
    
    if (filters.status) {
      events = events.filter(e => e.status === filters.status);
    }
    if (filters.organizerId) {
      events = events.filter(e => e.organizerId === filters.organizerId);
    }
    
    return events.sort((a, b) => new Date(b.date) - new Date(a.date));
  } catch (error) {
    console.error('Error getting events:', error);
    return mockEvents;
  }
};

export const getEvent = async (eventId) => {
  try {
    const event = eventsDB.find(e => e.id === eventId);
    if (!event) throw new Error('Event not found');
    return event;
  } catch (error) {
    console.error('Error getting event:', error);
    throw error;
  }
};

export const createEvent = async (eventData) => {
  try {
    const newId = 'evt-' + Date.now();
    const newEvent = {
      id: newId,
      ...eventData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    eventsDB.push(newEvent);
    saveToStorage(EVENTS_KEY, eventsDB);
    return newId;
  } catch (error) {
    console.error('Error creating event:', error);
    throw error;
  }
};

export const updateEvent = async (eventId, eventData) => {
  try {
    const index = eventsDB.findIndex(e => e.id === eventId);
    if (index === -1) throw new Error('Event not found');
    
    eventsDB[index] = {
      ...eventsDB[index],
      ...eventData,
      updatedAt: new Date().toISOString(),
    };
    saveToStorage(EVENTS_KEY, eventsDB);
  } catch (error) {
    console.error('Error updating event:', error);
    throw error;
  }
};

export const deleteEvent = async (eventId) => {
  try {
    const index = eventsDB.findIndex(e => e.id === eventId);
    if (index !== -1) {
      eventsDB.splice(index, 1);
      saveToStorage(EVENTS_KEY, eventsDB);
    }
  } catch (error) {
    console.error('Error deleting event:', error);
    throw error;
  }
};

/**
 * Attendees/Registrations Operations
 */

export const getEventAttendees = async (eventId) => {
  try {
    return attendeesDB.filter(a => a.eventId === eventId);
  } catch (error) {
    console.error('Error getting attendees:', error);
    return [];
  }
};

export const getUserRegistrations = async (userId) => {
  try {
    return attendeesDB.filter(a => a.userId === userId);
  } catch (error) {
    console.error('Error getting user registrations:', error);
    return [];
  }
};

export const registerForEvent = async (eventId, userId, userData) => {
  try {
    const newId = 'reg-' + Date.now();
    const registration = {
      id: newId,
      eventId,
      userId,
      ...userData,
      status: 'registered',
      checkedIn: false,
      createdAt: new Date().toISOString(),
    };
    attendeesDB.push(registration);
    saveToStorage(ATTENDEES_KEY, attendeesDB);
    
    // Update event registered count
    const event = eventsDB.find(e => e.id === eventId);
    if (event) {
      event.registered = (event.registered || 0) + 1;
      saveToStorage(EVENTS_KEY, eventsDB);
    }
    
    return newId;
  } catch (error) {
    console.error('Error registering for event:', error);
    throw error;
  }
};

export const checkInAttendee = async (registrationId) => {
  try {
    const attendee = attendeesDB.find(a => a.id === registrationId);
    if (attendee) {
      attendee.checkedIn = true;
      attendee.checkedInAt = new Date().toISOString();
      saveToStorage(ATTENDEES_KEY, attendeesDB);
    }
  } catch (error) {
    console.error('Error checking in attendee:', error);
    throw error;
  }
};

/**
 * Users Operations
 */

export const getUsers = async (role = null) => {
  try {
    let users = [...usersDB];
    if (role) {
      users = users.filter(u => u.role === role);
    }
    return users;
  } catch (error) {
    console.error('Error getting users:', error);
    return mockUsers;
  }
};

export const getUser = async (userId) => {
  try {
    const user = usersDB.find(u => u.id === userId);
    if (!user) throw new Error('User not found');
    return user;
  } catch (error) {
    console.error('Error getting user:', error);
    throw error;
  }
};

export const updateUser = async (userId, userData) => {
  try {
    const index = usersDB.findIndex(u => u.id === userId);
    if (index !== -1) {
      usersDB[index] = {
        ...usersDB[index],
        ...userData,
        updatedAt: new Date().toISOString(),
      };
      saveToStorage(USERS_KEY, usersDB);
    }
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
};