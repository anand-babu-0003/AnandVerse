
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trash2, Inbox, Eye, Mail, User, Calendar, MessageSquare } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { deleteContactMessageAction } from '@/actions/admin/messagesActions';

interface MessagesTableProps {
  messages: ContactMessage[];
}

export function MessagesTable({ messages: initialMessages }: MessagesTableProps) {
  const [messages, setMessages] = useState(initialMessages);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
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

  const handleViewMessage = (message: ContactMessage) => {
    setSelectedMessage(message);
    setIsViewerOpen(true);
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
    <>
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
              <TableRow key={message.id} className="hover:bg-muted/50">
                <TableCell className="font-medium">{message.name}</TableCell>
                <TableCell className="hidden md:table-cell text-muted-foreground">{message.email}</TableCell>
                <TableCell 
                  className="max-w-[250px] truncate text-muted-foreground cursor-pointer hover:text-foreground transition-colors"
                  onClick={() => handleViewMessage(message)}
                >
                  {message.message}
                </TableCell>
                <TableCell className="hidden sm:table-cell text-muted-foreground">
                  {format(parseISO(message.submittedAt), "MMM d, yyyy 'at' h:mm a")}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleViewMessage(message)}
                      className="text-primary hover:text-primary"
                    >
                      <Eye className="h-4 w-4" />
                      <span className="sr-only">View message</span>
                    </Button>
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
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Message Viewer Dialog */}
      <Dialog open={isViewerOpen} onOpenChange={setIsViewerOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Message Details
            </DialogTitle>
            <DialogDescription>
              Complete message information and details
            </DialogDescription>
          </DialogHeader>
          
          {selectedMessage && (
            <div className="space-y-6">
              {/* Sender Information */}
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
                  <div className="p-2 bg-primary/10 rounded-full">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{selectedMessage.name}</h3>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Mail className="h-4 w-4" />
                      <span>{selectedMessage.email}</span>
                    </div>
                  </div>
                </div>

                {/* Timestamp */}
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>
                    Received on {format(parseISO(selectedMessage.submittedAt), "EEEE, MMMM d, yyyy 'at' h:mm a")}
                  </span>
                </div>
              </div>

              {/* Message Content */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-primary" />
                  <h4 className="font-medium">Message</h4>
                </div>
                <div className="p-4 bg-muted/30 rounded-lg border">
                  <p className="text-foreground whitespace-pre-wrap leading-relaxed">
                    {selectedMessage.message}
                  </p>
                </div>
              </div>

              {/* Message ID */}
              <div className="pt-4 border-t">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>Message ID:</span>
                  <Badge variant="outline" className="font-mono">
                    {selectedMessage.id}
                  </Badge>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

