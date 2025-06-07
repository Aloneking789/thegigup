import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { freelancerService } from '../api/freelancer';
import { 
  FreelancerProfile,
  ProfileUpdateData,
  EducationFormData,
  ExperienceFormData,
  PortfolioFormData,
  Education,
  Experience,
  PortfolioItem
} from '../api/types';
import { toast } from 'sonner';

// Query keys for freelancer
export const freelancerKeys = {
  all: ['freelancer'] as const,
  profile: () => [...freelancerKeys.all, 'profile'] as const,
  education: () => [...freelancerKeys.all, 'education'] as const,
  experience: () => [...freelancerKeys.all, 'experience'] as const,
  portfolio: () => [...freelancerKeys.all, 'portfolio'] as const,
  completion: () => [...freelancerKeys.all, 'completion'] as const,
};

// Freelancer profile hooks
export const useFreelancerProfile = () => {
  const queryClient = useQueryClient();

  // Get profile query
  const {
    data: profile,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: freelancerKeys.profile(),
    queryFn: () => freelancerService.getProfile(),
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });
  // Create profile mutation (for new users)
  const createProfileMutation = useMutation({
    mutationFn: (profileData: any) => freelancerService.createProfile(profileData),
    onSuccess: (data: FreelancerProfile) => {
      queryClient.setQueryData(freelancerKeys.profile(), data);
      queryClient.invalidateQueries({ queryKey: freelancerKeys.completion() });
      toast.success('Profile created successfully!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create profile');
    },
  });
  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: (profileData: any) => freelancerService.updateProfile(profileData),
    onSuccess: (data: FreelancerProfile) => {
      queryClient.setQueryData(freelancerKeys.profile(), data);
      queryClient.invalidateQueries({ queryKey: freelancerKeys.completion() });
      toast.success('Profile updated successfully!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update profile');
    },
  });

  // Upload profile picture mutation
  const uploadProfilePictureMutation = useMutation({
    mutationFn: (file: File) => freelancerService.uploadProfilePicture(file),
    onSuccess: (data) => {
      // Update the cached profile with new picture URL
      queryClient.setQueryData(freelancerKeys.profile(), (old: FreelancerProfile | undefined) => {
        if (old) {
          return { ...old, profilePicture: data.profilePicture };
        }
        return old;
      });
      toast.success('Profile picture updated!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to upload profile picture');
    },
  });

  // Upload resume mutation
  const uploadResumeMutation = useMutation({
    mutationFn: (file: File) => freelancerService.uploadResume(file),
    onSuccess: (data) => {
      // Update the cached profile with new resume URL
      queryClient.setQueryData(freelancerKeys.profile(), (old: FreelancerProfile | undefined) => {
        if (old) {
          return { ...old, resume: data.resume };
        }
        return old;
      });
      toast.success('Resume uploaded successfully!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to upload resume');
    },
  });
  return {
    // Data
    profile,
    isLoading,
    error,

    // Mutations
    createProfile: createProfileMutation.mutate,
    updateProfile: updateProfileMutation.mutate,
    uploadProfilePicture: uploadProfilePictureMutation.mutate,
    uploadResume: uploadResumeMutation.mutate,

    // Async mutations for awaitable operations
    createProfileAsync: createProfileMutation.mutateAsync,
    updateProfileAsync: updateProfileMutation.mutateAsync,
    uploadProfilePictureAsync: uploadProfilePictureMutation.mutateAsync,
    uploadResumeAsync: uploadResumeMutation.mutateAsync,

    // Loading states
    isCreating: createProfileMutation.isPending,
    isUpdating: updateProfileMutation.isPending,
    isUploadingPicture: uploadProfilePictureMutation.isPending,
    isUploadingResume: uploadResumeMutation.isPending,

    // Error states
    createError: createProfileMutation.error,
    updateError: updateProfileMutation.error,
    uploadPictureError: uploadProfilePictureMutation.error,
    uploadResumeError: uploadResumeMutation.error,

    // Utilities
    refetch,
  };
};

// Education management hooks
export const useEducation = () => {
  const queryClient = useQueryClient();

  // Add education mutation
  const addEducationMutation = useMutation({
    mutationFn: (educationData: EducationFormData) => freelancerService.addEducation(educationData),
    onSuccess: (newEducation: Education) => {
      // Optimistically update the profile cache
      queryClient.setQueryData(freelancerKeys.profile(), (old: FreelancerProfile | undefined) => {
        if (old) {
          return {
            ...old,
            education: [...old.education, newEducation],
            completionStatus: { ...old.completionStatus, education: true }
          };
        }
        return old;
      });
      toast.success('Education added successfully!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to add education');
    },
  });

  // Update education mutation
  const updateEducationMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: EducationFormData }) =>
      freelancerService.updateEducation(id, data),
    onSuccess: (updatedEducation: Education) => {
      queryClient.setQueryData(freelancerKeys.profile(), (old: FreelancerProfile | undefined) => {
        if (old) {
          return {
            ...old,
            education: old.education.map(edu => 
              edu.id === updatedEducation.id ? updatedEducation : edu
            ),
          };
        }
        return old;
      });
      toast.success('Education updated successfully!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update education');
    },
  });

  // Delete education mutation
  const deleteEducationMutation = useMutation({
    mutationFn: (id: string) => freelancerService.deleteEducation(id),
    onSuccess: (_, deletedId: string) => {
      queryClient.setQueryData(freelancerKeys.profile(), (old: FreelancerProfile | undefined) => {
        if (old) {
          const updatedEducation = old.education.filter(edu => edu.id !== deletedId);
          return {
            ...old,
            education: updatedEducation,
            completionStatus: { 
              ...old.completionStatus, 
              education: updatedEducation.length > 0 
            }
          };
        }
        return old;
      });
      toast.success('Education deleted successfully!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete education');
    },
  });
  return {
    addEducation: addEducationMutation.mutate,
    updateEducation: updateEducationMutation.mutate,
    deleteEducation: deleteEducationMutation.mutate,

    // Async versions
    addEducationAsync: addEducationMutation.mutateAsync,
    updateEducationAsync: updateEducationMutation.mutateAsync,
    deleteEducationAsync: deleteEducationMutation.mutateAsync,

    isAdding: addEducationMutation.isPending,
    isUpdating: updateEducationMutation.isPending,
    isDeleting: deleteEducationMutation.isPending,

    addError: addEducationMutation.error,
    updateError: updateEducationMutation.error,
    deleteError: deleteEducationMutation.error,
  };
};

// Experience management hooks
export const useExperience = () => {
  const queryClient = useQueryClient();

  // Add experience mutation
  const addExperienceMutation = useMutation({
    mutationFn: (experienceData: ExperienceFormData) => freelancerService.addExperience(experienceData),
    onSuccess: (newExperience: Experience) => {
      queryClient.setQueryData(freelancerKeys.profile(), (old: FreelancerProfile | undefined) => {
        if (old) {
          return {
            ...old,
            experience: [...old.experience, newExperience],
            completionStatus: { ...old.completionStatus, experience: true }
          };
        }
        return old;
      });
      toast.success('Experience added successfully!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to add experience');
    },
  });

  // Update experience mutation
  const updateExperienceMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: ExperienceFormData }) =>
      freelancerService.updateExperience(id, data),
    onSuccess: (updatedExperience: Experience) => {
      queryClient.setQueryData(freelancerKeys.profile(), (old: FreelancerProfile | undefined) => {
        if (old) {
          return {
            ...old,
            experience: old.experience.map(exp => 
              exp.id === updatedExperience.id ? updatedExperience : exp
            ),
          };
        }
        return old;
      });
      toast.success('Experience updated successfully!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update experience');
    },
  });

  // Delete experience mutation
  const deleteExperienceMutation = useMutation({
    mutationFn: (id: string) => freelancerService.deleteExperience(id),
    onSuccess: (_, deletedId: string) => {
      queryClient.setQueryData(freelancerKeys.profile(), (old: FreelancerProfile | undefined) => {
        if (old) {
          const updatedExperience = old.experience.filter(exp => exp.id !== deletedId);
          return {
            ...old,
            experience: updatedExperience,
            completionStatus: { 
              ...old.completionStatus, 
              experience: updatedExperience.length > 0 
            }
          };
        }
        return old;
      });
      toast.success('Experience deleted successfully!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete experience');
    },
  });
  return {
    addExperience: addExperienceMutation.mutate,
    updateExperience: updateExperienceMutation.mutate,
    deleteExperience: deleteExperienceMutation.mutate,

    // Async versions
    addExperienceAsync: addExperienceMutation.mutateAsync,
    updateExperienceAsync: updateExperienceMutation.mutateAsync,
    deleteExperienceAsync: deleteExperienceMutation.mutateAsync,

    isAdding: addExperienceMutation.isPending,
    isUpdating: updateExperienceMutation.isPending,
    isDeleting: deleteExperienceMutation.isPending,

    addError: addExperienceMutation.error,
    updateError: updateExperienceMutation.error,
    deleteError: deleteExperienceMutation.error,
  };
};

// Portfolio management hooks
export const usePortfolio = () => {
  const queryClient = useQueryClient();

  // Add portfolio item mutation
  const addPortfolioMutation = useMutation({
    mutationFn: ({ data, image }: { data: PortfolioFormData; image?: File }) =>
      freelancerService.addPortfolioItem(data, image),
    onSuccess: (newPortfolioItem: PortfolioItem) => {
      queryClient.setQueryData(freelancerKeys.profile(), (old: FreelancerProfile | undefined) => {
        if (old) {
          return {
            ...old,
            portfolio: [...old.portfolio, newPortfolioItem],
            completionStatus: { ...old.completionStatus, portfolio: true }
          };
        }
        return old;
      });
      toast.success('Portfolio item added successfully!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to add portfolio item');
    },
  });

  // Update portfolio item mutation
  const updatePortfolioMutation = useMutation({
    mutationFn: ({ id, data, image }: { id: string; data: PortfolioFormData; image?: File }) =>
      freelancerService.updatePortfolioItem(id, data, image),
    onSuccess: (updatedPortfolioItem: PortfolioItem) => {
      queryClient.setQueryData(freelancerKeys.profile(), (old: FreelancerProfile | undefined) => {
        if (old) {
          return {
            ...old,
            portfolio: old.portfolio.map(item => 
              item.id === updatedPortfolioItem.id ? updatedPortfolioItem : item
            ),
          };
        }
        return old;
      });
      toast.success('Portfolio item updated successfully!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update portfolio item');
    },
  });

  // Delete portfolio item mutation
  const deletePortfolioMutation = useMutation({
    mutationFn: (id: string) => freelancerService.deletePortfolioItem(id),
    onSuccess: (_, deletedId: string) => {
      queryClient.setQueryData(freelancerKeys.profile(), (old: FreelancerProfile | undefined) => {
        if (old) {
          const updatedPortfolio = old.portfolio.filter(item => item.id !== deletedId);
          return {
            ...old,
            portfolio: updatedPortfolio,
            completionStatus: { 
              ...old.completionStatus, 
              portfolio: updatedPortfolio.length > 0 
            }
          };
        }
        return old;
      });
      toast.success('Portfolio item deleted successfully!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete portfolio item');
    },
  });
  return {
    addPortfolioItem: addPortfolioMutation.mutate,
    updatePortfolioItem: updatePortfolioMutation.mutate,
    deletePortfolioItem: deletePortfolioMutation.mutate,

    // Async versions
    addPortfolioItemAsync: addPortfolioMutation.mutateAsync,
    updatePortfolioItemAsync: updatePortfolioMutation.mutateAsync,
    deletePortfolioItemAsync: deletePortfolioMutation.mutateAsync,

    isAdding: addPortfolioMutation.isPending,
    isUpdating: updatePortfolioMutation.isPending,
    isDeleting: deletePortfolioMutation.isPending,

    addError: addPortfolioMutation.error,
    updateError: updatePortfolioMutation.error,
    deleteError: deletePortfolioMutation.error,
  };
};

// Profile completion status hook
export const useProfileCompletion = () => {
  const {
    data: completionData,
    isLoading,
    error,
  } = useQuery({
    queryKey: freelancerKeys.completion(),
    queryFn: () => freelancerService.getProfileCompletion(),
    staleTime: 30 * 1000, // 30 seconds
    gcTime: 2 * 60 * 1000, // 2 minutes
  });

  return {
    completionStatus: completionData?.completionStatus,
    isLoading,
    error,
  };
};
