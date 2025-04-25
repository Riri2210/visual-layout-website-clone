import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { id } from 'date-fns/locale';
import { 
  Bell, 
  FileText,
  School,
  Check
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { NotificationType, useNotifications } from '@/contexts/NotificationContext';

const NotificationIcon = ({ type }: { type: NotificationType['type'] }) => {
  switch (type) {
    case 'bos':
    case 'bop':
      return <FileText className="h-4 w-4 text-blue-500" />;
    case 'identity':
      return <School className="h-4 w-4 text-green-500" />;
    default:
      return <Bell className="h-4 w-4 text-gray-500" />;
  }
};

const NotificationItem = ({ notification }: { notification: NotificationType }) => {
  const { markAsRead } = useNotifications();
  
  return (
    <DropdownMenuItem 
      className={`flex items-start p-3 border-b border-gray-100 cursor-pointer ${notification.read ? 'opacity-70' : 'bg-blue-50'}`}
      onClick={() => markAsRead(notification.id)}
    >
      <div className="mr-3 mt-1">
        <NotificationIcon type={notification.type} />
      </div>
      <div className="flex-1">
        <p className="text-sm">{notification.message}</p>
        <p className="text-xs text-gray-500 mt-1">
          {formatDistanceToNow(notification.createdAt, { addSuffix: true, locale: id })}
        </p>
      </div>
      {!notification.read && (
        <div className="ml-2 w-2 h-2 bg-blue-500 rounded-full"></div>
      )}
    </DropdownMenuItem>
  );
};

const NotificationDropdown = () => {
  const { notifications, unreadCount, markAllAsRead, clearNotifications } = useNotifications();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell size={20} className="text-gray-600" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 min-w-5 h-5 flex items-center justify-center bg-red-500 text-white text-xs rounded-full px-1">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80" align="end">
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>Notifikasi</span>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={markAllAsRead} className="h-8 px-2">
              <Check className="h-4 w-4 mr-1" />
              Tandai Dibaca
            </Button>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <ScrollArea className="h-[300px]">
          <DropdownMenuGroup>
            {notifications.length > 0 ? (
              notifications.map(notification => (
                <NotificationItem key={notification.id} notification={notification} />
              ))
            ) : (
              <div className="p-4 text-center text-gray-500">
                <Bell className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                <p>Tidak ada notifikasi</p>
              </div>
            )}
          </DropdownMenuGroup>
        </ScrollArea>
        {notifications.length > 0 && (
          <>
            <DropdownMenuSeparator />
            <div className="p-2 text-center">
              <Button variant="ghost" size="sm" onClick={clearNotifications} className="text-xs">
                Hapus Semua Notifikasi
              </Button>
            </div>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificationDropdown;
