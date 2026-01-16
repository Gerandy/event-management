import { useState } from 'react';
import { Search, UserPlus, Mail, Calendar as CalendarIcon, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

const AdminOrganizers = () => {
  // Inline mock organizers data
  const mockOrganizers = [
    {
      id: 'org_001',
      name: 'Sarah Chen',
      email: 'sarah.chen@events.com',
      organization: 'Tech Events Inc',
      eventsCreated: 12,
      joinedAt: '2025-06-15',
      status: 'active',
    },
    {
      id: 'org_002',
      name: 'Miguel Rodriguez',
      email: 'miguel@musicfest.com',
      organization: 'Global Music Festivals',
      eventsCreated: 8,
      joinedAt: '2025-08-22',
      status: 'active',
    },
    {
      id: 'org_003',
      name: 'Priya Patel',
      email: 'priya@businesssummit.com',
      organization: 'Corporate Events Ltd',
      eventsCreated: 15,
      joinedAt: '2025-03-10',
      status: 'active',
    },
    {
      id: 'org_004',
      name: 'James Wilson',
      email: 'james.w@sports.com',
      organization: 'Sports Arena',
      eventsCreated: 5,
      joinedAt: '2025-11-01',
      status: 'active',
    },
    {
      id: 'org_005',
      name: 'Lisa Anderson',
      email: 'lisa@artexpo.com',
      organization: 'Art Expo Co',
      eventsCreated: 3,
      joinedAt: '2026-01-05',
      status: 'inactive',
    },
  ];

  const [searchTerm, setSearchTerm] = useState('');

  const filteredOrganizers = mockOrganizers.filter((org) =>
    org.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    org.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    org.organization.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Organizers & Staff</h1>
          <p className="text-muted-foreground mt-1">Manage event organizers and their permissions</p>
        </div>
        <Button>
          <UserPlus className="mr-2 h-4 w-4" />
          Add Organizer
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search organizers..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Organizers ({filteredOrganizers.length})</CardTitle>
          <CardDescription>View and manage event organizers</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Organizer</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Organization</TableHead>
                <TableHead>Events Created</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrganizers.map((organizer) => (
                <TableRow key={organizer.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback className="bg-organizer text-organizer-foreground">
                          {organizer.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{organizer.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{organizer.email}</TableCell>
                  <TableCell>{organizer.organization}</TableCell>
                  <TableCell className="text-center">{organizer.eventsCreated}</TableCell>
                  <TableCell className="text-muted-foreground">{organizer.joinedAt}</TableCell>
                  <TableCell>
                    {organizer.status === 'active' ? (
                      <Badge variant="default" className="bg-success">
                        <CheckCircle className="mr-1 h-3 w-3" />
                        Active
                      </Badge>
                    ) : (
                      <Badge variant="secondary">
                        <XCircle className="mr-1 h-3 w-3" />
                        Inactive
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm">
                        <Mail className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        Edit
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredOrganizers.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <UserPlus className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-lg font-medium">No organizers found</p>
              <p className="text-sm text-muted-foreground">Try adjusting your search criteria</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminOrganizers;