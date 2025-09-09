"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  MessageSquare, 
  Mail, 
  Phone, 
  Calendar, 
  User, 
  Search,
  Filter,
  Eye,
  Reply,
  Trash2,
  Archive,
  Star,
  Clock,
  CheckCircle,
  AlertCircle,
  RefreshCw
} from 'lucide-react';
import { fetchAllContactMessages } from '@/actions/fetchAllDataAction';
import { deleteContactMessageAction, markMessageAsReadAction } from '@/actions/admin/messagesActions';
import type { ContactMessage } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { useTransition } from 'react';

interface MessagesManagementProps {}

export default function ComprehensiveMessagesManagement({}: MessagesManagementProps) {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'unread' | 'read' | 'replied'>('all');
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  useEffect(() => {
    loadMessages();
    // Set up auto-refresh every 30 seconds
    const interval = setInterval(loadMessages, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadMessages = async () => {
    try {
      setLoading(true);
      const data = await fetchAllContactMessages();
      setMessages(data);
    } catch (error) {
      console.error('Error loading messages:', error);
      toast({
        title: "Error",
        description: "Failed to load messages",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (messageId: string) => {
    try {
      const result = await markMessageAsReadAction(messageId);
      if (result.success) {
        toast({
          title: "Success",
          description: "Message marked as read"
        });
        loadMessages();
      } else {
        toast({
          title: "Error",
          description: result.message,
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to mark message as read",
        variant: "destructive"
      });
    }
  };

  const handleDeleteMessage = async (messageId: string) => {
    if (!confirm('Are you sure you want to delete this message?')) return;

    try {
      const result = await deleteContactMessageAction(messageId);
      if (result.success) {
        toast({
          title: "Success",
          description: result.message
        });
        loadMessages();
      } else {
        toast({
          title: "Error",
          description: result.message,
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete message",
        variant: "destructive"
      });
    }
  };

  const openViewDialog = (message: ContactMessage) => {
    setSelectedMessage(message);
    setIsViewDialogOpen(true);
    
    // Mark as read when viewing
    if (!message.isRead) {
      handleMarkAsRead(message.id);
    }
  };

  const filteredMessages = messages.filter(message => {
    const matchesSearch = message.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         message.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         message.message.toLowerCase().includes(searchTerm.toLowerCase());
    
    let matchesStatus = true;
    if (statusFilter === 'unread') matchesStatus = !message.isRead;
    else if (statusFilter === 'read') matchesStatus = message.isRead;
    else if (statusFilter === 'replied') matchesStatus = message.isReplied;
    
    return matchesSearch && matchesStatus;
  });

  const unreadCount = messages.filter(m => !m.isRead).length;
  const repliedCount = messages.filter(m => m.isReplied).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading messages...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Messages Management</h1>
          <p className="text-muted-foreground">Manage contact form submissions and inquiries</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={loadMessages}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Messages</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{messages.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unread</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{unreadCount}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Replied</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{repliedCount}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Read</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{messages.filter(m => m.isRead).length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search messages..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={(value: any) => setStatusFilter(value)}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Messages</SelectItem>
                <SelectItem value="unread">Unread</SelectItem>
                <SelectItem value="read">Read</SelectItem>
                <SelectItem value="replied">Replied</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Messages List */}
      <div className="space-y-4">
        {filteredMessages.length > 0 ? (
          filteredMessages.map((message) => (
            <Card key={message.id} className={`${!message.isRead ? 'border-l-4 border-l-orange-500' : ''}`}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-lg">{message.name}</h3>
                      {!message.isRead && (
                        <Badge variant="destructive" className="text-xs">
                          New
                        </Badge>
                      )}
                      {message.isReplied && (
                        <Badge variant="default" className="text-xs">
                          Replied
                        </Badge>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                      <span className="flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        {message.email}
                      </span>
                      {message.phone && (
                        <span className="flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          {message.phone}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(message.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                      {message.message}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-2 ml-4">
                    <Button variant="outline" size="sm" onClick={() => openViewDialog(message)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" asChild>
                      <a href={`mailto:${message.email}?subject=Re: Your message from ${message.name}`}>
                        <Reply className="h-4 w-4" />
                      </a>
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleDeleteMessage(message.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="p-12 text-center">
              <MessageSquare className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No messages found</h3>
              <p className="text-muted-foreground">
                {searchTerm || statusFilter !== 'all' 
                  ? 'Try adjusting your search or filter criteria.'
                  : 'No contact messages have been received yet.'
                }
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* View Message Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Message from {selectedMessage?.name}
            </DialogTitle>
            <DialogDescription>
              Received on {selectedMessage && new Date(selectedMessage.createdAt).toLocaleString()}
            </DialogDescription>
          </DialogHeader>
          
          {selectedMessage && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Email</label>
                  <p className="text-sm">{selectedMessage.email}</p>
                </div>
                {selectedMessage.phone && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Phone</label>
                    <p className="text-sm">{selectedMessage.phone}</p>
                  </div>
                )}
              </div>
              
              <div>
                <label className="text-sm font-medium text-muted-foreground">Message</label>
                <div className="mt-1 p-3 bg-muted rounded-lg">
                  <p className="text-sm whitespace-pre-wrap">{selectedMessage.message}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2 pt-4 border-t">
                <Button asChild>
                  <a href={`mailto:${selectedMessage.email}?subject=Re: Your message from ${selectedMessage.name}&body=Hi ${selectedMessage.name},%0D%0A%0D%0AThank you for your message. I'll get back to you soon.%0D%0A%0D%0ABest regards`}>
                    <Reply className="h-4 w-4 mr-2" />
                    Reply via Email
                  </a>
                </Button>
                <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
