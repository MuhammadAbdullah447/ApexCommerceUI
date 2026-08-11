import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Notification {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  type: 'offer' | 'promotion' | 'wishlist' | 'welcome' | 'recommendation' | 'order';
  read: boolean;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearNotification: (id: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: 'n1',
    title: 'Welcome to Apex Premium!',
    description: 'Explore our latest collections of high-performance running shoes and lifestyle wear. Thank you for joining us!',
    timestamp: 'Just now',
    type: 'welcome',
    read: false,
  },
  {
    id: 'n2',
    title: 'Flash Sale: 20% Off Sneakers',
    description: 'Get an extra 20% off all performance series running shoes. Use code APEXRUN20 at checkout today.',
    timestamp: '2 hours ago',
    type: 'promotion',
    read: false,
  },
  {
    id: 'n3',
    title: 'Price Drop on Your Wishlist',
    description: 'The Apex Velocity Runner in your wishlist has dropped in price by $20! Buy it now for $169.',
    timestamp: '5 hours ago',
    type: 'wishlist',
    read: false,
  },
  {
    id: 'n4',
    title: 'Order Shipped - #APX-90182',
    description: 'Great news! Your sample order #APX-90182 has been shipped and is on its way. Track your package live in app.',
    timestamp: '1 day ago',
    type: 'order',
    read: false,
  },
  {
    id: 'n5',
    title: 'Recommended for You',
    description: 'Based on your interest in running shoes, check out our new arrivals in lightweight athletic apparel.',
    timestamp: '2 days ago',
    type: 'recommendation',
    read: true,
  },
  {
    id: 'n6',
    title: 'Exclusive Weekend Offer',
    description: 'Unlock free shipping on all orders over $75 this weekend only. Discount automatically applied at checkout.',
    timestamp: '3 days ago',
    type: 'offer',
    read: true,
  },
  {
    id: 'n7',
    title: 'Apex Stealth Run Back in Stock!',
    description: 'One of your favorited items, Apex Stealth Run, is now fully restocked in all sizes. Order before it sells out again.',
    timestamp: '4 days ago',
    type: 'wishlist',
    read: true,
  },
  {
    id: 'n8',
    title: 'Security Update Notification',
    description: 'Your Apex account password was successfully changed. If you did not make this change, please contact support.',
    timestamp: '1 week ago',
    type: 'welcome',
    read: true,
  },
];

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [notifications, setNotifications] = useState<Notification[]>(INITIAL_NOTIFICATIONS);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const clearNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        markAsRead,
        markAllAsRead,
        clearNotification,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};
