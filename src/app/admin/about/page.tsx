
"use client";

import { useEffect, useState } from 'react';
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { useForm, useFieldArray, type Path } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { z } from 'zod';

import { PageHeader } from '@/components/shared/page-header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from '@/hooks/use-toast';
import { Save, Loader2, PlusCircle, Trash2 } from 'lucide-react';

import type { AboutMeData, Experience as LibExperienceType, Education as LibEducationType } from '@/lib/types';
import { 
  updateAboutDataAction, type UpdateAboutDataFormState,
  updateProfileBioDataAction, type UpdateProfileBioDataFormState,
  updateExperienceDataAction, type UpdateExperienceDataFormState,
  updateEducationDataAction, type UpdateEducationDataFormState
} from '@/actions/admin/aboutActions';
import { 
  aboutMeSchema, 
  profileBioSchema, type ProfileBioData,
  experienceSectionSchema, type ExperienceSectionData,
  educationSectionSchema, type EducationSectionData,
  type Experience as ZodExperienceType, 
  type Education as ZodEducationType
} from '@/lib/adminSchemas';
import AboutAdminClientPage from '@/components/admin/AboutAdminClientPage';
import { getAboutMeDataAction } from '@/actions/getAboutMeDataAction';
import FullScreenLoader from '@/components/shared/FullScreenLoader';


// This is the main client component that holds all the logic and state for the forms.
export default function AdminAboutPage() {
  const [initialData, setInitialData] = useState<AboutMeData | null>(null);

  useEffect(() => {
    getAboutMeDataAction().then(data => setInitialData(data));
  }, []);

  if (!initialData) {
    return <FullScreenLoader />; 
  }

  return (
    <div className="space-y-6">
        <PageHeader 
          title="Manage About Page"
          subtitle="Edit your profile, bio, experience, education, and contact information."
          className="py-0 text-left" 
        />
        <AboutAdminClientPage initialData={initialData} />
    </div>
  );
}
