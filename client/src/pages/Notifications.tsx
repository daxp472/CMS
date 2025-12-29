import React, { useEffect, useState } from 'react';
import { Header } from '../components/layout/Header';
import { Card } from '../components/ui/Card';
import { useNotifications } from '../context/NotificationContext';
import { Button } from '../components/ui/Button';
import { useNavigate } from 'react-router-dom';

export const Notifications: React.FC = () => {
  const { notifications, unreadCount, markAsRead, markAllRead, refresh } = useNotifications();
  const [filter, setFilter] = useState<'ALL' | 'UNREAD'>('ALL');
  const nav = useNavigate();

  useEffect(() => { refresh(); }, []);

  const list = filter === 'ALL' ? notifications : notifications.filter(n => !n.isRead);

  return (
    <div className="p-6">
      <Header title="Notifications" subtitle="Recent system notifications" action={<Button variant="ghost" onClick={() => setFilter(filter === 'ALL' ? 'UNREAD' : 'ALL')}>{filter === 'ALL' ? 'Show Unread' : 'Show All'}</Button>} />

      <Card>
        <div className="flex items-center justify-between mb-4">
          <div className="text-sm text-gray-600">Unread: {unreadCount}</div>
          <div>
            <Button variant="ghost" onClick={markAllRead}>Mark all read</Button>
          </div>
        </div>

        {list.length === 0 && <div className="text-sm text-gray-600">No notifications</div>}

        {list.map((n) => (
          <div key={n.id} className={`p-3 border-b cursor-pointer ${n.isRead ? '' : 'bg-gray-50'}`} onClick={() => { markAsRead(n.id); nav(`/police/cases/${n.relatedCaseId}`); }}>
            <div className="flex justify-between">
              <div className="font-medium">{n.title}</div>
              <div className="text-xs text-gray-400">{new Date(n.createdAt).toLocaleString()}</div>
            </div>
            <div className="text-sm text-gray-600 mt-1">{n.message}</div>
          </div>
        ))}
      </Card>
    </div>
  );
};
