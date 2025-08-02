
"use client";

import { useEffect, useState, useMemo } from 'react';
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { useForm, type Path } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { PlusCircle, Edit3, Trash2, Save, Loader2, XCircle } from 'lucide-react';

import { PageHeader } from '@/components/shared/page-header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

import type { Certification } from '@/lib/types';
import { saveCertificationAction, deleteCertificationAction, type CertificationFormState } from '@/actions/admin/certificationsActions';
import { certificationAdminSchema, type CertificationAdminFormData } from '@/lib/adminSchemas';

const initialFormState: CertificationFormState = { message: '', status: 'idle' };

const defaultFormValues: CertificationAdminFormData = {
  id: undefined,
  name: '',
  issuingBody: '',
  date: '',
  imageUrl: '',
  credentialId: '',
  credentialUrl: '',
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? (
        <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Saving...</>
      ) : (
        <><Save className="mr-2 h-4 w-4" />Save Certification</>
      )}
    </Button>
  );
}

export default function CertificationsAdminClientPage({ initialCertifications }: { initialCertifications: Certification[] }) {
  const [certifications, setCertifications] = useState<Certification[]>(initialCertifications);
  const [currentCertification, setCurrentCertification] = useState<Certification | null>(null);
  const [showForm, setShowForm] = useState(false);
  const { toast } = useToast();

  const [formActionState, formAction] = useActionState(saveCertificationAction, initialFormState);

  const form = useForm<CertificationAdminFormData>({
    resolver: zodResolver(certificationAdminSchema),
    defaultValues: defaultFormValues,
  });

  const formCardKey = useMemo(() => {
    if (!showForm) return 'hidden-form';
    if (currentCertification?.id) return `edit-${currentCertification.id}-${new Date().getTime()}`;
    return `add-new-cert-form-${new Date().getTime()}`;
  }, [showForm, currentCertification]);
  
  useEffect(() => {
    if (formActionState.status === 'success' && formActionState.savedCertification) {
      const saved = formActionState.savedCertification;
      toast({ title: "Success!", description: formActionState.message });
      setCertifications(prev => {
        const existingIndex = prev.findIndex(c => c.id === saved.id);
        const newArray = existingIndex > -1 ? prev.map(c => c.id === saved.id ? saved : c) : [saved, ...prev];
        return newArray.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      });
      setShowForm(false);
      setCurrentCertification(null);
      form.reset(defaultFormValues);
    } else if (formActionState.status === 'error') {
      toast({ title: "Error Saving", description: formActionState.message || "An error occurred.", variant: "destructive" });
      const dataToResetWith = formActionState.formDataOnError ? formActionState.formDataOnError : form.getValues();
      form.reset(dataToResetWith);
      if (formActionState.errors) {
        Object.entries(formActionState.errors).forEach(([key, fieldErrorMessages]) => {
          if (Array.isArray(fieldErrorMessages) && fieldErrorMessages.length > 0) {
            form.setError(key as Path<CertificationAdminFormData>, { type: 'server', message: fieldErrorMessages.join(', ') });
          }
        });
      }
    }
  }, [formActionState, toast, form]);

  const handleAddNew = () => {
    setCurrentCertification(null);
    form.reset(defaultFormValues);
    setShowForm(true);
  };

  const handleEdit = (certification: Certification) => {
    setCurrentCertification(certification);
    form.reset({
        id: certification.id,
        name: certification.name,
        issuingBody: certification.issuingBody,
        date: certification.date,
        imageUrl: certification.imageUrl,
        credentialId: certification.credentialId,
        credentialUrl: certification.credentialUrl,
    });
    setShowForm(true);
  };

  const handleDelete = async (certificationId: string) => {
    const result = await deleteCertificationAction(certificationId);
    if (result.success) {
      toast({ title: "Success!", description: result.message });
      setCertifications(prev => prev.filter(c => c.id !== certificationId));
    } else {
      toast({ title: "Error Deleting", description: result.message, variant: "destructive" });
    }
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setCurrentCertification(null);
    form.reset(defaultFormValues);
  }

  return (
    <div className="py-6">
      <div className="flex items-center justify-between">
        <PageHeader title="Manage Certifications" subtitle="Add, edit, or delete your certifications." className="py-0 md:py-0 pb-8 text-left" />
        {!showForm && (
          <Button onClick={handleAddNew}>
            <PlusCircle className="mr-2 h-4 w-4" /> Add New Certification
          </Button>
        )}
      </div>

      {showForm && (
        <Card key={formCardKey}>
          <CardHeader>
            <CardTitle>{currentCertification ? 'Edit Certification' : 'Add New Certification'}</CardTitle>
            <CardDescription>Fill in the details for your certification.</CardDescription>
          </CardHeader>
          <Form {...form}>
            <form action={formAction}>
              {currentCertification?.id && <input type="hidden" {...form.register('id')} value={currentCertification.id} />}
              <CardContent className="space-y-6">
                <FormField control={form.control} name="name" render={({ field }) => (
                  <FormItem><FormLabel>Certification Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="issuingBody" render={({ field }) => (
                  <FormItem><FormLabel>Issuing Body</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="date" render={({ field }) => (
                  <FormItem><FormLabel>Date Issued (e.g., 2023 or Nov 2023)</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="imageUrl" render={({ field }) => (
                  <FormItem><FormLabel>Image URL (Optional)</FormLabel><FormControl><Input {...field} placeholder="https://example.com/cert-image.png" /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="credentialId" render={({ field }) => (
                  <FormItem><FormLabel>Credential ID (Optional)</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="credentialUrl" render={({ field }) => (
                  <FormItem><FormLabel>Credential URL (Optional)</FormLabel><FormControl><Input {...field} placeholder="https://example.com/verify/123" /></FormControl><FormMessage /></FormItem>
                )} />
              </CardContent>
              <CardFooter className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={handleCancelForm}><XCircle className="mr-2 h-4 w-4" /> Cancel</Button>
                <SubmitButton />
              </CardFooter>
            </form>
          </Form>
        </Card>
      )}
      {!showForm && (
        <div className="space-y-4">
          {certifications.length === 0 && <p className="text-muted-foreground text-center py-4">No certifications yet. Click "Add New Certification" to start.</p>}
          {certifications.map(cert => (
            <Card key={cert.id} className="flex items-center justify-between p-4">
              <div>
                <p className="font-medium">{cert.name}</p>
                <p className="text-sm text-muted-foreground">{cert.issuingBody} - {cert.date}</p>
              </div>
              <div className="space-x-2">
                <Button variant="outline" size="sm" onClick={() => handleEdit(cert)}><Edit3 className="mr-1 h-4 w-4" /> Edit</Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild><Button variant="destructive" size="sm"><Trash2 className="mr-1 h-4 w-4" /> Delete</Button></AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader><AlertDialogTitle>Are you sure?</AlertDialogTitle><AlertDialogDescription>This action cannot be undone. This will permanently delete the certification "{cert.name}".</AlertDialogDescription></AlertDialogHeader>
                    <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={() => handleDelete(cert.id)} className="bg-destructive hover:bg-destructive/80">Yes, delete</AlertDialogAction></AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
