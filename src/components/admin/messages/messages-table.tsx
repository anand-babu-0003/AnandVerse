
"use client";

import * as React from 'react';
import { useState } from 'react';
import type { ContactMessage } from '@/lib/types';
import { format, parseISO } from 'date-fns';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
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
import { Button } from '@/components/ui/button';
import { Trash2, Inbox } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { deleteContactMessageAction } from '@/actions/admin/messagesActions';

interface MessagesTableProps {
  messages: ContactMessage[];
}

export function MessagesTable({ messages: initialMessages }: MessagesTableProps) {
  const [messages, setMessages] = useState(initialMessages);
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();

  const handleDelete = async (messageId: string) => {
    setIsDeleting(true);
    const result = await deleteContactMessageAction(messageId);
    if (result.success) {
      setMessages((prevMessages) => prevMessages.filter((msg) => msg.id !== messageId));
      toast({
        title: 'Success',
        description: result.message,
      });
    } else {
      toast({
        title: 'Error',
        description: result.message,
        variant: 'destructive',
      });
    }
    setIsDeleting(false);
  };
  
  if (messages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-16 px-4">
        <Inbox className="h-16 w-16 text-muted-foreground mb-4" />
        <h3 className="text-xl font-semibold text-foreground">Inbox Zero</h3>
        <p className="text-muted-foreground mt-2">You have no new messages.</p>
      </div>
    );
  }

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>From</TableHead>
            <TableHead className="hidden md:table-cell">Email</TableHead>
            <TableHead>Message</TableHead>
            <TableHead className="hidden sm:table-cell">Received</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {messages.map((message) => (
            <TableRow key={message.id}>
              <TableCell className="font-medium">{message.name}</TableCell>
              <TableCell className="hidden md:table-cell text-muted-foreground">{message.email}</TableCell>
              <TableCell className="max-w-[250px] truncate text-muted-foreground">{message.message}</TableCell>
              <TableCell className="hidden sm:table-cell text-muted-foreground">
                {format(parseISO(message.submittedAt), "MMM d, yyyy 'at' h:mm a")}
              </TableCell>
              <TableCell className="text-right">
                 <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                           <Trash2 className="h-4 w-4" />
                           <span className="sr-only">Delete message</span>
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the message
                            from {message.name}.
                        </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => handleDelete(message.id)}
                            disabled={isDeleting}
                            className="bg-destructive hover:bg-destructive/90"
                        >
                            {isDeleting ? 'Deleting...' : 'Yes, delete it'}
                        </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

