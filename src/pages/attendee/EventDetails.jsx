import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Calendar as CalendarIcon, Users, AlertCircle, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useAuthStore } from '@/store/authStore';
import { getEvent } from '@/services/eventsService';
import { registerAttendee } from '@/services/attendeesService';
import { format } from 'date-fns';

const AttendeeEventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [registerDialogOpen, setRegisterDialogOpen] = useState(false);
  const [registering, setRegistering] = useState(false);

  useEffect(() => {
    const loadEvent = async () => {
      if (!id) {
        setError('Event ID not provided');
        setLoading(false);
        return;
      }

      try {
        const eventData = await getEvent(id);
        if (!eventData) {
          setError('Event not found');
        } else {
          setEvent(eventData);
        }
      } catch (err) {
        setError(err.message || 'Failed to load event');
      } finally {
        setLoading(false);
      }
    };

    loadEvent();
  }, [id]);

  const handleRegisterConfirm = async () => {
    if (!event || !user) return;
    
    setRegistering(true);
    setError(null);

    try {
      const attendeeData = {
        eventId: event.id,
        userId: user.uid,
        name: user.displayName || 'Guest',
        email: user.email,
        registeredAt: new Date(),
        checkedIn: false,
        company: '',
        ticketCode: `TKT-${event.id.slice(0, 8)}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      };

      await registerAttendee(attendeeData);
      setRegisterDialogOpen(false);
      navigate('/attendee/tickets');
    } catch (err) {
      setError(err.message || 'Failed to register for event');
      console.error('Error registering:', err);
    } finally {
      setRegistering(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-32 mb-4" />
        <Skeleton className="h-96 w-full mb-4" />
        <div className="grid md:grid-cols-2 gap-6">
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="space-y-6">
        <Link to="/attendee/home">
          <Button variant="ghost">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Events
          </Button>
        </Link>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error || 'Event not found'}</AlertDescription>
        </Alert>
      </div>
    );
  }

  const spotsAvailable = event.capacity - (event.registered || 0);

  return (
    <div className="space-y-6">
      <Link to="/attendee/home">
        <Button variant="ghost">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Events
        </Button>
      </Link>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-4">
        <div className="aspect-video relative overflow-hidden bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg">
          {event.imageUrl ? (
            <img
              src={event.imageUrl}
              alt={event.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <CalendarIcon className="h-24 w-24 text-muted-foreground" />
            </div>
          )}
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-3xl font-bold">{event.title}</h1>
            <Badge>{event.category}</Badge>
          </div>
          <p className="text-muted-foreground text-lg">{event.description}</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Event Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Date & Time</p>
              <p className="font-medium flex items-center gap-2">
                <CalendarIcon className="h-4 w-4" />
                {format(new Date(event.date), 'PPPP')} at {event.time}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Location</p>
              <p className="font-medium flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                {event.location}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Capacity</p>
              <p className="font-medium flex items-center gap-2">
                <Users className="h-4 w-4" />
                {event.registered} / {event.capacity} attendees
              </p>
              <div className="mt-2 h-2 bg-secondary rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-primary to-primary/80"
                  style={{ width: `${Math.min(((event.registered || 0) / event.capacity) * 100, 100)}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {spotsAvailable > 0 ? `${spotsAvailable} spots available` : 'Event is full'}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Registration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {spotsAvailable > 0 ? (
              <>
                <p className="text-sm text-muted-foreground">
                  {spotsAvailable} spots remaining for this event
                </p>
                <Button 
                  onClick={() => setRegisterDialogOpen(true)} 
                  className="w-full bg-attendee hover:bg-attendee/90"
                  disabled={registering}
                >
                  {registering ? 'Registering...' : 'Register Now'}
                </Button>
              </>
            ) : (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>This event is full. Check back later for cancellations.</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      </div>

      <Dialog open={registerDialogOpen} onOpenChange={setRegisterDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Registration</DialogTitle>
            <DialogDescription>
              You are registering for "{event.title}"
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <p className="text-sm font-medium">Your Details:</p>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setRegisterDialogOpen(false)}
              disabled={registering}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleRegisterConfirm} 
              disabled={registering}
              className="bg-attendee hover:bg-attendee/90"
            >
              {registering ? 'Processing...' : 'Confirm Registration'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AttendeeEventDetails;