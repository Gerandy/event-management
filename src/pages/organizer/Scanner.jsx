import { useState, useRef, useEffect } from 'react';
import { ScanLine, CheckCircle, XCircle, Search, AlertCircle, Camera, StopCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import QrScanner from 'qr-scanner';
import { getEventAttendees, checkInAttendee } from '@/services/attendeesService';
import { getEvent } from '@/services/eventsService';
import { useAuthStore } from '@/store/authStore';

const OrganizerScanner = () => {
  const { user } = useAuthStore();
  const videoRef = useRef(null);
  const qrScannerRef = useRef(null);

  const [isCameraActive, setIsCameraActive] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [manualCode, setManualCode] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const [error, setError] = useState(null);
  const [eventAttendees, setEventAttendees] = useState({});
  const [currentEvent, setCurrentEvent] = useState(null);
  const [eventId, setEventId] = useState('');
  const [loadingEvent, setLoadingEvent] = useState(false);

  // Load event data
  const handleLoadEvent = async () => {
    if (!eventId.trim()) {
      setError('Please enter an event ID');
      return;
    }

    setLoadingEvent(true);
    setError(null);

    try {
      const event = await getEvent(eventId);
      
      // Verify event belongs to current organizer
      if (event.organizerId !== user?.uid) {
        setError('You do not have permission to scan for this event');
        setLoadingEvent(false);
        return;
      }

      setCurrentEvent(event);

      // Load all attendees for this event
      const attendees = await getEventAttendees(eventId);
      const attendeeMap = {};
      attendees.forEach(attendee => {
        attendeeMap[attendee.ticketCode] = attendee;
      });
      setEventAttendees(attendeeMap);
      setLoadingEvent(false);
    } catch (err) {
      setError(err.message || 'Failed to load event');
      setLoadingEvent(false);
    }
  };

  // Start camera scanner
  const startCamera = async () => {
    if (!currentEvent) {
      setError('Please select an event first');
      return;
    }

    setError(null);
    setIsCameraActive(true);

    try {
      // Check if device has camera
      const devices = await QrScanner.listCameras(true);
      if (devices.length === 0) {
        setError('No camera device found. Using manual entry instead - please enter ticket codes manually.');
        return;
      }

      if (videoRef.current && !qrScannerRef.current) {
        qrScannerRef.current = new QrScanner(
          videoRef.current,
          result => {
            // Extract ticket code from QR data
            handleScan(result.data);
            // Stop scanning after successful scan
            if (qrScannerRef.current) {
              qrScannerRef.current.stop();
              setIsCameraActive(false);
            }
          },
          {
            onDecodeError: (error) => {
              // Silently ignore decode errors during scanning
            },
            maxScansPerSecond: 5,
          }
        );

        try {
          await qrScannerRef.current.start();
          setIsCameraActive(true);
        } catch (startError) {
          if (startError.name === 'NotAllowedError') {
            setError('Camera permission denied. Using manual entry instead.');
          } else if (startError.name === 'NotFoundError') {
            setError('No camera device found. Using manual entry instead.');
          } else if (startError.name === 'NotSupportedError') {
            setError('Camera is not supported on this device. Using manual entry instead.');
          } else {
            setError(`Using manual entry: ${startError.message}`);
          }
          qrScannerRef.current = null;
        }
      }
    } catch (err) {
      console.error('Camera initialization error:', err);
      setError('No camera available. Please use manual ticket code entry.');
    }
  };

  // Stop camera
  const stopCamera = async () => {
    if (qrScannerRef.current) {
      await qrScannerRef.current.stop();
      qrScannerRef.current.destroy();
      qrScannerRef.current = null;
      setIsCameraActive(false);
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const handleScan = async (ticketCode) => {
    setIsChecking(true);
    setError(null);

    try {
      // Check if ticket exists in current event's attendees
      const attendee = eventAttendees[ticketCode];

      if (!attendee) {
        setScanResult({
          success: false,
          message: 'Ticket not found for this event',
        });
      } else if (attendee.checkedIn) {
        setScanResult({
          success: true,
          name: attendee.name,
          email: attendee.email,
          ticketCode: attendee.ticketCode,
          eventTitle: currentEvent?.title,
          checkedIn: true,
          message: 'Already checked in',
        });
      } else {
        setScanResult({
          success: true,
          id: attendee.id,
          name: attendee.name,
          email: attendee.email,
          ticketCode: attendee.ticketCode,
          eventTitle: currentEvent?.title,
          checkedIn: false,
        });
      }
    } catch (err) {
      setError(err.message || 'Failed to scan ticket');
      setScanResult({
        success: false,
        message: 'Error scanning ticket',
      });
    } finally {
      setIsChecking(false);
    }
  };

  const handleManualVerify = async () => {
    if (manualCode.trim()) {
      await handleScan(manualCode.trim());
      setManualCode('');
    }
  };

  const handleCheckIn = async () => {
    if (scanResult && scanResult.id && !scanResult.checkedIn) {
      setIsChecking(true);
      setError(null);

      try {
        await checkInAttendee(scanResult.id);
        setScanResult({ ...scanResult, checkedIn: true, message: 'Checked in successfully!' });
        
        // Update the attendees list
        const updatedAttendee = { ...eventAttendees[scanResult.ticketCode], checkedIn: true };
        setEventAttendees({
          ...eventAttendees,
          [scanResult.ticketCode]: updatedAttendee,
        });
      } catch (err) {
        setError(err.message || 'Failed to check in attendee');
      } finally {
        setIsChecking(false);
      }
    }
  };


  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Event Check-In Scanner</h1>
        <p className="text-muted-foreground mt-1">Scan attendee QR codes or enter ticket codes manually</p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Event Selection */}
      {!currentEvent && (
        <Card>
          <CardHeader>
            <CardTitle>Select Event</CardTitle>
            <CardDescription>Choose an event to scan attendees for</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Input
                  placeholder="Enter event ID..."
                  value={eventId}
                  onChange={(e) => setEventId(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleLoadEvent()}
                />
              </div>
              <Button 
                onClick={handleLoadEvent}
                className="bg-organizer hover:bg-organizer/90"
                disabled={loadingEvent || !eventId.trim()}
              >
                {loadingEvent ? 'Loading...' : 'Load Event'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Event Loaded */}
      {currentEvent && (
        <>
          <Card className="bg-gradient-to-r from-organizer/5 to-organizer/10 border-organizer/20">
            <CardContent className="pt-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-muted-foreground">Current Event</p>
                  <p className="text-xl font-bold">{currentEvent.title}</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {Object.values(eventAttendees).filter(a => a.checkedIn).length} / {Object.keys(eventAttendees).length} checked in
                  </p>
                </div>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setCurrentEvent(null);
                    setEventAttendees({});
                    setScanResult(null);
                    setEventId('');
                  }}
                >
                  Change Event
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Scanner Tabs */}
          <Tabs defaultValue="manual" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="manual">
                <Search className="mr-2 h-4 w-4" />
                Manual Entry
              </TabsTrigger>
              <TabsTrigger value="camera">
                <Camera className="mr-2 h-4 w-4" />
                QR Camera
              </TabsTrigger>
            </TabsList>

            {/* Manual Entry Tab */}
            <TabsContent value="manual">
              <Card>
                <CardHeader>
                  <CardTitle>Manual Verification</CardTitle>
                  <CardDescription>Enter ticket code to verify attendee</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Enter ticket code..."
                        value={manualCode}
                        onChange={(e) => setManualCode(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleManualVerify()}
                        className="pl-10"
                        disabled={isChecking}
                      />
                    </div>
                    <Button 
                      onClick={handleManualVerify}
                      className="bg-organizer hover:bg-organizer/90"
                      disabled={isChecking || !manualCode.trim()}
                    >
                      {isChecking ? 'Verifying...' : 'Verify'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Camera Tab */}
            <TabsContent value="camera">
              <Card>
                <CardHeader>
                  <CardTitle>QR Code Camera</CardTitle>
                  <CardDescription>Position the QR code within the frame to scan</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {isCameraActive ? (
                    <div className="space-y-4">
                      <video
                        ref={videoRef}
                        className="w-full rounded-lg border-2 border-border bg-black"
                        style={{ maxHeight: '500px' }}
                        autoPlay
                        playsInline
                        muted
                      />
                      <Button 
                        onClick={stopCamera}
                        variant="destructive"
                        className="w-full"
                      >
                        <StopCircle className="mr-2 h-4 w-4" />
                        Stop Camera
                      </Button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12 border-2 border-dashed border-border rounded-lg bg-muted/20">
                      <ScanLine className="h-16 w-16 text-muted-foreground mb-4" />
                      <p className="text-sm text-muted-foreground mb-4">Ready to scan QR codes</p>
                      <Button 
                        onClick={startCamera}
                        className="bg-organizer hover:bg-organizer/90"
                      >
                        <Camera className="mr-2 h-4 w-4" />
                        Start Camera
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </>
      )}

      {/* Scan Result */}
      {scanResult && currentEvent && (
        <Card className="border-2">
          <CardContent className="pt-6">
            <Alert className={scanResult.success ? 'border-success bg-success/10' : 'border-destructive bg-destructive/10'}>
              <div className="flex items-start gap-4">
                {scanResult.success ? (
                  <CheckCircle className="h-5 w-5 text-success mt-0.5" />
                ) : (
                  <XCircle className="h-5 w-5 text-destructive mt-0.5" />
                )}
                <div className="flex-1 space-y-3">
                  <AlertDescription className="font-medium text-lg">
                    {scanResult.message || (scanResult.success ? 'Valid Ticket' : 'Invalid Ticket')}
                  </AlertDescription>
                  {scanResult.success && (
                    <div className="space-y-2 text-sm mt-4">
                      <p><span className="font-medium">Name:</span> {scanResult.name}</p>
                      <p><span className="font-medium">Email:</span> {scanResult.email}</p>
                      <p><span className="font-medium">Ticket Code:</span> {scanResult.ticketCode}</p>
                      <div className="pt-4">
                        {scanResult.checkedIn ? (
                          <Badge className="bg-success">Already Checked In</Badge>
                        ) : (
                          <Button 
                            onClick={handleCheckIn}
                            size="sm" 
                            className="bg-organizer hover:bg-organizer/90 w-full"
                            disabled={isChecking}
                          >
                            <CheckCircle className="mr-2 h-4 w-4" />
                            {isChecking ? 'Checking In...' : 'Check In Now'}
                          </Button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </Alert>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default OrganizerScanner;