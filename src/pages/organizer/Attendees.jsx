import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Search, Download, CheckCircle, XCircle, Mail, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { getEvent } from '@/services/eventsService';
import { subscribeToEventAttendees } from '@/services/attendeesService';
import { exportAttendeesToCSV } from '@/utils/csvExport';

const OrganizerAttendees = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [attendees, setAttendees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

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
        console.error('Error loading event:', err);
      }
    };

    loadEvent();
  }, [id]);

  useEffect(() => {
    if (!id) return;

    try {
      const unsubscribe = subscribeToEventAttendees(id, (fetchedAttendees) => {
        setAttendees(fetchedAttendees);
        setLoading(false);
      });
      return () => unsubscribe();
    } catch (err) {
      setError(err.message || 'Failed to load attendees');
      setLoading(false);
    }
  }, [id]);

  const filteredAttendees = attendees.filter(attendee =>
    attendee.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    attendee.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    attendee.ticketCode?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const checkedInCount = attendees.filter(a => a.checkedIn).length;

  if (loading || !event) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Skeleton className="h-10 w-32" />
            <div className="flex-1">
              <Skeleton className="h-8 w-48 mb-2" />
              <Skeleton className="h-4 w-64" />
            </div>
          </div>
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-4 w-32" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="space-y-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error || 'Event not found'}</AlertDescription>
        </Alert>
        <Link to="/organizer/dashboard">
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </Link>
      </div>
    );
  }


  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/organizer/dashboard">
            <Button variant="ghost">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{event.title}</h1>
            <p className="text-muted-foreground mt-1">Manage attendees</p>
          </div>
        </div>
        <Button 
          variant="outline" 
          disabled={attendees.length === 0}
          onClick={() => exportAttendeesToCSV(attendees, event.title)}
        >
          <Download className="mr-2 h-4 w-4" />
          Export List
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Registered</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{attendees.length}</div>
            <p className="text-xs text-muted-foreground">of {event.capacity} capacity</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Checked In</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{checkedInCount}</div>
            <p className="text-xs text-muted-foreground">
              {attendees.length > 0 ? Math.round((checkedInCount / attendees.length) * 100) : 0}% check-in rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Not Checked In</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{attendees.length - checkedInCount}</div>
            <p className="text-xs text-muted-foreground">Pending check-in</p>
          </CardContent>
        </Card>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Attendee List</CardTitle>
              <CardDescription>Search and manage registered attendees</CardDescription>
            </div>
          </div>
          <div className="relative mt-4">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, email, or ticket code..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardHeader>
        <CardContent>
          {filteredAttendees.length > 0 ? (
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
                {filteredAttendees.map((attendee) => (
                  <TableRow key={attendee.id}>
                    <TableCell className="font-medium">{attendee.name}</TableCell>
                    <TableCell>{attendee.email}</TableCell>
                    <TableCell>{attendee.company || '-'}</TableCell>
                    <TableCell className="font-mono text-xs">{attendee.ticketCode}</TableCell>
                    <TableCell>
                      {attendee.checkedIn ? (
                        <Badge className="bg-success">
                          <CheckCircle className="mr-1 h-3 w-3" />
                          Checked In
                        </Badge>
                      ) : (
                        <Badge variant="secondary">
                          <XCircle className="mr-1 h-3 w-3" />
                          Pending
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm" disabled>
                        
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Search className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-lg font-medium">
                {attendees.length === 0 ? 'No attendees registered yet' : 'No attendees found'}
              </p>
              <p className="text-sm text-muted-foreground">
                {attendees.length === 0
                  ? 'Check back once registrations start'
                  : 'Try adjusting your search criteria'}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default OrganizerAttendees;