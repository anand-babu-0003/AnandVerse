
"use server";

import { z } from 'zod';
import { getAuth, signInWithEmailAndPassword, setPersistence, browserLocalPersistence } from 'firebase/auth';
import { firebaseApp } from '@/lib/firebaseConfig'; // Ensure firebaseApp is exported

const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }), // Firebase has a min password length
});

export type LoginFormState = {
  message: string;
  status: 'success' | 'error' | 'idle';
  errors?: z.inferFlattenedErrors<typeof loginSchema>['fieldErrors'];
};

// This function is no longer a server action called by a form's `action` prop.
// It will be called from a client-side function.
// However, keeping 'use server' is fine and doesn't hurt.
export async function loginWithFirebase(
  prevState: LoginFormState,
  formData: FormData
): Promise<LoginFormState> {

  const validatedFields = loginSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  });

  if (!validatedFields.success) {
    return {
      message: "Invalid form data.",
      status: 'error',
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }
  
  const { email, password } = validatedFields.data;
  const auth = getAuth(firebaseApp);

  try {
    // This function can only be used on the client, so this server action
    // is not a pattern we can use. We need to do this on the client.
    // The logic will be moved to the login page component.
    // This file is now effectively deprecated for the login flow but is kept
    // to avoid breaking imports until the refactor is complete.
    // We will return a success to not block anything, but the real logic is client-side.
     return {
      message: "This action is deprecated. Login logic moved to client.",
      status: 'error',
    };
    
  } catch (error: any) {
    let errorMessage = "An unknown error occurred during login.";
    switch (error.code) {
        case 'auth/invalid-credential':
        case 'auth/user-not-found':
        case 'auth/wrong-password':
            errorMessage = "Invalid email or password. Please try again.";
            break;
        case 'auth/invalid-email':
            errorMessage = "The email address is not valid.";
            break;
        case 'auth/user-disabled':
            errorMessage = "This user account has been disabled.";
            break;
        default:
            console.error("Firebase Auth Error:", error);
            break;
    }
    return {
      message: errorMessage,
      status: 'error',
    };
  }
}
