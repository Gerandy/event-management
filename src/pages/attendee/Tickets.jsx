import { useState, useEffect, useRef } from 'react';
import { Calendar as CalendarIcon, MapPin, QrCode, Download, Mail, AlertCircle, Users } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { format } from 'date-fns';
import QRCodeStyling from 'qr-code-styling';
import { useAuthStore } from '@/store/authStore';
import { getAllAttendees } from '@/services/attendeesService';
import { getEvent } from '@/services/eventsService';

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

const TicketCard = ({ ticket, event }) => {
  const qrRef = useRef(null);

  useEffect(() => {
    if (qrRef.current && ticket.ticketCode) {
      const qrCode = new QRCodeStyling({
        width: 200,
        height: 200,
        data: ticket.ticketCode,
        dotsOptions: {
          color: '#000000',
          type: 'rounded',
        },
        backgroundOptions: {
          color: '#ffffff',
        },
        imageOptions: {
          crossOrigin: 'anonymous',
          margin: 10,
        },
      });

      qrRef.current.innerHTML = '';
      qrCode.append(qrRef.current);
    }
  }, [ticket.ticketCode]);

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-attendee/10 to-attendee/5 pb-4">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-xl">{event.title}</CardTitle>
            <CardDescription className="flex items-center gap-2">
              <Badge variant={ticket.checkedIn ? 'default' : 'secondary'} className={ticket.checkedIn ? 'bg-success' : ''}>
                {ticket.checkedIn ? 'Checked In' : 'Not Checked In'}
              </Badge>
            </CardDescription>
          </div>
          <QrCode className="h-8 w-8 text-attendee" />
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Attendee</p>
              <p className="font-medium">{ticket.name}</p>
              <p className="text-sm text-muted-foreground">{ticket.email}</p>
            </div>

            <Separator />

            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <CalendarIcon className="h-4 w-4 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">Date & Time</p>
                  <p className="font-medium text-sm">{formatEventDate(event.date)} at {event.time}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">Location</p>
                  <p className="font-medium text-sm">{event.location}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Users className="h-4 w-4 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">Capacity</p>
                  <p className="font-medium text-sm">{event.registered || 0} / {event.capacity} registered</p>
                </div>
              </div>
            </div>

            <Separator />

            <div>
              <p className="text-sm text-muted-foreground mb-1">Ticket Code</p>
              <p className="font-mono text-sm font-medium">{ticket.ticketCode}</p>
            </div>

            {ticket.company && (
              <>
                <Separator />
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Company</p>
                  <p className="font-medium text-sm">{ticket.company}</p>
                </div>
              </>
            )}
          </div>

          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="bg-white p-4 rounded-lg border-2 border-border">
              <div ref={qrRef} />
            </div>
            <p className="text-xs text-center text-muted-foreground">
              Show this QR code at the event entrance
            </p>
            <div className="flex gap-2 w-full">
              <Button variant="outline" size="sm" className="flex-1" disabled>
                <Download className="mr-2 h-4 w-4" />
                Download
              </Button>
              <Button variant="outline" size="sm" className="flex-1" disabled>
                <Mail className="mr-2 h-4 w-4" />
                Email
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const AttendeeTickets = () => {
  const { user } = useAuthStore();
  const [tickets, setTickets] = useState([]);
  const [events, setEvents] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadTickets = async () => {
      if (!user?.uid) {
        setLoading(false);
        return;
      }

      try {
        // Get all attendees and filter by current user
        const allAttendees = await getAllAttendees();
        const userTickets = allAttendees.filter(a => a.userId === user.uid);
        setTickets(userTickets);

        // Load event data for each ticket
        const eventMap = {};
        for (const ticket of userTickets) {
          if (!eventMap[ticket.eventId]) {
            const eventData = await getEvent(ticket.eventId);
            if (eventData) {
              eventMap[ticket.eventId] = eventData;
            }
          }
        }
        setEvents(eventMap);
        setLoading(false);
      } catch (err) {
        setError(err.message || 'Failed to load tickets');
        setLoading(false);
      }
    };

    loadTickets();
  }, [user?.uid]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-8 w-32 mb-2" />
          <Skeleton className="h-4 w-64" />
        </div>
        <div className="space-y-6">
          {[1, 2].map((i) => (
            <Card key={i}>
              <Skeleton className="h-48 w-full" />
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">My Tickets</h1>
        <p className="text-muted-foreground mt-1">View and manage your event tickets</p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {tickets.length > 0 ? (
        <div className="space-y-6">
          {tickets.map(ticket => {
            const event = events[ticket.eventId];
            return event ? (
              <TicketCard key={ticket.id} ticket={ticket} event={event} />
            ) : null;
          })}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <QrCode className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-medium">No tickets yet</p>
            <p className="text-sm text-muted-foreground mb-4">Register for events to see your tickets here</p>
            <Button asChild className="bg-attendee hover:bg-attendee/90">
              <a href="/attendee/home">Browse Events</a>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AttendeeTickets;