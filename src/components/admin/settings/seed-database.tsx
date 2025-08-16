
"use client";

import * as React from 'react';
import { useTransition } from 'react';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { seedFirestoreWithMockDataAction } from '@/actions/admin/seedActions';
import { Loader2, DatabaseZap } from 'lucide-react';

export default function AdminSeedDatabase() {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleSeed = () => {
    startTransition(async () => {
      const result = await seedFirestoreWithMockDataAction();
      if (result.success) {
        toast({
          title: "Database Seeded!",
          description: result.message,
          duration: 5000,
        });
        // Optionally, force a page reload to see changes if they don't auto-update
        window.location.reload();
      } else {
        toast({
          title: "Seeding Failed",
          description: result.message,
          variant: "destructive",
          duration: 8000,
        });
      }
    });
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive">
          {isPending ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <DatabaseZap className="mr-2 h-4 w-4" />
          )}
          {isPending ? 'Seeding...' : 'Seed Database with Default Data'}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete all existing content
            (Portfolio Items, Skills, Messages) and replace it with the default mock data.
            Your site settings and about page will also be reset.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            disabled={isPending}
            onClick={handleSeed}
            className="bg-destructive hover:bg-destructive/90"
          >
            {isPending ? 'Processing...' : 'Yes, I understand, seed the database'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
