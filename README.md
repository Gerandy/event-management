# Event Management System - Frontend

A modern event management application built with React, Firebase, and shadcn/ui.

## Features

- 🔐 **Authentication**: Firebase Auth with role-based access (Admin, Organizer, Attendee)
- 📅 **Event Management**: Create, edit, and manage events
- 👥 **User Management**: Manage organizers and attendees
- 🎫 **Registration System**: Event registration and check-in
- 📊 **Analytics**: Dashboard with event statistics
- 🎨 **Modern UI**: Beautiful interface with shadcn/ui components
- 📱 **Responsive**: Works on desktop, tablet, and mobile

## Tech Stack

- **Frontend Framework**: React 19
- **Build Tool**: Vite
- **UI Components**: shadcn/ui
- **Styling**: Tailwind CSS v4
- **Backend**: Firebase (Authentication, Firestore, Storage)
- **State Management**: Zustand
- **Data Fetching**: TanStack Query
- **Routing**: React Router v7
- **Form Handling**: React Hook Form + Zod
- **Charts**: Recharts
- **Icons**: Lucide React

## Prerequisites

- Node.js 18 or higher
- npm or yarn
- Firebase account (free tier is sufficient)

## Getting Started

### 1. Clone and Install

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install
```

### 2. Firebase Setup

Follow the detailed setup guide in [FIREBASE_SETUP.md](../FIREBASE_SETUP.md)

Quick summary:
1. Create Firebase project
2. Enable Authentication (Email/Password)
3. Create Firestore database
4. Copy Firebase config to `.env`

### 3. Configure Environment

Copy `.env.example` to `.env` and update with your Firebase credentials:

```bash
cp .env.example .env
```

Edit `.env`:
```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### 4. Seed Database

```bash
# Start dev server
npm run dev

# Open http://localhost:5173
# Open browser console (F12) and run:
```

```javascript
const seedModule = await import('./src/utils/seedData.js');
await seedModule.seedDatabase();
```

### 5. Login

Use demo credentials:
- Admin: `admin@event.com` / `admin123`
- Organizer: `organizer@event.com` / `organizer123`
- Attendee: `attendee@event.com` / `attendee123`

## Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── ui/              # shadcn/ui components
│   │   └── ProtectedRoute.jsx
│   ├── hooks/
│   │   └── use-mobile.js    # Mobile detection hook
│   ├── layouts/
│   │   ├── AdminLayout.jsx
│   │   ├── OrganizerLayout.jsx
│   │   └── AttendeeLayout.jsx
│   ├── lib/
│   │   └── utils.js         # Utility functions
│   ├── pages/
│   │   ├── admin/           # Admin pages (Dashboard, Events, Organizers, Reports, EventDetails)
│   │   ├── organizer/       # Organizer pages (Dashboard, EventCreate, EventEdit, Attendees, Scanner)
│   │   ├── attendee/        # Attendee pages (Home, EventDetails, Tickets)
│   │   └── Login.jsx
│   ├── services/
│   │   ├── authService.js   # Authentication service with inline mock users
│   │   └── firestoreService.js # Firestore operations with inline mock data
│   ├── store/
│   │   └── authStore.js     # Zustand auth store
│   ├── utils/
│   │   └── seedData.js      # Database seeding utilities
│   ├── App.jsx
│   ├── main.jsx
│   ├── App.css
│   └── index.css
├── .env                      # Environment variables
├── .env.example              # Environment template
├── components.json           # shadcn config
├── package.json
└── vite.config.js
```

### Data Architecture

All data is defined as **inline mock objects** using `const` declarations:

- **Mock Users**: Defined in `src/services/authService.js`
  - Admin, Organizer, and Attendee accounts for testing

- **Mock Events**: Defined in each component that uses them
  - Events for conferences, festivals, business summits, workshops, etc.

- **Mock Attendees**: Defined in each component that uses them
  - Attendee records with registration and check-in status

- **Mock Organizers**: Defined in `src/pages/admin/Organizers.jsx`
  - Event organizers with activity metrics

Each component consumes mock data as if it were from a real backend. No external data services or separate data files are used.

## Available Scripts

```bash
# Development
npm run dev          # Start dev server (http://localhost:5173)

# Production
npm run build        # Build for production
npm run preview      # Preview production build

# Linting
npm run lint         # Run ESLint
```

## Key Features by Role

### Admin
- View all events and statistics
- Manage organizers
- View comprehensive reports
- Approve/reject events

### Organizer
- Create and manage own events
- View event attendees
- QR code scanner for check-in
- Event analytics

### Attendee
- Browse available events
- Register for events
- View registered events
- Access event tickets

## Firebase Integration

### Services

**Authentication** (`src/services/authService.js`)
- `signIn(email, password)` - User login
- `signUp(email, password, name, role)` - User registration
- `logout()` - User logout
- `onAuthStateChange(callback)` - Listen to auth changes

**Firestore** (`src/services/firestoreService.js`)
- `getEvents(filters)` - Fetch events
- `createEvent(data)` - Create event
- `updateEvent(id, data)` - Update event
- `deleteEvent(id)` - Delete event
- `registerForEvent(eventId, userId, data)` - Register for event
- And more...

### Custom Hooks

**useAuth** - Authentication state and methods
```javascript
const { user, role, isAuthenticated, isLoading } = useAuth();
```

**useFirestore** - Data fetching with React Query
```javascript
const { data: events, isLoading } = useEvents({ status: 'upcoming' });
const createMutation = useCreateEvent();
```

## Security

- Environment variables for Firebase config
- Protected routes with role-based access
- Firebase Authentication for user management
- Firestore security rules (see FIREBASE_SETUP.md)
- No credentials in source code

## Troubleshooting

**Build errors with Tailwind v4**
- Ensure `@tailwindcss/vite` plugin is in `vite.config.js`
- Check `@import "tailwindcss";` is in `index.css`

**Firebase not connecting**
- Verify `.env` file exists and has correct values
- Restart dev server after changing `.env`
- Check Firebase Console for project status

**Authentication failing**
- Ensure Email/Password is enabled in Firebase
- Check user exists in Firebase Authentication tab
- Verify Firestore has user document

**"Permission Denied" errors**
- Check Firestore security rules
- Ensure user is authenticated
- Verify user role in database

## Contributing

1. Create feature branch
2. Make changes
3. Test thoroughly
4. Submit pull request

## License

MIT

## Support

For issues and questions:
- Check [FIREBASE_SETUP.md](../FIREBASE_SETUP.md)
- Review Firebase Console logs
- Check browser console for errors