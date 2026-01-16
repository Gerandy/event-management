import { Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Calendar, Users, BarChart3, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { logout } from '../services/authService';
import { Button } from '@/components/ui/button';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from '@/components/ui/sidebar';

const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const handleLogout = async () => {
    try {
      await logout();
      useAuthStore.getState().logout();
      navigate('/login', { replace: true });
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const navItems = [
    { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/admin/events', icon: Calendar, label: 'Events' },
    { to: '/admin/organizers', icon: Users, label: 'Organizers' },
    { to: '/admin/reports', icon: BarChart3, label: 'Reports' },
  ];

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader className="border-b border-sidebar-border p-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-admin">
              <Calendar className="h-5 w-5 text-admin-foreground" />
            </div>
            <div>
              <h2 className="text-sm font-semibold">Event Manager</h2>
              <p className="text-xs text-muted-foreground">Admin Portal</p>
            </div>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {navItems.map((item) => (
              <SidebarMenuItem key={item.to}>
                <SidebarMenuButton asChild isActive={location.pathname === item.to}>
                  <Link to={item.to}>
                    <item.icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter className="border-t border-sidebar-border p-4">
          <div className="mb-3 flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-admin text-xs font-semibold text-admin-foreground">
              {user?.name?.[0] || 'A'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user?.name || 'Admin User'}</p>
              <p className="text-xs text-muted-foreground truncate">{user?.email || 'admin@example.com'}</p>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={handleLogout} className="w-full">
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <main className="flex-1 overflow-auto">
          <div className="sticky top-0 z-40 flex items-center border-b bg-background px-4 py-2 md:hidden">
            <SidebarTrigger className="mr-2" />
            <span className="text-sm font-semibold">Event Manager</span>
          </div>
          <div className="p-6">
            <Outlet />
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default AdminLayout;