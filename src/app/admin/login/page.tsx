
"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { AlertCircle, LogIn, Home, Loader2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { getAuth, signInWithEmailAndPassword, setPersistence, browserLocalPersistence } from 'firebase/auth';
import { firebaseApp } from '@/lib/firebaseConfig';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';

const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function AdminLoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const handleLogin = async (data: LoginFormData) => {
    setIsLoading(true);
    setError(null);
    try {
      const auth = getAuth(firebaseApp);
      await setPersistence(auth, browserLocalPersistence); // Persist auth state
      await signInWithEmailAndPassword(auth, data.email, data.password);
      
      // Although onAuthStateChanged in layout is the preferred way,
      // we can set a simple flag for faster initial redirect.
      localStorage.setItem('isAdminLoggedIn', 'true');
      router.replace('/admin/dashboard');

    } catch (authError: any) {
      let errorMessage = "An unknown error occurred.";
      switch (authError.code) {
        case 'auth/invalid-credential':
        case 'auth/user-not-found':
        case 'auth/wrong-password':
          errorMessage = "Invalid email or password. Please check your credentials and try again.";
          break;
        case 'auth/invalid-email':
          errorMessage = "The email address is not valid.";
          break;
        case 'auth/user-disabled':
          errorMessage = "This user account has been disabled.";
          break;
        default:
          console.error("Firebase Auth Error:", authError);
          errorMessage = "An unexpected error occurred during login. Please try again later.";
          break;
      }
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <div className="mb-4 inline-flex items-center justify-center rounded-lg bg-primary p-3">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className="text-primary-foreground">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <CardTitle className="font-headline text-3xl text-primary">Admin Panel</CardTitle>
          <CardDescription>Please log in to continue.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
           <Alert variant="default" className="border-green-500/50 bg-green-500/10 text-green-700 dark:text-green-300">
            <AlertCircle className="h-4 w-4 !text-green-500" />
            <AlertTitle>Authentication Upgraded</AlertTitle>
            <AlertDescription>
              Login now uses Firebase Authentication. Please use the credentials you set up in the Firebase Console.
            </AlertDescription>
          </Alert>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleLogin)} className="space-y-4">
              <FormField control={form.control} name="email" render={({ field }) => (
                <FormItem>
                  <Label htmlFor="email">Email</Label>
                  <FormControl>
                    <Input id="email" type="email" placeholder="admin@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="password" render={({ field }) => (
                <FormItem>
                  <Label htmlFor="password">Password</Label>
                  <FormControl>
                    <Input id="password" type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Login Failed</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Signing In...
                  </>
                ) : (
                  <>
                    <LogIn className="mr-2 h-4 w-4" /> Sign In
                  </>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
         <CardFooter className="flex flex-col items-center text-center text-xs text-muted-foreground pt-6 gap-4">
           <Button variant="outline" size="sm" asChild className="w-full">
              <Link href="/">
                <Home className="mr-2 h-4 w-4" /> View Live Site
              </Link>
            </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
