
"use client";

import * as React from 'react';
import { useTransition } from 'react';
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
  name: z.string()
    .min(2, { message: "Name must be at least 2 characters." })
    .max(100, { message: "Name must be less than 100 characters." })
    .regex(/^[a-zA-Z\s\-'\.]+$/, { message: "Name contains invalid characters." }),
  email: z.string()
    .email({ message: "Please enter a valid email address." })
    .max(254, { message: "Email must be less than 254 characters." }),
  message: z.string()
    .min(10, { message: "Message must be at least 10 characters." })
    .max(5000, { message: "Message must be less than 5000 characters." })
    .regex(/^[^<>]*$/, { message: "Message contains invalid characters." }),
  phone: z.string()
    .optional()
    .refine((val) => !val || /^[\+]?[1-9][\d]{0,15}$/.test(val), {
      message: "Please enter a valid phone number."
    }),
});

type ContactFormData = z.infer<typeof contactFormSchema>;

const initialState: ContactFormState = {
  message: '',
  status: 'idle',
};

function SubmitButton({ isPending }: { isPending: boolean }) {
  return (
    <Button 
      type="submit" 
      disabled={isPending} 
      className="w-full sm:w-auto"
    >
      {isPending ? (
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
      phone: '',
    },
  });

  const onSubmit = (values: ContactFormData) => {
    startTransition(async () => {
        const formData = new FormData();
        formData.append('name', values.name);
        formData.append('email', values.email);
        formData.append('message', values.message);
        if (values.phone) {
          formData.append('phone', values.phone);
        }
        // Honeypot field for bot detection (hidden from users)
        formData.append('honeypot', '');

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
                if(result.errors.phone) form.setError("phone", { type: "server", message: result.errors.phone.join(', ') });
            }
        }
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Number (Optional)</FormLabel>
              <FormControl>
                <Input 
                  type="tel" 
                  placeholder="+1 (555) 123-4567" 
                  {...field} 
                  className="text-base" 
                />
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
        <SubmitButton isPending={isPending} />
      </form>
    </Form>
  );
}
