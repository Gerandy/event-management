import { AlertCircle, ExternalLink, CheckCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const FirebaseSetupGuide = () => {
  const steps = [
    {
      title: 'Create Firebase Project',
      description: 'Go to Firebase Console and create a new project or select existing one',
      link: 'https://console.firebase.google.com/',
    },
    {
      title: 'Enable Firestore Database',
      description: 'Build > Firestore Database > Create database (Start in test mode)',
      important: true,
    },
    {
      title: 'Enable Authentication',
      description: 'Build > Authentication > Get Started > Enable Email/Password',
      important: true,
    },
    {
      title: 'Get Configuration',
      description: 'Project Settings > Your apps > Add web app > Copy config',
    },
    {
      title: 'Update Environment Variables',
      description: 'Add Firebase config to frontend/.env file',
    },
    {
      title: 'Restart Dev Server',
      description: 'Stop and restart npm run dev',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex items-center justify-center p-4">
      <Card className="max-w-3xl w-full">
        <CardHeader>
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-destructive/10">
              <AlertCircle className="h-6 w-6 text-destructive" />
            </div>
            <div>
              <CardTitle className="text-2xl">Firebase Setup Required</CardTitle>
              <CardDescription>Complete these steps to get started</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Firestore Not Available</AlertTitle>
            <AlertDescription>
              Firebase Firestore is not enabled or not properly configured. Follow the steps below to set it up.
            </AlertDescription>
          </Alert>

          <div className="space-y-4">
            {steps.map((step, index) => (
              <div
                key={index}
                className={`flex gap-4 p-4 rounded-lg border ${
                  step.important ? 'bg-primary/5 border-primary/20' : 'bg-card'
                }`}
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold">
                  {index + 1}
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">{step.title}</h3>
                    {step.important && (
                      <span className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded">
                        Required
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                  {step.link && (
                    <a
                      href={step.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-sm text-primary hover:underline mt-2"
                    >
                      Open Firebase Console
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="bg-muted/50 p-4 rounded-lg space-y-3">
            <h4 className="font-semibold flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-primary" />
              Quick Reference
            </h4>
            <div className="text-sm space-y-2 text-muted-foreground">
              <p>
                <strong>Environment file:</strong> <code className="bg-background px-2 py-1 rounded">frontend/.env</code>
              </p>
              <p>
                <strong>Detailed guide:</strong> See{' '}
                <code className="bg-background px-2 py-1 rounded">FIREBASE_SETUP.md</code> in project root
              </p>
              <p>
                <strong>Need help?</strong> Check the console for specific error messages
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              variant="default"
              onClick={() => window.location.reload()}
              className="flex-1"
            >
              I've completed setup - Reload
            </Button>
            <Button
              variant="outline"
              onClick={() => window.open('https://console.firebase.google.com/', '_blank')}
              className="flex-1"
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              Open Firebase Console
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FirebaseSetupGuide;