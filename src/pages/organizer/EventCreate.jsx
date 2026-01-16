import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Calendar as CalendarIcon, Save, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
import { createEvent } from '@/services/eventsService';

const OrganizerEventCreate = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);
  const [successEventTitle, setSuccessEventTitle] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    capacity: '',
    category: 'General',
    imageUrl: '',
    eventCode: '',
  });

  const generateEventCode = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 5; i++) {
      code += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    setFormData(prev => ({ ...prev, eventCode: code }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (!user?.uid) {
        setError('User not authenticated');
        setLoading(false);
        return;
      }

      const eventData = {
        title: formData.title,
        description: formData.description,
        date: formData.date,
        time: formData.time,
        location: formData.location,
        capacity: parseInt(formData.capacity, 10),
        category: formData.category,
        imageUrl: formData.imageUrl || null,
        eventCode: formData.eventCode,
        organizerId: user.uid,
        status: 'upcoming',
        registered: 0,
      };

      await createEvent(eventData);
      setSuccessEventTitle(formData.title);
      setSuccessDialogOpen(true);
    } catch (err) {
      setError(err.message || 'Failed to create event');
      console.error('Error creating event:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSuccessClose = () => {
    setSuccessDialogOpen(false);
    navigate('/organizer/dashboard');
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto fade-in">
      <div className="flex items-center gap-4">
        <Link to="/organizer/dashboard">
          <Button variant="ghost">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Create New Event</h1>
          <p className="text-muted-foreground mt-1">Fill in the details for your event</p>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5 text-primary" />
            Event Details
          </CardTitle>
          <CardDescription>Provide information about your event</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Event Title *</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g., Tech Conference 2026"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe your event..."
                rows={4}
                required
              />
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="date">Event Date *</Label>
                <Input
                  id="date"
                  name="date"
                  type="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="time">Event Time *</Label>
                <Input
                  id="time"
                  name="time"
                  type="time"
                  value={formData.time}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location *</Label>
              <Input
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g., San Francisco Convention Center"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="capacity">Capacity *</Label>
              <Input
                id="capacity"
                name="capacity"
                type="number"
                value={formData.capacity}
                onChange={handleChange}
                placeholder="e.g., 500"
                min="1"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="eventCode">Event Code *</Label>
              <div className="flex gap-2">
                <Input
                  id="eventCode"
                  name="eventCode"
                  value={formData.eventCode}
                  onChange={handleChange}
                  placeholder="e.g., ABC12"
                  maxLength="5"
                  required
                  className="uppercase"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={generateEventCode}
                  className="shrink-0"
                >
                  Generate
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">5-character code for attendees to use</p>
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="submit" className="bg-organizer hover:bg-organizer/90" disabled={loading}>
                <Save className="mr-2 h-4 w-4" />
                {loading ? 'Creating...' : 'Create Event'}
              </Button>
              <Link to="/organizer/dashboard">
                <Button type="button" variant="outline" disabled={loading}>
                  Cancel
                </Button>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
      <Dialog open={successDialogOpen} onOpenChange={setSuccessDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <div className="flex justify-center mb-4">
              <div className="h-16 w-16 rounded-full bg-success/10 flex items-center justify-center">
                <CheckCircle className="h-8 w-8 text-success" />
              </div>
            </div>
            <DialogTitle className="text-center">Event Created Successfully!</DialogTitle>
            <DialogDescription className="text-center">
              Your event "{successEventTitle}" has been created and is now visible to attendees.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={handleSuccessClose} className="w-full">
              Go to Dashboard
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OrganizerEventCreate;