import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Calendar, MapPin, Users, Clock, MoreVertical, Edit, Trash2, Eye, AlertCircle, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useAuthStore } from '@/store/authStore';
import { subscribeToOrganizerEvents, deleteEvent } from '@/services/eventsService';
import { exportEventsToCSV } from '@/utils/csvExport';
import { format } from 'date-fns';

export default function OrganizerDashboard() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Subscribe to organizer's events
  useEffect(() => {
    if (!user?.uid) {
      setLoading(false);
      return;
    }

    try {
      const unsubscribe = subscribeToOrganizerEvents(user.uid, (fetchedEvents) => {
        setEvents(fetchedEvents);
        setLoading(false);
      });

      return () => unsubscribe();
    } catch (err) {
      console.error("Error subscribing to events:", err);
      setError("Failed to load events");
      setLoading(false);
    }
  }, [user?.uid]);

  const handleDeleteClick = (event) => {
    setEventToDelete(event);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!eventToDelete) return;

    setDeleting(true);
    try {
      await deleteEvent(eventToDelete.id);
      setEvents(events.filter(e => e.id !== eventToDelete.id));
      setDeleteDialogOpen(false);
      setEventToDelete(null);
    } catch (err) {
      console.error("Error deleting event:", err);
      setError("Failed to delete event");
    } finally {
      setDeleting(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      upcoming: 'bg-info text-info-foreground',
      ongoing: 'bg-success text-success-foreground',
      completed: 'bg-muted text-muted-foreground',
      cancelled: 'bg-destructive text-destructive-foreground',
    };
    return colors[status] || colors.upcoming;
  };
  const normalizeDate = (date) => {
  if (!date) return null;

  // Firestore Timestamp
  if (date instanceof Timestamp) {
    return date.toDate();
  }

  // ISO string or normal string
  if (typeof date === "string") {
    const parsed = new Date(date);
    return isNaN(parsed) ? null : parsed;
  }

  // Already a Date
  if (date instanceof Date) {
    return date;
  }

  return null;
};
const eventDate = normalizeDate(event.date);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-64" />
          </div>
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <Skeleton className="aspect-video w-full rounded-t-lg" />
              <CardHeader>
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-full" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-20 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Events</h1>
          <p className="text-muted-foreground mt-1">
            Manage and track your organized events
          </p>
        </div>
        <Button onClick={() => navigate('/organizer/events/create')} className="w-full sm:w-auto">
          <Plus className="mr-2 h-4 w-4" />
          Create Event
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {events.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Calendar className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No events yet</h3>
            <p className="text-sm text-muted-foreground mb-6 text-center max-w-sm">
              Get started by creating your first event. You can manage registrations, check-ins, and more.
            </p>
            <Button onClick={() => navigate('/organizer/events/create')}>
              <Plus className="mr-2 h-4 w-4" />
              Create Your First Event
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <Card key={event.id} className="overflow-hidden card-hover fade-in">
              <div className="aspect-video relative overflow-hidden bg-gradient-to-br from-primary/10 to-secondary/10">
                {event.imageUrl ? (
                  <img
                    src={event.imageUrl}
                    alt={event.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Calendar className="h-16 w-16 text-muted-foreground" />
                  </div>
                )}
                <div className="absolute top-3 right-3">
                  <Badge className={getStatusColor(event.status)}>
                    {event.status}
                  </Badge>
                </div>
              </div>
              
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-lg line-clamp-1">{event.title}</CardTitle>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => navigate(`/organizer/events/${event.id}/edit`)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit Event
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate(`/organizer/events/${event.id}/attendees`)}>
                        <Eye className="mr-2 h-4 w-4" />
                        View Attendees
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => handleDeleteClick(event)}
                        className="text-destructive focus:text-destructive"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete Event
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <CardDescription className="line-clamp-2">
                  {event.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="h-4 w-4 shrink-0" />
                  <span>{format(new Date(event.date), 'PPP')} at {event.time}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-4 w-4 shrink-0" />
                  <span className="line-clamp-1">{event.location}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Users className="h-4 w-4 shrink-0" />
                  <span>
                    {event.registered || 0} / {event.capacity} registered
                  </span>
                </div>
                
                <div className="pt-2">
                  <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-primary to-primary/80 progress-animate"
                      style={{ 
                        width: `${Math.min(((event.registered || 0) / event.capacity) * 100, 100)}%` 
                      }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Event</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{eventToDelete?.title}"? This action cannot be undone.
              All registrations and data associated with this event will be permanently removed.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)} disabled={deleting}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirm} disabled={deleting}>
              {deleting ? "Deleting..." : "Delete Event"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}