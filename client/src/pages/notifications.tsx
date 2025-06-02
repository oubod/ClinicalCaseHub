import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bell, MessageSquare, UserPlus, Star, FileText, CheckCircle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface Notification {
  id: string;
  type: 'comment' | 'mention' | 'case_update' | 'follow' | 'featured';
  title: string;
  message: string;
  read: boolean;
  createdAt: Date;
  caseId?: number;
  userId?: string;
}

export default function Notifications() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      type: "comment",
      title: "New comment on your case",
      message: "Dr. Sarah Johnson commented on 'Complex Cardiac Arrhythmia Case'",
      read: false,
      createdAt: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
      caseId: 1,
      userId: "sarah_johnson"
    },
    {
      id: "2", 
      type: "case_update",
      title: "Case status updated",
      message: "Your case 'Neurological Presentation Mystery' has been marked as resolved",
      read: false,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
      caseId: 2
    },
    {
      id: "3",
      type: "featured",
      title: "Case featured",
      message: "Your case 'Rare Metabolic Disorder' has been featured in this week's highlights",
      read: true,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
      caseId: 3
    },
    {
      id: "4",
      type: "mention",
      title: "You were mentioned",
      message: "Dr. Michael Chen mentioned you in a comment on 'Emergency Trauma Case'",
      read: true,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
      caseId: 4,
      userId: "michael_chen"
    }
  ]);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  const unreadNotifications = notifications.filter(n => !n.read);
  const readNotifications = notifications.filter(n => n.read);

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(n => ({ ...n, read: true }))
    );
  };

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'comment':
        return <MessageSquare className="w-5 h-5 text-blue-500" />;
      case 'mention':
        return <UserPlus className="w-5 h-5 text-green-500" />;
      case 'case_update':
        return <FileText className="w-5 h-5 text-orange-500" />;
      case 'featured':
        return <Star className="w-5 h-5 text-yellow-500" />;
      default:
        return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  const getNotificationColor = (type: Notification['type']) => {
    switch (type) {
      case 'comment':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'mention':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'case_update':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      case 'featured':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-background">
        <div className="text-center">
          <div className="w-16 h-16 bg-medical-blue rounded-lg flex items-center justify-center mx-auto mb-4">
            <Bell className="text-white text-2xl" />
          </div>
          <p className="text-slate-600 dark:text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-background">
      <Sidebar />
      
      <main className="flex-1 flex flex-col overflow-hidden">
        <Header
          onSearch={() => {}}
          onCreateCase={() => {}}
        />
        
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-foreground mb-2">Notifications</h1>
              <p className="text-slate-600 dark:text-muted-foreground">
                Stay updated with your case discussions and platform activity
              </p>
            </div>
            {unreadNotifications.length > 0 && (
              <Button 
                onClick={markAllAsRead}
                variant="outline"
                className="text-sm"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Mark all as read
              </Button>
            )}
          </div>

          <Tabs defaultValue="all" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="all">
                All ({notifications.length})
              </TabsTrigger>
              <TabsTrigger value="unread">
                Unread ({unreadNotifications.length})
                {unreadNotifications.length > 0 && (
                  <span className="ml-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                    {unreadNotifications.length}
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger value="read">
                Read ({readNotifications.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all">
              <NotificationsList 
                notifications={notifications}
                onMarkAsRead={markAsRead}
                getIcon={getNotificationIcon}
                getColor={getNotificationColor}
              />
            </TabsContent>

            <TabsContent value="unread">
              <NotificationsList 
                notifications={unreadNotifications}
                onMarkAsRead={markAsRead}
                getIcon={getNotificationIcon}
                getColor={getNotificationColor}
              />
            </TabsContent>

            <TabsContent value="read">
              <NotificationsList 
                notifications={readNotifications}
                onMarkAsRead={markAsRead}
                getIcon={getNotificationIcon}
                getColor={getNotificationColor}
              />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}

interface NotificationsListProps {
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  getIcon: (type: Notification['type']) => JSX.Element;
  getColor: (type: Notification['type']) => string;
}

function NotificationsList({ notifications, onMarkAsRead, getIcon, getColor }: NotificationsListProps) {
  if (notifications.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-16 h-16 bg-slate-200 dark:bg-muted rounded-lg flex items-center justify-center mx-auto mb-4">
          <Bell className="text-slate-400 dark:text-muted-foreground text-2xl" />
        </div>
        <h3 className="text-xl font-semibold text-slate-900 dark:text-foreground mb-2">No notifications</h3>
        <p className="text-slate-600 dark:text-muted-foreground">
          You're all caught up! No new notifications at this time.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {notifications.map((notification) => (
        <Card 
          key={notification.id} 
          className={`bg-white dark:bg-card border border-slate-200 dark:border-border cursor-pointer transition-all hover:shadow-md ${
            !notification.read ? 'border-l-4 border-l-blue-500' : ''
          }`}
          onClick={() => !notification.read && onMarkAsRead(notification.id)}
        >
          <CardHeader className="pb-2">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  {getIcon(notification.type)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <h3 className={`font-medium ${!notification.read ? 'text-slate-900 dark:text-foreground' : 'text-slate-700 dark:text-slate-300'}`}>
                      {notification.title}
                    </h3>
                    <Badge className={`text-xs ${getColor(notification.type)}`}>
                      {notification.type.replace('_', ' ')}
                    </Badge>
                  </div>
                  <p className={`text-sm mt-1 ${!notification.read ? 'text-slate-700 dark:text-slate-300' : 'text-slate-600 dark:text-muted-foreground'}`}>
                    {notification.message}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {!notification.read && (
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                )}
                <span className="text-xs text-slate-500 dark:text-muted-foreground">
                  {formatDistanceToNow(notification.createdAt, { addSuffix: true })}
                </span>
              </div>
            </div>
          </CardHeader>
          
          {(notification.caseId || notification.userId) && (
            <CardContent className="pt-0">
              <div className="flex space-x-2">
                {notification.caseId && (
                  <Button size="sm" variant="outline" className="text-xs">
                    View Case
                  </Button>
                )}
                {notification.userId && (
                  <Button size="sm" variant="outline" className="text-xs">
                    View Profile
                  </Button>
                )}
              </div>
            </CardContent>
          )}
        </Card>
      ))}
    </div>
  );
}