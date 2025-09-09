
"use server";

import { z } from 'zod';
import { firestore } from '@/lib/firebaseConfig';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { sanitizeInput, validateEmail, logSecurityEvent } from '@/lib/security';

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
  honeypot: z.string().optional(), // Honeypot field for bot detection
});

export type ContactFormState = {
  message: string;
  status: 'success' | 'error' | 'idle';
  errors?: {
    name?: string[];
    email?: string[];
    message?: string[];
    phone?: string[];
    honeypot?: string[];
  };
};

export async function submitContactForm(
  prevState: ContactFormState,
  formData: FormData
): Promise<ContactFormState> {
  if (!firestore) {
    return {
      message: "System error: Database not configured. Please try again later.",
      status: 'error',
    };
  }

  // Extract and sanitize form data
  const rawData = {
    name: formData.get('name') as string,
    email: formData.get('email') as string,
    message: formData.get('message') as string,
    phone: formData.get('phone') as string,
    honeypot: formData.get('honeypot') as string, // Hidden field for bot detection
  };

  // Bot detection: if honeypot field is filled, it's likely a bot
  if (rawData.honeypot && rawData.honeypot.trim() !== '') {
    logSecurityEvent('BOT_DETECTED_HONEYPOT', {
      honeypotValue: rawData.honeypot,
      userAgent: 'server-side',
    });
    return {
      message: "Invalid submission detected.",
      status: 'error',
    };
  }

  // Sanitize inputs
  const sanitizedData = {
    name: sanitizeInput(rawData.name || ''),
    email: sanitizeInput(rawData.email || ''),
    message: sanitizeInput(rawData.message || ''),
    phone: rawData.phone ? sanitizeInput(rawData.phone) : undefined,
  };

  // Additional email validation
  if (!validateEmail(sanitizedData.email)) {
    return {
      message: "Invalid email address provided.",
      status: 'error',
      errors: { email: ['Invalid email address.'] },
    };
  }

  const validatedFields = contactFormSchema.safeParse(sanitizedData);

  if (!validatedFields.success) {
    return {
      message: "Failed to send message. Please check the errors.",
      status: 'error',
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { name, email, message, phone } = validatedFields.data;

  try {
    const messagesCollection = collection(firestore, 'contactMessages');
    const newMessageData = {
      name,
      email,
      message,
      phone: phone || null,
      submittedAt: serverTimestamp(), // Use Firestore server timestamp
      isRead: false,
      isReplied: false,
      readAt: null,
      repliedAt: null,
    };

    await addDoc(messagesCollection, newMessageData);

    // Log successful submission
    logSecurityEvent('CONTACT_FORM_SUBMITTED', {
      email: email,
      hasPhone: !!phone,
      messageLength: message.length,
    });

    return {
      message: "Your message has been sent successfully! I'll get back to you soon.",
      status: 'success',
    };

  } catch (error) {
    console.error("Error submitting contact form or saving message to Firestore:", error);
    
    // Log error for monitoring
    logSecurityEvent('CONTACT_FORM_ERROR', {
      error: error instanceof Error ? error.message : 'Unknown error',
      email: email,
    });
    
    return {
      message: "An unexpected error occurred while sending your message. Please try again later.",
      status: 'error',
    };
  }
}
