
"use client";

import * as React from 'react';
import type { AboutMeData } from '@/lib/types';

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProfileBioForm } from './profile-bio-form';
import { ExperienceForm } from './experience-form';
import { EducationForm } from './education-form';
import { ContactSocialsForm } from './contact-socials-form';
import { UserCircle, Briefcase, GraduationCap, Link2 } from 'lucide-react';


interface AdminAboutMeFormProps {
  aboutMeData: AboutMeData;
}

export default function AdminAboutMeForm({ aboutMeData }: AdminAboutMeFormProps) {
  return (
    <Tabs defaultValue="profile" className="w-full">
      <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 h-auto">
        <TabsTrigger value="profile" className="flex-col sm:flex-row gap-2 h-auto py-2">
            <UserCircle className="h-5 w-5" />
            <span>Profile & Bio</span>
        </TabsTrigger>
        <TabsTrigger value="experience" className="flex-col sm:flex-row gap-2 h-auto py-2">
            <Briefcase className="h-5 w-5" />
            <span>Experience</span>
        </TabsTrigger>
        <TabsTrigger value="education" className="flex-col sm:flex-row gap-2 h-auto py-2">
            <GraduationCap className="h-5 w-5" />
            <span>Education</span>
        </TabsTrigger>
        <TabsTrigger value="contact" className="flex-col sm:flex-row gap-2 h-auto py-2">
            <Link2 className="h-5 w-5" />
            <span>Contact & Socials</span>
        </TabsTrigger>
      </TabsList>
      <TabsContent value="profile" className="mt-6">
        <ProfileBioForm aboutMeData={aboutMeData} />
      </TabsContent>
      <TabsContent value="experience" className="mt-6">
        <ExperienceForm experience={aboutMeData.experience} />
      </TabsContent>
      <TabsContent value="education" className="mt-6">
        <EducationForm education={aboutMeData.education} />
      </TabsContent>
      <TabsContent value="contact" className="mt-6">
        <ContactSocialsForm aboutMeData={aboutMeData} />
      </TabsContent>
    </Tabs>
  );
}
