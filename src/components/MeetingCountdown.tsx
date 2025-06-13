import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Video, Calendar } from 'lucide-react';

interface MeetingCountdownProps {
  meetingTime: string; // ISO date string
  meetingLink: string;
  title: string;
  duration?: number;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const MeetingCountdown = ({ meetingTime, meetingLink, title, duration = 60 }: MeetingCountdownProps) => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isMeetingActive, setIsMeetingActive] = useState(false);
  const [isMeetingPassed, setIsMeetingPassed] = useState(false);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const meetingDate = new Date(meetingTime).getTime();
      const difference = meetingDate - now;

      if (difference > 0) {
        // Meeting is in the future
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeLeft({ days, hours, minutes, seconds });
        setIsMeetingActive(false);
        setIsMeetingPassed(false);
      } else if (difference > -(duration * 60 * 1000)) {
        // Meeting is currently active (within duration window)
        setIsMeetingActive(true);
        setIsMeetingPassed(false);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      } else {
        // Meeting has passed
        setIsMeetingPassed(true);
        setIsMeetingActive(false);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [meetingTime, duration]);

  const handleJoinMeeting = () => {
    window.open(meetingLink, '_blank');
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isMeetingPassed) {
    return (
      <Card className="border-gray-200 bg-gray-50">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600">Meeting completed</span>
            </div>
            <Badge variant="secondary" className="text-xs">
              Ended
            </Badge>
          </div>
          <p className="text-xs text-gray-500 mt-1">{title}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`border-2 ${isMeetingActive ? 'border-green-500 bg-green-50' : 'border-blue-500 bg-blue-50'}`}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-blue-600" />
            <span className="font-medium text-sm text-gray-900">{title}</span>
          </div>
          <Badge 
            variant={isMeetingActive ? "default" : "secondary"}
            className={`text-xs ${isMeetingActive ? 'bg-green-600' : 'bg-blue-600'}`}
          >
            {isMeetingActive ? 'Live Now' : 'Scheduled'}
          </Badge>
        </div>

        <div className="text-xs text-gray-600 mb-3">
          <div className="flex items-center space-x-1">
            <Clock className="w-3 h-3" />
            <span>{formatDateTime(meetingTime)}</span>
          </div>
        </div>

        {isMeetingActive ? (
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-green-600">
              <Video className="w-4 h-4" />
              <span className="text-sm font-medium">Meeting is live!</span>
            </div>
            <Button 
              onClick={handleJoinMeeting}
              className="w-full bg-green-600 hover:bg-green-700 text-white"
              size="sm"
            >
              <Video className="w-4 h-4 mr-2" />
              Join Meeting
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="grid grid-cols-4 gap-2 text-center">
              <div className="bg-white rounded-lg p-2">
                <div className="text-lg font-bold text-blue-600">{timeLeft.days}</div>
                <div className="text-xs text-gray-500">Days</div>
              </div>
              <div className="bg-white rounded-lg p-2">
                <div className="text-lg font-bold text-blue-600">{timeLeft.hours}</div>
                <div className="text-xs text-gray-500">Hours</div>
              </div>
              <div className="bg-white rounded-lg p-2">
                <div className="text-lg font-bold text-blue-600">{timeLeft.minutes}</div>
                <div className="text-xs text-gray-500">Min</div>
              </div>
              <div className="bg-white rounded-lg p-2">
                <div className="text-lg font-bold text-blue-600">{timeLeft.seconds}</div>
                <div className="text-xs text-gray-500">Sec</div>
              </div>
            </div>
            
            <Button 
              onClick={handleJoinMeeting}
              variant="outline"
              className="w-full border-blue-200 text-blue-600 hover:bg-blue-50"
              size="sm"
            >
              <Video className="w-4 h-4 mr-2" />
              Preview Meeting Link
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MeetingCountdown;