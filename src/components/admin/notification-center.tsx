"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Bell,
  Check,
  CheckCheck,
  Trash2,
  ExternalLink,
  Info,
  CheckCircle,
  AlertTriangle,
  XCircle,
  X
} from 'lucide-react';
import { 
  getNotificationsAction,
  getUnreadNotificationsAction,
  markNotificationAsReadAction,
  markAllNotificationsAsReadAction,
  deleteNotificationAction,
  deleteAllNotificationsAction
} from '@/actions/admin/notificationActions';
import { toast } from '@/hooks/use-toast';
import type { Notification } from '@/lib/types';

interface NotificationCenterProps {
  showUnreadOnly?: boolean;
  limit?: number;
}

export function NotificationCenter({ showUnreadOnly = false, limit = 10 }: NotificationCenterProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    loadNotifications();
  }, [showUnreadOnly, limit]);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      const data = showUnreadOnly 
        ? await getUnreadNotificationsAction()
        : await getNotificationsAction();
      
      setNotifications(data.slice(0, limit));
      
      // Get unread count for badge
      const unreadData = await getUnreadNotificationsAction();
      setUnreadCount(unreadData.length);
    } catch (error) {
      console.error('Error loading notifications:', error);
      toast({
        title: "Error",
        description: "Failed to load notifications",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      const result = await markNotificationAsReadAction(notificationId);
      if (result.success) {
        setNotifications(prev => 
          prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
        );
        setUnreadCount(prev => Math.max(0, prev - 1));
        toast({
          title: "Success",
          description: "Notification marked as read",
        });
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to mark notification as read",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to mark notification as read",
        variant: "destructive",
      });
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const result = await markAllNotificationsAsReadAction();
      if (result.success) {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
        setUnreadCount(0);
        toast({
          title: "Success",
          description: "All notifications marked as read",
        });
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to mark all notifications as read",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to mark all notifications as read",
        variant: "destructive",
      });
    }
  };

  const handleDeleteNotification = async (notificationId: string) => {
    try {
      const result = await deleteNotificationAction(notificationId);
      if (result.success) {
        setNotifications(prev => prev.filter(n => n.id !== notificationId));
        setUnreadCount(prev => Math.max(0, prev - 1));
        toast({
          title: "Success",
          description: "Notification deleted",
        });
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to delete notification",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete notification",
        variant: "destructive",
      });
    }
  };

  const handleDeleteAll = async () => {
    if (!confirm('Are you sure you want to delete all notifications? This action cannot be undone.')) {
      return;
    }

    try {
      const result = await deleteAllNotificationsAction();
      if (result.success) {
        setNotifications([]);
        setUnreadCount(0);
        toast({
          title: "Success",
          description: "All notifications deleted",
        });
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to delete all notifications",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete all notifications",
        variant: "destructive",
      });
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'error': return <XCircle className="h-4 w-4 text-red-600" />;
      default: return <Info className="h-4 w-4 text-blue-600" />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'success': return 'border-l-green-500 bg-green-50 dark:bg-green-950/20';
      case 'warning': return 'border-l-yellow-500 bg-yellow-50 dark:bg-yellow-950/20';
      case 'error': return 'border-l-red-500 bg-red-50 dark:bg-red-950/20';
      default: return 'border-l-blue-500 bg-blue-50 dark:bg-blue-950/20';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto mb-2"></div>
          <p className="text-sm text-muted-foreground">Loading notifications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bell className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold text-foreground">
            Notifications
          </h3>
          {unreadCount > 0 && (
            <Badge variant="destructive" className="h-5 w-5 flex items-center justify-center p-0 text-xs">
              {unreadCount}
            </Badge>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <Button
              size="sm"
              variant="outline"
              onClick={handleMarkAllAsRead}
              className="text-xs"
            >
              <CheckCheck className="h-3 w-3 mr-1" />
              Mark All Read
            </Button>
          )}
          {notifications.length > 0 && (
            <Button
              size="sm"
              variant="outline"
              onClick={handleDeleteAll}
              className="text-xs text-destructive hover:text-destructive"
            >
              <Trash2 className="h-3 w-3 mr-1" />
              Clear All
            </Button>
          )}
        </div>
      </div>

      {/* Notifications List */}
      {notifications.length === 0 ? (
        <Card className="card-modern">
          <CardContent className="p-8 text-center">
            <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h4 className="text-lg font-semibold text-foreground mb-2">
              {showUnreadOnly ? 'No Unread Notifications' : 'No Notifications'}
            </h4>
            <p className="text-muted-foreground">
              {showUnreadOnly 
                ? 'You\'re all caught up! No unread notifications.'
                : 'You don\'t have any notifications yet.'
              }
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {notifications.map((notification) => (
            <Card 
              key={notification.id} 
              className={`card-modern border-l-4 ${getNotificationColor(notification.type)} ${
                !notification.read ? 'ring-2 ring-primary/20' : ''
              }`}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-1">
                    {getNotificationIcon(notification.type)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h4 className="font-semibold text-foreground text-sm">
                        {notification.title}
                      </h4>
                      {!notification.read && (
                        <div className="h-2 w-2 bg-primary rounded-full flex-shrink-0 mt-2" />
                      )}
                    </div>
                    
                    <p className="text-muted-foreground text-sm mb-2">
                      {notification.message}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">
                        {new Date(notification.createdAt).toLocaleDateString()} at{' '}
                        {new Date(notification.createdAt).toLocaleTimeString()}
                      </span>
                      
                      <div className="flex items-center gap-1">
                        {notification.actionUrl && (
                          <Button
                            size="sm"
                            variant="ghost"
                            asChild
                            className="text-xs h-6 px-2"
                          >
                            <a href={notification.actionUrl}>
                              {notification.actionText || 'View'}
                              <ExternalLink className="h-3 w-3 ml-1" />
                            </a>
                          </Button>
                        )}
                        
                        {!notification.read && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleMarkAsRead(notification.id)}
                            className="text-xs h-6 px-2"
                          >
                            <Check className="h-3 w-3" />
                          </Button>
                        )}
                        
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDeleteNotification(notification.id)}
                          className="text-xs h-6 px-2 text-destructive hover:text-destructive"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
