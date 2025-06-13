import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Clock, Video, Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ScheduleInterviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSchedule: (meetingData: MeetingData) => void;
  applicant: {
    id: string;
    freelancer: {
      user: {
        name: string;
        email: string;
      };
    };
    project: {
      title: string;
    };
  };
  isLoading?: boolean;
}

interface MeetingData {
  googleMeetLink: string;
  meetingDate: string;
  meetingTime: string;
  timezone: string;
  meetingTitle: string;
  meetingDescription: string;
  duration: number;
  meetingType: string;
}

const ScheduleInterviewModal = ({ 
  isOpen, 
  onClose, 
  onSchedule, 
  applicant, 
  isLoading = false 
}: ScheduleInterviewModalProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<MeetingData>({
    googleMeetLink: '',
    meetingDate: '',
    meetingTime: '',
    timezone: 'UTC',
    meetingTitle: 'Application Interview',
    meetingDescription: `Interview to discuss application for project: ${applicant?.project?.title || ''}`,
    duration: 60,
    meetingType: 'INTERVIEW'
  });

  const [errors, setErrors] = useState<Partial<MeetingData>>({});

  const handleInputChange = (field: keyof MeetingData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<MeetingData> = {};

    if (!formData.googleMeetLink.trim()) {
      newErrors.googleMeetLink = 'Meeting link is required';
    } else if (!formData.googleMeetLink.includes('meet.google.com') && !formData.googleMeetLink.includes('zoom.us')) {
      newErrors.googleMeetLink = 'Please provide a valid Google Meet or Zoom link';
    }

    if (!formData.meetingDate) {
      newErrors.meetingDate = 'Meeting date is required';
    } else {
      const selectedDate = new Date(formData.meetingDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (selectedDate < today) {
        newErrors.meetingDate = 'Meeting date cannot be in the past';
      }
    }

    if (!formData.meetingTime) {
      newErrors.meetingTime = 'Meeting time is required';
    }

    if (!formData.meetingTitle.trim()) {
      newErrors.meetingTitle = 'Meeting title is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fix the errors before scheduling the interview.",
        variant: "destructive",
      });
      return;
    }

    onSchedule(formData);
  };

  const handleReset = () => {
    setFormData({
      googleMeetLink: '',
      meetingDate: '',
      meetingTime: '',
      timezone: 'UTC',
      meetingTitle: 'Application Interview',
      meetingDescription: `Interview to discuss application for project: ${applicant?.project?.title || ''}`,
      duration: 60,
      meetingType: 'INTERVIEW'
    });
    setErrors({});
  };

  const timezones = [
    'UTC',
    'America/New_York',
    'America/Los_Angeles',
    'Europe/London',
    'Europe/Paris',
    'Asia/Tokyo',
    'Asia/Shanghai',
    'Asia/Kolkata',
    'Australia/Sydney'
  ];

  const meetingTypes = [
    { value: 'INTERVIEW', label: 'Interview' },
    { value: 'DISCUSSION', label: 'Discussion' },
    { value: 'CLARIFICATION', label: 'Clarification' }
  ];

  const durations = [
    { value: 30, label: '30 minutes' },
    { value: 45, label: '45 minutes' },
    { value: 60, label: '1 hour' },
    { value: 90, label: '1.5 hours' },
    { value: 120, label: '2 hours' }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Video className="w-5 h-5 text-blue-600" />
            Schedule Interview
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Applicant Info */}
          <div className="p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">Scheduling interview with:</h4>
            <div className="text-sm text-gray-600">
              <p><strong>Freelancer:</strong> {applicant?.freelancer?.user?.name}</p>
              <p><strong>Email:</strong> {applicant?.freelancer?.user?.email}</p>
              <p><strong>Project:</strong> {applicant?.project?.title}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Meeting Link */}
            <div className="space-y-2">
              <Label htmlFor="meetingLink">
                Meeting Link <span className="text-red-500">*</span>
              </Label>
              <Input
                id="meetingLink"
                type="url"
                placeholder="https://meet.google.com/abc-defg-hij or https://zoom.us/j/123456789"
                value={formData.googleMeetLink}
                onChange={(e) => handleInputChange('googleMeetLink', e.target.value)}
                className={errors.googleMeetLink ? 'border-red-500' : ''}
              />
              {errors.googleMeetLink && (
                <p className="text-red-500 text-sm">{errors.googleMeetLink}</p>
              )}
            </div>

            {/* Date and Time */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="meetingDate">
                  Date <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="meetingDate"
                  type="date"
                  value={formData.meetingDate}
                  onChange={(e) => handleInputChange('meetingDate', e.target.value)}
                  className={errors.meetingDate ? 'border-red-500' : ''}
                  min={new Date().toISOString().split('T')[0]}
                />
                {errors.meetingDate && (
                  <p className="text-red-500 text-sm">{errors.meetingDate}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="meetingTime">
                  Time <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="meetingTime"
                  type="time"
                  value={formData.meetingTime}
                  onChange={(e) => handleInputChange('meetingTime', e.target.value)}
                  className={errors.meetingTime ? 'border-red-500' : ''}
                />
                {errors.meetingTime && (
                  <p className="text-red-500 text-sm">{errors.meetingTime}</p>
                )}
              </div>
            </div>

            {/* Timezone and Duration */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Timezone</Label>
                <Select 
                  value={formData.timezone} 
                  onValueChange={(value) => handleInputChange('timezone', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {timezones.map((tz) => (
                      <SelectItem key={tz} value={tz}>
                        {tz}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Duration</Label>
                <Select 
                  value={formData.duration.toString()} 
                  onValueChange={(value) => handleInputChange('duration', parseInt(value))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {durations.map((duration) => (
                      <SelectItem key={duration.value} value={duration.value.toString()}>
                        {duration.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Meeting Type and Title */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Meeting Type</Label>
                <Select 
                  value={formData.meetingType} 
                  onValueChange={(value) => handleInputChange('meetingType', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {meetingTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="meetingTitle">
                  Meeting Title <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="meetingTitle"
                  value={formData.meetingTitle}
                  onChange={(e) => handleInputChange('meetingTitle', e.target.value)}
                  placeholder="Application Interview"
                  className={errors.meetingTitle ? 'border-red-500' : ''}
                />
                {errors.meetingTitle && (
                  <p className="text-red-500 text-sm">{errors.meetingTitle}</p>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="meetingDescription">Description</Label>
              <Textarea
                id="meetingDescription"
                value={formData.meetingDescription}
                onChange={(e) => handleInputChange('meetingDescription', e.target.value)}
                placeholder="Optional meeting description..."
                rows={3}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row justify-end gap-3 pt-6 border-t border-gray-200">
              <Button type="button" variant="outline" onClick={handleReset}>
                Reset Form
              </Button>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading} className="bg-blue-600 hover:bg-blue-700">
                {isLoading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                ) : (
                  <Send className="w-4 h-4 mr-2" />
                )}
                Schedule Interview
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ScheduleInterviewModal;