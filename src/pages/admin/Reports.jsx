import { Download, TrendingUp, Users, Calendar as CalendarIcon, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';

const AdminReports = () => {
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
  ];

  // Inline mock attendees data
  const mockAttendees = [
    {
      id: 'att_001',
      name: 'Maria Garcia',
      email: 'maria.garcia@email.com',
      eventId: 'evt_001',
      checkedIn: true,
      registeredAt: '2026-01-12T10:30:00Z',
    },
    {
      id: 'att_002',
      name: 'James Chen',
      email: 'james.chen@email.com',
      eventId: 'evt_001',
      checkedIn: true,
      registeredAt: '2026-01-11T14:22:00Z',
    },
    {
      id: 'att_003',
      name: 'Sofia Rodriguez',
      email: 'sofia.r@email.com',
      eventId: 'evt_002',
      checkedIn: false,
      registeredAt: '2026-01-10T08:15:00Z',
    },
    {
      id: 'att_004',
      name: 'Akira Tanaka',
      email: 'akira.tanaka@email.com',
      eventId: 'evt_003',
      checkedIn: true,
      registeredAt: '2026-01-09T12:45:00Z',
    },
    {
      id: 'att_005',
      name: 'Emma Thompson',
      email: 'emma.t@email.com',
      eventId: 'evt_001',
      checkedIn: false,
      registeredAt: '2026-01-13T09:20:00Z',
    },
  ];

  const totalEvents = mockEvents.length;
  const totalAttendees = mockAttendees.length;
  const checkedInCount = mockAttendees.filter(a => a.checkedIn).length;
  const avgAttendance = totalEvents > 0 ? (totalAttendees / totalEvents).toFixed(1) : 0;

  const registrationTrend = [
    { month: 'Jan', registrations: 45 },
    { month: 'Feb', registrations: 52 },
    { month: 'Mar', registrations: 48 },
    { month: 'Apr', registrations: 65 },
    { month: 'May', registrations: 58 },
  ];

  const eventTypeData = [
    { name: 'Technology', value: 40, color: 'hsl(var(--chart-1))' },
    { name: 'Music', value: 30, color: 'hsl(var(--chart-2))' },
    { name: 'Business', value: 20, color: 'hsl(var(--chart-3))' },
    { name: 'Education', value: 10, color: 'hsl(var(--chart-4))' },
  ];

  const chartConfig = {
    registrations: {
      label: 'Registrations',
      color: 'hsl(var(--chart-1))',
    },
  };

  const handleExport = () => {
    alert('Export functionality would download CSV/Excel file');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reports & Analytics</h1>
          <p className="text-muted-foreground mt-1">Track attendance and export data</p>
        </div>
        <Button onClick={handleExport}>
          <Download className="mr-2 h-4 w-4" />
          Export Data
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Events</CardTitle>
            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalEvents}</div>
            <p className="text-xs text-muted-foreground">All time events</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Attendees</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalAttendees}</div>
            <p className="text-xs text-muted-foreground">All registrations</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Check-in Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalAttendees > 0 ? Math.round((checkedInCount / totalAttendees) * 100) : 0}%
            </div>
            <p className="text-xs text-muted-foreground">{checkedInCount} checked in</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Attendance</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgAttendance}</div>
            <p className="text-xs text-muted-foreground">Per event</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Registration Trends</CardTitle>
            <CardDescription>Monthly registration overview</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={registrationTrend}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="month" className="text-xs" />
                  <YAxis className="text-xs" />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line type="monotone" dataKey="registrations" stroke="hsl(var(--chart-1))" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Event Types Distribution</CardTitle>
            <CardDescription>Events by category</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={eventTypeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {eventTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <ChartTooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Event Performance</CardTitle>
          <CardDescription>Detailed breakdown of event statistics</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Event</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Registered</TableHead>
                <TableHead>Capacity</TableHead>
                <TableHead>Utilization</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockEvents.map((event) => {
                const utilization = Math.round((event.registered / event.capacity) * 100);
                return (
                  <TableRow key={event.id}>
                    <TableCell className="font-medium">{event.title}</TableCell>
                    <TableCell className="text-muted-foreground">{event.date}</TableCell>
                    <TableCell>{event.registered}</TableCell>
                    <TableCell>{event.capacity}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary"
                            style={{ width: `${utilization}%` }}
                          />
                        </div>
                        <span className="text-sm text-muted-foreground w-12">{utilization}%</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={event.status === 'upcoming' ? 'default' : 'secondary'}>
                        {event.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminReports;