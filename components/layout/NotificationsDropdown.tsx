'use client';

import { useState, useEffect, useRef } from 'react';
import { Bell, BellOff } from 'lucide-react';
import { getUserNotifications, markNotificationsAsRead } from '@/app/actions/notification';
import Link from 'next/link';
import Image from 'next/image';
import { formatDistanceToNow } from 'date-fns';

const NotificationItem = ({ notif, closeMenu }: { notif: any, closeMenu: () => void }) => {
  let title = '';
  let href = '#';

  if (notif.blog) {
    href = `/blog/${notif.blog.slug}`;
  } else if (notif.sender) {
    href = `/user/${notif.sender._id}`;
  }

  switch (notif.type) {
     case 'LIKE': title = 'liked your story'; break;
     case 'COMMENT': title = 'commented on your story'; break;
     case 'NEW_POST': title = 'published a new story'; break;
     case 'FOLLOW': title = 'started following you'; break;
     default: title = 'interacted with you'; break;
  }

  return (
      <Link 
        href={href} 
        onClick={closeMenu}
        className={`flex items-start gap-4 p-4 border-b-[3px] border-black dark:border-white transition-all ${!notif.isRead ? 'bg-primary/20' : 'bg-white dark:bg-zinc-900'} hover:bg-primary/40`}
      >
          <Image 
             src={notif.sender?.image || '/default-avatar.png'} 
             alt="Avatar" 
             width={40} 
             height={40} 
             className="border-[2px] border-black dark:border-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] object-cover aspect-square grayscale contrast-125" 
          />
          <div className="flex-1 min-w-0 transition-colors">
              <p className="text-[13px] text-black dark:text-white leading-snug font-bold uppercase tracking-tight">
                 <span className="font-black text-black dark:text-white">{notif.sender?.name}</span> {title} {notif.blog && (
                   <span className="font-black text-black dark:text-white bg-secondary px-1 border-[1px] border-black">"{notif.blog.title}"</span>
                 )}
              </p>
              <p className="text-[10px] text-zinc-500 font-black uppercase mt-1">{formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true })}</p>
          </div>
          {!notif.isRead && <div className="w-3 h-3 bg-primary border-[2px] border-black mt-2 flex-shrink-0" />}
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
     
     fetchNotifs();
     const interval = setInterval(fetchNotifs, 30000);
     return () => {
         mounted = false;
         clearInterval(interval);
     };
  }, []);

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
             className={`relative transition-all flex items-center justify-center p-2 border-[3px] border-black dark:border-white shadow-neo active:shadow-none active:translate-x-1 active:translate-y-1 ${isOpen ? 'bg-primary' : 'bg-white dark:bg-zinc-900 text-black dark:text-white'}`}
          >
             <Bell size={22} strokeWidth={3} />
             {unreadCount > 0 && (
                 <span className="absolute -top-1.5 -right-1.5 min-w-[20px] h-5 bg-secondary text-black text-[10px] font-black flex items-center justify-center px-1 border-[2px] border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                    {unreadCount}
                 </span>
             )}
          </button>

          {isOpen && (
             <div className="absolute right-0 mt-4 w-80 sm:w-96 bg-white dark:bg-zinc-900 border-[5px] border-black dark:border-white shadow-neo-lg z-50 overflow-hidden transform origin-top-right transition-all">
                <div className="p-4 border-b-[4px] border-black dark:border-white flex justify-between items-center bg-secondary transition-colors">
                    <h3 className="font-black text-black text-[14px] uppercase tracking-widest">Notifications</h3>
                </div>
                <div className="max-h-[400px] overflow-y-auto overscroll-contain transition-colors">
                    {notifications.length > 0 ? (
                        <div className="flex flex-col transition-colors">
                            {notifications.map((notif: any) => (
                                <NotificationItem key={notif._id} notif={notif} closeMenu={() => setIsOpen(false)} />
                            ))}
                        </div>
                    ) : (
                        <div className="py-16 text-center px-6 transition-colors">
                            <div className="w-16 h-16 bg-white border-[3px] border-black shadow-neo flex items-center justify-center mx-auto mb-6">
                               <BellOff size={32} strokeWidth={3} className="text-zinc-400" />
                            </div>
                            <p className="text-black dark:text-white font-black uppercase text-sm tracking-tight">You're all caught up</p>
                            <p className="text-zinc-500 font-bold text-[10px] uppercase mt-2">Check back later for new interactions.</p>
                        </div>
                    )}
                </div>
             </div>
          )}
      </div>
  );
}
