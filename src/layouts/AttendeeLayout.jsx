import { Outlet, Link, useLocation } from 'react-router-dom';
import { Home, Calendar, Ticket, LogOut, Menu } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { logout } from '../services/authService';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useState } from 'react';

const AttendeeLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [open, setOpen] = useState(false);

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
    { to: '/attendee/home', icon: Home, label: 'Home' },
    { to: '/attendee/tickets', icon: Ticket, label: 'My Tickets' },
  ];

  const NavLinks = ({ mobile = false }) => (
    <nav className={`flex ${mobile ? 'flex-col space-y-2' : 'items-center space-x-6'}`}>
      {navItems.map((item) => (
        <Link
          key={item.to}
          to={item.to}
          onClick={() => mobile && setOpen(false)}
          className={`flex items-center gap-2 ${
            location.pathname === item.to
              ? 'text-attendee font-medium'
              : 'text-muted-foreground hover:text-foreground'
          } transition-colors`}
        >
          <item.icon className="h-4 w-4" />
          <span>{item.label}</span>
        </Link>
      ))}
    </nav>
  );

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="border-b border-border sticky top-0 z-50 glass shadow-sm">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link to="/attendee/home" className="flex items-center gap-2 group">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-attendee shadow-md group-hover:shadow-lg transition-shadow">
                <Calendar className="h-5 w-5 text-attendee-foreground" />
              </div>
              <div>
                <h1 className="text-lg font-semibold">Event Manager</h1>
              </div>
            </Link>
            <div className="hidden md:block">
              <NavLinks />
            </div>
          </div>

          <div className="flex items-center gap-4">
            {user ? (
              <>
                <div className="hidden md:flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-sm font-medium">{user.name}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                  <Button variant="outline" size="sm" onClick={handleLogout}>
                    <LogOut className="h-4 w-4" />
                  </Button>
                </div>
                <Sheet open={open} onOpenChange={setOpen}>
                  <SheetTrigger asChild className="md:hidden">
                    <Button variant="ghost" size="icon">
                      <Menu className="h-5 w-5" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="right" className="w-64">
                    <div className="flex flex-col gap-6 mt-6">
                      <div className="flex items-center gap-3 pb-4 border-b">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-attendee text-sm font-semibold text-attendee-foreground">
                          {user.name?.[0] || 'U'}
                        </div>
                        <div>
                          <p className="text-sm font-medium">{user.name}</p>
                          <p className="text-xs text-muted-foreground">{user.email}</p>
                        </div>
                      </div>
                      <NavLinks mobile />
                      <Button variant="outline" onClick={() => { handleLogout(); setOpen(false); }} className="w-full">
                        <LogOut className="mr-2 h-4 w-4" />
                        Logout
                      </Button>
                    </div>
                  </SheetContent>
                </Sheet>
              </>
            ) : (
              <Link to="/login">
                <Button variant="default">Login</Button>
              </Link>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8">
        <Outlet />
      </main>

      <footer className="border-t border-border py-6 bg-muted/30">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>&copy; 2026 Event Manager. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default AttendeeLayout;