import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Lock, Mail, AlertCircle, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuthStore } from '@/store/authStore';
import { login, register } from '@/services/authService';

const Login = () => {
  const navigate = useNavigate();
  const { isAuthenticated, role, login: setLogin } = useAuthStore();
  
  // Login state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  
  // Signup state
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirmPassword, setSignupConfirmPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [signupRole, setSignupRole] = useState('attendee');
  const [signupError, setSignupError] = useState('');
  const [signupSuccess, setSignupSuccess] = useState('');
  const [signupLoading, setSignupLoading] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && role) {
      const redirectPath = role === 'attendee' ? `/${role}/home` : `/${role}/dashboard`;
      navigate(redirectPath, { replace: true });
    }
  }, [isAuthenticated, role, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) {
      setLoginError('Please enter both email and password');
      return;
    }

    setLoginLoading(true);
    setLoginError('');

    try {
      const user = await login(loginEmail, loginPassword);
      
      // Get role from user data
      const userRole = user.role || 'attendee';
      
      // Update auth store
      setLogin(user, userRole);
      
      // Navigate to appropriate dashboard
      const redirectPath = userRole === 'attendee' ? `/${userRole}/home` : `/${userRole}/dashboard`;
      navigate(redirectPath, { replace: true });
    } catch (err) {
      setLoginError(err.message || 'Login failed. Please check your credentials.');
      setLoginLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setSignupError('');
    setSignupSuccess('');

    // Validation
    if (!signupEmail || !signupPassword || !displayName) {
      setSignupError('Please fill in all fields');
      return;
    }

    if (signupPassword.length < 6) {
      setSignupError('Password must be at least 6 characters');
      return;
    }

    if (signupPassword !== signupConfirmPassword) {
      setSignupError('Passwords do not match');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(signupEmail)) {
      setSignupError('Please enter a valid email address');
      return;
    }

    setSignupLoading(true);

    try {
      const newUser = await register(signupEmail, signupPassword, displayName, signupRole);
      
      setSignupSuccess('Account created successfully! You can now login.');
      
      // Reset form
      setSignupEmail('');
      setSignupPassword('');
      setSignupConfirmPassword('');
      setDisplayName('');
      
      // Auto-login after signup
      setTimeout(async () => {
        try {
          const user = await login(signupEmail, signupPassword);
          const userRole = user.role || 'attendee';
          setLogin(user, userRole);
          const redirectPath = userRole === 'attendee' ? `/${userRole}/home` : `/${userRole}/dashboard`;
          navigate(redirectPath, { replace: true });
        } catch (err) {
          console.error('Auto-login failed:', err);
        }
      }, 1500);
    } catch (err) {
      setSignupError(err.message || 'Registration failed. Please try again.');
      setSignupLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/5 p-4">
      <Card className="w-full max-w-md fade-in">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl gradient-primary shadow-lg">
              <Calendar className="h-8 w-8 text-primary-foreground" />
            </div>
          </div>
          <CardTitle className="text-2xl text-gradient">Event Manager</CardTitle>
          <CardDescription>Create an account or sign in to continue</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>

            {/* Login Tab */}
            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4 mt-6">
                {loginError && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{loginError}</AlertDescription>
                  </Alert>
                )}
                
                <div className="space-y-2">
                  <Label htmlFor="login-email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="your@email.com"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      className="pl-10"
                      disabled={loginLoading}
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="login-password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="login-password"
                      type="password"
                      placeholder="••••••••"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      className="pl-10"
                      disabled={loginLoading}
                      required
                    />
                  </div>
                </div>
                
                <Button type="submit" className="w-full" disabled={loginLoading}>
                  {loginLoading ? 'Signing in...' : 'Sign In'}
                </Button>
              </form>
            </TabsContent>

            {/* Signup Tab */}
            <TabsContent value="signup">
              <form onSubmit={handleSignup} className="space-y-4 mt-6">
                {signupError && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{signupError}</AlertDescription>
                  </Alert>
                )}
                
                {signupSuccess && (
                  <Alert className="bg-green-50 border-green-200">
                    <AlertCircle className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-800">{signupSuccess}</AlertDescription>
                  </Alert>
                )}
                
                <div className="space-y-2">
                  <Label htmlFor="display-name">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="display-name"
                      type="text"
                      placeholder="John Doe"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      className="pl-10"
                      disabled={signupLoading}
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="your@email.com"
                      value={signupEmail}
                      onChange={(e) => setSignupEmail(e.target.value)}
                      className="pl-10"
                      disabled={signupLoading}
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="signup-password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="signup-password"
                      type="password"
                      placeholder="••••••••"
                      value={signupPassword}
                      onChange={(e) => setSignupPassword(e.target.value)}
                      className="pl-10"
                      disabled={signupLoading}
                      required
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">Minimum 6 characters</p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="confirm-password"
                      type="password"
                      placeholder="••••••••"
                      value={signupConfirmPassword}
                      onChange={(e) => setSignupConfirmPassword(e.target.value)}
                      className="pl-10"
                      disabled={signupLoading}
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="role-select">Account Type</Label>
                  <select
                    id="role-select"
                    value={signupRole}
                    onChange={(e) => setSignupRole(e.target.value)}
                    disabled={signupLoading}
                    className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm"
                  >
                    <option value="attendee">Attendee</option>
                    <option value="organizer">Event Organizer</option>
                  </select>
                </div>
                
                <Button type="submit" className="w-full" disabled={signupLoading}>
                  {signupLoading ? 'Creating account...' : 'Create Account'}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;