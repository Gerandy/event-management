import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, MapPin, Calendar as CalendarIcon, Users, Edit, Trash2, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Alert, AlertDescription } from '@/components/ui/alert';

const AdminEventDetails = () => {
  // Inline mock events data
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
      tags: ['Technology', 'AI', 'Conference'],
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
      tags: ['Music', 'Festival', 'Entertainment'],
    },
  ];

  // Inline mock attendees data
  const mockAttendees = [
    {
      id: 'att_001',
      name: 'Maria Garcia',
      email: 'maria.garcia@email.com',
      eventId: 'evt_001',
      company: 'Tech Corp',
      ticketCode: 'TKT-001-001',
      checkedIn: true,
      registeredAt: '2026-01-12T10:30:00Z',
    },
    {
      id: 'att_002',
      name: 'James Chen',
      email: 'james.chen@email.com',
      eventId: 'evt_001',
      company: 'Innovation Labs',
      ticketCode: 'TKT-001-002',
      checkedIn: true,
      registeredAt: '2026-01-11T14:22:00Z',
    },
    {
      id: 'att_005',
      name: 'Emma Thompson',
      email: 'emma.t@email.com',
      eventId: 'evt_001',
      company: 'Digital Solutions',
      ticketCode: 'TKT-001-003',
      checkedIn: false,
      registeredAt: '2026-01-13T09:20:00Z',
    },
  ];

  const { id } = useParams();
  const event = mockEvents.find((e) => e.id === id);
  const attendees = mockAttendees.filter((a) => a.eventId === id);

  if (!event) {
    return (
      <div className="space-y-6">
        <Alert>
          <AlertDescription>Event not found</AlertDescription>
        </Alert>
        <Link to="/admin/events">
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Events
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Link to="/admin/events">
          <Button variant="ghost">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </Link>
        <div className="flex gap-2">
          <Button variant="outline">
            <Edit className="mr-2 h-4 w-4" />
            Edit Event
          </Button>
          <Button variant="outline">
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="p-0">
          <img
            src={event.imageUrl}
            alt={event.title}
            className="h-64 w-full object-cover rounded-t-lg"
          />
        </CardHeader>
        <CardContent className="pt-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <CardTitle className="text-3xl mb-2">{event.title}</CardTitle>
              <CardDescription className="text-base">{event.description}</CardDescription>
            </div>
            <Badge variant={event.status === 'upcoming' ? 'default' : 'secondary'} className="text-sm px-3 py-1">
              {event.status}
            </Badge>
          </div>

          <div className="grid gap-6 md:grid-cols-2 mt-6">
            <div className="space-y-4">
              <div className="flex items-center text-muted-foreground">
                <CalendarIcon className="mr-3 h-5 w-5" />
                <div>
                  <p className="text-sm text-muted-foreground">Date & Time</p>
                  <p className="text-base font-medium text-foreground">{event.date} at {event.time}</p>
                </div>
              </div>
              <div className="flex items-center text-muted-foreground">
                <MapPin className="mr-3 h-5 w-5" />
                <div>
                  <p className="text-sm text-muted-foreground">Location</p>
                  <p className="text-base font-medium text-foreground">{event.location}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center text-muted-foreground">
                <Users className="mr-3 h-5 w-5" />
                <div>
                  <p className="text-sm text-muted-foreground">Capacity</p>
                  <p className="text-base font-medium text-foreground">{event.registered} / {event.capacity} registered</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-2">Tags</p>
                <div className="flex flex-wrap gap-2">
                  {event.tags.map((tag) => (
                    <Badge key={tag} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Registered Attendees ({attendees.length})</CardTitle>
          <CardDescription>List of all registered attendees for this event</CardDescription>
        </CardHeader>
        <CardContent>
          {attendees.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Ticket Code</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {attendees.map((attendee) => (
                  <TableRow key={attendee.id}>
                    <TableCell className="font-medium">{attendee.name}</TableCell>
                    <TableCell>{attendee.email}</TableCell>
                    <TableCell>{attendee.company}</TableCell>
                    <TableCell className="font-mono text-xs">{attendee.ticketCode}</TableCell>
                    <TableCell>
                      {attendee.checkedIn ? (
                        <Badge variant="default" className="bg-success">
                          <CheckCircle className="mr-1 h-3 w-3" />
                          Checked In
                        </Badge>
                      ) : (
                        <Badge variant="secondary">
                          <XCircle className="mr-1 h-3 w-3" />
                          Not Checked In
                        </Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Users className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-lg font-medium">No attendees registered yet</p>
              <p className="text-sm text-muted-foreground">Attendees will appear here once they register</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminEventDetails;