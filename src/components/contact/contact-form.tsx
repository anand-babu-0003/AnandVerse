
"use client";

import * as React from 'react';
import { useTransition } from 'react';
import { useFormStatus } from 'react-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { submitContactForm, type ContactFormState } from '@/actions/contact';
import { Loader2 } from 'lucide-react';

const contactFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  message: z.string().min(10, { message: "Message must be at least 10 characters." }),
});

type ContactFormData = z.infer<typeof contactFormSchema>;

const initialState: ContactFormState = {
  message: '',
  status: 'idle',
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button 
      type="submit" 
      disabled={pending} 
      className="bg-[hsl(260,55%,78%)] text-[hsl(260,25%,30%)] hover:bg-[hsl(260,55%,72%)] dark:bg-[hsl(260,55%,78%)] dark:text-[hsl(260,25%,30%)] dark:hover:bg-[hsl(260,55%,72%)] font-semibold shadow-lg transition-all duration-300 rounded-md text-base leading-snug px-6 py-3 w-full sm:w-auto"
    >
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Sending...
        </>
      ) : (
        'Send Message'
      )}
    </Button>
  );
}

export function ContactForm() {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [formState, setFormState] = React.useState<ContactFormState>(initialState);

  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: '',
      email: '',
      message: '',
    },
  });

  const onSubmit = (formData: FormData) => {
    startTransition(async () => {
        const result = await submitContactForm(formState, formData);
        setFormState(result);
        if (result.status === 'success') {
            toast({
                title: "Message Sent!",
                description: result.message,
            });
            form.reset();
        } else if (result.status === 'error' && result.message) {
            toast({
                title: "Error",
                description: result.message,
                variant: "destructive",
            });
            if (result.errors) {
                if(result.errors.name) form.setError("name", { type: "server", message: result.errors.name.join(', ') });
                if(result.errors.email) form.setError("email", { type: "server", message: result.errors.email.join(', ') });
                if(result.errors.message) form.setError("message", { type: "server", message: result.errors.message.join(', ') });
            }
        }
    });
  }

  return (
    <Form {...form}>
      <form action={onSubmit} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input placeholder="John Doe" {...field} className="text-base" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email Address</FormLabel>
              <FormControl>
                <Input type="email" placeholder="you@example.com" {...field} className="text-base" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Message</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Tell me how I can help you..."
                  rows={6}
                  {...field}
                  className="text-base"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <SubmitButton />
      </form>
    </Form>
  );
}
