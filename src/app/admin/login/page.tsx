
"use client";

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { AlertCircle, LogIn, Home, Loader2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { loginAction, type LoginFormState } from '@/actions/admin/authActions';

const initialFormState: LoginFormState = { message: '', status: 'idle' };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Signing In...
        </>
      ) : (
        <>
          <LogIn className="mr-2 h-4 w-4" /> Sign In
        </>
      )}
    </Button>
  );
}

export default function AdminLoginPage() {
  const [state, formAction] = useActionState(loginAction, initialFormState);

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
          <form action={formAction} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" placeholder="admin@example.com" required />
              {state?.errors?.email && <p className="text-sm text-destructive">{state.errors.email}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" type="password" placeholder="••••••••" required />
              {state?.errors?.password && <p className="text-sm text-destructive">{state.errors.password}</p>}
            </div>
            
            {state.status === 'error' && state.message && !state.errors && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Login Failed</AlertTitle>
                <AlertDescription>{state.message}</AlertDescription>
              </Alert>
            )}
            <SubmitButton />
          </form>
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
