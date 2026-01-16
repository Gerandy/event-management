import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AdminLayout from './layouts/AdminLayout';
import OrganizerLayout from './layouts/OrganizerLayout';
import AttendeeLayout from './layouts/AttendeeLayout';
import AdminDashboard from './pages/admin/Dashboard';
import AdminEvents from './pages/admin/Events';
import AdminEventDetails from './pages/admin/EventDetails';
import AdminOrganizers from './pages/admin/Organizers';
import AdminReports from './pages/admin/Reports';
import OrganizerDashboard from './pages/organizer/Dashboard';
import OrganizerEventCreate from './pages/organizer/EventCreate';
import OrganizerEventEdit from './pages/organizer/EventEdit';
import OrganizerAttendees from './pages/organizer/Attendees';
import OrganizerScanner from './pages/organizer/Scanner';
import AttendeeHome from './pages/attendee/Home';
import AttendeeEventDetails from './pages/attendee/EventDetails';
import AttendeeTickets from './pages/attendee/Tickets';
import Login from './pages/Login';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <div className="scrollbar-thin">
          {/* Firebase Connection Status */}
          <div id="firebase-status" style={{
            position: 'fixed',
            top: 10,
            right: 10,
            padding: '8px 12px',
            borderRadius: '4px',
            backgroundColor: '#f0f0f0',
            fontSize: '12px',
            zIndex: 9999
          }}></div>
          
          <Routes>
          <Route path="/login" element={<Login />} />
          
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="events" element={<AdminEvents />} />
            <Route path="events/:id" element={<AdminEventDetails />} />
            <Route path="organizers" element={<AdminOrganizers />} />
            <Route path="reports" element={<AdminReports />} />
          </Route>

          <Route path="/organizer" element={<OrganizerLayout />}>
            <Route index element={<Navigate to="/organizer/dashboard" replace />} />
            <Route path="dashboard" element={<OrganizerDashboard />} />
            <Route path="events/create" element={<OrganizerEventCreate />} />
            <Route path="events/:id/edit" element={<OrganizerEventEdit />} />
            <Route path="events/:id/attendees" element={<OrganizerAttendees />} />
            <Route path="scanner" element={<OrganizerScanner />} />
          </Route>

          <Route path="/attendee" element={<AttendeeLayout />}>
            <Route index element={<Navigate to="/attendee/home" replace />} />
            <Route path="home" element={<AttendeeHome />} />
            <Route path="events/:id" element={<AttendeeEventDetails />} />
            <Route path="tickets" element={<AttendeeTickets />} />
          </Route>

          <Route path="/" element={<Navigate to="/attendee/home" replace />} />
        </Routes>
        </div>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;