
"use client";

import { useEffect, useTransition } from 'react';
import { useFormStatus } from 'react-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { submitAnnouncementAction, type AnnouncementFormState } from '@/actions/admin/announcementActions';
import { Loader2, Send } from 'lucide-react';

const announcementSchema = z.object({
  message: z.string().min(5, { message: "Announcement message must be at least 5 characters." }).max(500, { message: "Announcement cannot exceed 500 characters." }),
});
type AnnouncementFormData = z.infer<typeof announcementSchema>;

const initialFormState: AnnouncementFormState = { message: '', status: 'idle' };

function SubmitButton({ isPending }: { isPending: boolean }) {
  return (
    <Button type="submit" disabled={isPending}>
      {isPending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Publishing...
        </>
      ) : (
        <>
          <Send className="mr-2 h-4 w-4" /> Publish Announcement
        </>
      )}
    </Button>
  );
}

export default function AdminAnnouncementPanel() {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  const form = useForm<AnnouncementFormData>({
    resolver: zodResolver(announcementSchema),
    defaultValues: { message: '' },
  });

  const onSubmit = (values: AnnouncementFormData) => {
    startTransition(async () => {
      const formData = new FormData();
      formData.append('message', values.message);

      const result = await submitAnnouncementAction(initialFormState, formData);

      if (result.status === 'success') {
        toast({ title: "Success!", description: result.message });
        form.reset(); // Reset form on successful submission
      } else if (result.status === 'error' && result.message) {
        toast({ title: "Error", description: result.message, variant: "destructive" });
        if (result.errors?.message) {
          form.setError("message", { type: "server", message: result.errors.message.join(', ') });
        }
      }
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Publish New Announcement</CardTitle>
        <CardDescription>
          Type your announcement below. It will appear live to users.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent>
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="announcement-message">Message</FormLabel>
                  <FormControl>
                    <Textarea
                      id="announcement-message"
                      placeholder="Enter your announcement here..."
                      rows={5}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="flex justify-end">
            <SubmitButton isPending={isPending} />
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
