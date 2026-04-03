'use client';

import { useState, useEffect, useRef } from 'react';
import { Bell } from 'lucide-react';
import { getUserNotifications, markNotificationsAsRead } from '@/app/actions/notification';
import Link from 'next/link';
import Image from 'next/image';
import { formatDistanceToNow } from 'date-fns';

const NotificationItem = ({ notif, closeMenu }: { notif: any, closeMenu: () => void }) => {
  let title = '';
  switch (notif.type) {
     case 'LIKE': title = 'liked your story'; break;
     case 'COMMENT': title = 'commented on your story'; break;
     case 'NEW_POST': title = 'published a new story'; break;
  }

  return (
      <Link 
        href={`/blog/${notif.blog.slug}`} 
        onClick={closeMenu}
        className={`flex items-start gap-3 p-4 hover:bg-gray-50 transition-colors ${!notif.isRead ? 'bg-blue-50/50' : ''}`}
      >
          <Image 
             src={notif.sender?.image || '/default-avatar.png'} 
             alt="Avatar" 
             width={36} 
             height={36} 
             className="rounded-full mt-1" 
          />
          <div className="flex-1 min-w-0">
              <p className="text-[14px] text-gray-800 leading-snug">
                 <span className="font-bold">{notif.sender?.name}</span> {title} <span className="font-medium text-gray-900 border-b border-gray-200">"{notif.blog.title}"</span>
              </p>
              <p className="text-[12px] text-gray-400 mt-1">{formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true })}</p>
          </div>
          {!notif.isRead && <div className="w-2 h-2 rounded-full bg-blue-600 mt-2 flex-shrink-0" />}
      </Link>
  );
};

export default function NotificationsDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
     let mounted = true;
     const fetchNotifs = async () => {
         try {
             const data = await getUserNotifications();
             if (mounted && data) {
                 setNotifications(data);
                 setUnreadCount(data.filter((n: any) => !n.isRead).length);
             }
         } catch (e) {
             console.error("Failed to load notifications");
         }
     };
     
     // Initial fetch
     fetchNotifs();
     
     // Poll every 30 seconds for new notifications!
     const interval = setInterval(fetchNotifs, 30000);
     return () => {
         mounted = false;
         clearInterval(interval);
     };
  }, []);

  // Close on outside click
  useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
          if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
              setIsOpen(false);
          }
      };
      if (isOpen) document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const toggleOpen = async () => {
       const newIsOpen = !isOpen;
       setIsOpen(newIsOpen);
       if (newIsOpen && unreadCount > 0) {
            setUnreadCount(0);
            await markNotificationsAsRead();
            setNotifications(prev => prev.map((n: any) => ({ ...n, isRead: true })));
       }
  };

  return (
      <div className="relative" ref={dropdownRef}>
          <button 
             onClick={toggleOpen}
             className={`relative transition-colors flex items-center justify-center p-2 rounded-full hidden sm:flex ${isOpen ? 'bg-gray-100 text-gray-900' : 'text-gray-400 hover:text-gray-900 hover:bg-gray-50'}`}
          >
             <Bell size={22} strokeWidth={1.5} />
             {unreadCount > 0 && (
                 <span className="absolute top-1 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white" />
             )}
          </button>

          {isOpen && (
             <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 overflow-hidden transform origin-top-right transition-all">
                <div className="p-4 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
                    <h3 className="font-bold text-gray-900 text-[15px]">Notifications</h3>
                </div>
                <div className="max-h-[400px] overflow-y-auto overscroll-contain">
                    {notifications.length > 0 ? (
                        <div className="flex flex-col divide-y divide-gray-50">
                            {notifications.map((notif: any) => (
                                <NotificationItem key={notif._id} notif={notif} closeMenu={() => setIsOpen(false)} />
                            ))}
                        </div>
                    ) : (
                        <div className="py-12 text-center px-4">
                            <span className="text-3xl block mb-3">🔔</span>
                            <p className="text-gray-900 font-bold text-sm">You're all caught up</p>
                            <p className="text-gray-500 text-xs mt-1">Check back later for new interactions.</p>
                        </div>
                    )}
                </div>
             </div>
          )}
      </div>
  );
}
