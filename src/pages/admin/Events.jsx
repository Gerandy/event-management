import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Eye, Edit, Trash2, MapPin, Calendar as CalendarIcon, Users, MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
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
import { format } from 'date-fns';

const AdminEvents = () => {
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
    },
    {
      id: 'evt_004',
      title: 'Web Development Workshop',
      description: 'Hands-on workshop for learning modern web development practices.',
      date: '2026-02-28',
      time: '10:00 AM',
      location: 'Digital Hub, Austin',
      capacity: 100,
      registered: 87,
      status: 'upcoming',
      category: 'Education',
      imageUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80',
      organizerId: 'org_002',
    },
    {
      id: 'evt_005',
      title: 'Art Exhibition Opening',
      description: 'Contemporary art exhibition featuring emerging artists.',
      date: '2026-04-05',
      time: '06:00 PM',
      location: 'Modern Art Museum, Los Angeles',
      capacity: 250,
      registered: 156,
      status: 'upcoming',
      category: 'Art',
      imageUrl: 'https://images.unsplash.com/photo-1578926078328-123456789abc?w=800&q=80',
      organizerId: 'org_003',
    },
  ];

  const [events, setEvents] = useState(mockEvents);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState(null);

  const handleDeleteClick = (event) => {
    setEventToDelete(event);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (!eventToDelete) return;
    
    setEvents(events.filter(e => e.id !== eventToDelete.id));
    setDeleteDialogOpen(false);
    setEventToDelete(null);
  };

  const filteredEvents = events.filter((event) => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || event.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status) => {
    const colors = {
      upcoming: 'bg-info text-info-foreground',
      ongoing: 'bg-success text-success-foreground',
      completed: 'bg-muted text-muted-foreground',
      cancelled: 'bg-destructive text-destructive-foreground',
    };
    return colors[status] || colors.upcoming;
  };

  return (
    <div className="space-y-6 fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Events</h1>
          <p className="text-muted-foreground mt-1">Manage all events in the system</p>
        </div>
      </div>

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
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <Filter className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Events</SelectItem>
            <SelectItem value="upcoming">Upcoming</SelectItem>
            <SelectItem value="past">Past</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredEvents.map((event) => (
          <Card key={event.id} className="flex flex-col card-hover">
            <CardHeader className="p-0 relative">
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
              <div className="absolute top-3 right-3">
                <Badge className={getStatusColor(event.status)}>
                  {event.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="flex-1 pt-4">
              <div className="flex items-start justify-between mb-2">
                <CardTitle className="text-lg line-clamp-1">{event.title}</CardTitle>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link to={`/admin/events/${event.id}`}>
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                      </Link>
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
              <CardDescription className="line-clamp-2 mb-4">{event.description}</CardDescription>
              <div className="space-y-2 text-sm">
                <div className="flex items-center text-muted-foreground">
                  <CalendarIcon className="mr-2 h-4 w-4 shrink-0" />
                  <span>{format(new Date(event.date), 'PPP')} at {event.time}</span>
                </div>
                <div className="flex items-center text-muted-foreground">
                  <MapPin className="mr-2 h-4 w-4 shrink-0" />
                  <span className="line-clamp-1">{event.location}</span>
                </div>
                <div className="flex items-center text-muted-foreground">
                  <Users className="mr-2 h-4 w-4 shrink-0" />
                  <span>{event.registered || 0} / {event.capacity} registered</span>
                </div>
              </div>
              {event.category && (
                <div className="mt-3">
                  <Badge variant="outline" className="text-xs">
                    {event.category}
                  </Badge>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredEvents.length === 0 && !loading && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <CalendarIcon className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-medium">No events found</p>
            <p className="text-sm text-muted-foreground">
              {events.length === 0 
                ? 'No events have been created yet' 
                : 'Try adjusting your search or filter criteria'}
            </p>
          </CardContent>
        </Card>
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
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirm}>
              Delete Event
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminEvents;