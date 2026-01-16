import { useState, useEffect } from 'react';
import { Resend } from 'resend';
import { useNavigate, Link } from 'react-router-dom';
import { Search, Calendar as CalendarIcon, MapPin, Users, Filter, CheckCircle, AlertCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useAuthStore } from '@/store/authStore';
import { format } from 'date-fns';
import { getEvents } from '@/services/eventsService';
import { registerAttendee, isUserRegisteredForEvent } from '@/services/attendeesService';

const AttendeeHome = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [registerDialogOpen, setRegisterDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [registering, setRegistering] = useState(false);

  const sendEmail = async () => {
  const res = await fetch('http://localhost:3000/send-email', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      to: user.email,
      subject: 'Your Slot is Confirmed',
      html: '<h1>Your Slot in '+selectedEvent.title+' has Been Confirmed</h1>',
    }),
  });

  const data = await res.json();
  console.log(data);
};






  useEffect(() => {
    const loadEvents = async () => {
      try {
        const fetchedEvents = await getEvents();
        setEvents(fetchedEvents);
        setLoading(false);
      } catch (err) {
        setError(err.message || 'Failed to load events');
        setLoading(false);
      }
    };

    loadEvents();
  }, []);

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || event.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleRegisterClick = (event) => {
    if (!user) {
      setError('You must be logged in to register');
      return;
    }
    setSelectedEvent(event);
    setRegisterDialogOpen(true);
  };

  const handleRegisterConfirm = async () => {
    if (!selectedEvent || !user) return;
    
    setRegistering(true);
    setError(null);

    try {
      // Check if user is already registered
      const alreadyRegistered = await isUserRegisteredForEvent(user.uid, selectedEvent.id);
      if (alreadyRegistered) {
        setError('You are already registered for this event');
        setRegistering(false);
        return;
      }

      const attendeeData = {
        userId: user.uid,
        name: user.displayName || 'Guest',
        email: user.email,
        registeredAt: new Date(),
        checkedIn: false,
        company: '',
        ticketCode: `TKT-${selectedEvent.id.slice(0, 8)}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      };

      await registerAttendee(selectedEvent.id, attendeeData);
      setRegisterDialogOpen(false);
      sendEmail();
      
      // Navigate to tickets page after short delay
      setTimeout(() => {
        navigate('/attendee/tickets');
      }, 500);
    } catch (err) {
      setError(err.message || 'Failed to register for event');
      console.error('Error registering:', err);
    } finally {
      setRegistering(false);
    }
  };

  const categories = ['all', ...new Set(events.map(e => e.category).filter(Boolean))];

  const formatEventDate = (date) => {
    if (!date) return '';
    // Handle Firestore Timestamp objects
    if (date.toDate && typeof date.toDate === 'function') {
      return format(date.toDate(), 'PPP');
    }
    // Handle Date objects
    if (date instanceof Date) {
      return format(date, 'PPP');
    }
    // Handle date strings
    return format(new Date(date), 'PPP');
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="text-center space-y-4 fade-in">
          <Skeleton className="h-12 w-64 mx-auto mb-4" />
          <Skeleton className="h-6 w-96 mx-auto" />
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          <Skeleton className="h-10 flex-1" />
          <Skeleton className="h-10 w-full sm:w-48" />
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <Skeleton className="h-48 w-full rounded-t-lg" />
              <CardContent className="pt-4">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-full mb-4" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }


  return (
    <div className="space-y-8">
      <div className="text-center space-y-4 fade-in">
        <h1 className="text-4xl font-bold tracking-tight text-gradient">Discover Events</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Find and register for amazing events happening near you
        </p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search events..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <Filter className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map(cat => (
              <SelectItem key={cat} value={cat}>
                {cat === 'all' ? 'All Categories' : cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {filteredEvents.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredEvents.map((event) => (
            <Card key={event.id} className="flex flex-col card-hover fade-in">
              <CardHeader className="p-0">
                {event.imageUrl ? (
                  <img
                    src={event.imageUrl}
                    alt={event.title}
                    className="h-48 w-full object-cover rounded-t-lg"
                  />
                ) : (
                  <div className="h-48 w-full bg-gradient-to-br from-primary/10 to-secondary/10 rounded-t-lg flex items-center justify-center">
                    <CalendarIcon className="h-16 w-16 text-muted-foreground" />
                  </div>
                )}
              </CardHeader>
              <CardContent className="flex-1 pt-4">
                <div className="flex items-start justify-between mb-2">
                  <CardTitle className="text-lg line-clamp-1">{event.title}</CardTitle>
                  <Badge variant="outline" className="shrink-0 ml-2">
                    {event.category}
                  </Badge>
                </div>
                <CardDescription className="line-clamp-2 mb-4">{event.description}</CardDescription>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center text-muted-foreground">
                    <CalendarIcon className="mr-2 h-4 w-4 shrink-0" />
                    {formatEventDate(event.date)} at {event.time}
                  </div>
                  <div className="flex items-center text-muted-foreground">
                    <MapPin className="mr-2 h-4 w-4 shrink-0" />
                    <span className="line-clamp-1">{event.location}</span>
                  </div>
                  <div className="flex items-center text-muted-foreground">
                    <Users className="mr-2 h-4 w-4 shrink-0" />
                    {event.registered} / {event.capacity} registered
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex gap-2">
                <Button asChild variant="outline" className="flex-1">
                  <Link to={`/attendee/events/${event.id}`}>
                    View Details
                  </Link>
                </Button>
                <Button 
                  onClick={() => handleRegisterClick(event)}
                  className="flex-1 bg-attendee hover:bg-attendee/90"
                  disabled={event.registered >= event.capacity || registering}
                >
                  {event.registered >= event.capacity ? 'Full' : 'Register'}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Search className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-medium">No events found</p>
            <p className="text-sm text-muted-foreground">Try adjusting your search or filter criteria</p>
          </CardContent>
        </Card>
      )}

      <Dialog open={registerDialogOpen} onOpenChange={setRegisterDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Register for Event</DialogTitle>
            <DialogDescription>
              Confirm your registration for "{selectedEvent?.title}"
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <p className="text-sm font-medium">Event Details:</p>
              <div className="text-sm text-muted-foreground space-y-1">
                <div className="flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4" />
                  <span>{selectedEvent && formatEventDate(selectedEvent.date)} at {selectedEvent?.time}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span>{selectedEvent?.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span>{selectedEvent?.registered} / {selectedEvent?.capacity} registered</span>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRegisterDialogOpen(false)} disabled={registering}>
              Cancel
            </Button>
            <Button onClick={handleRegisterConfirm} disabled={registering}>
              {registering ? 'Registering...' : 'Confirm Registration'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AttendeeHome;