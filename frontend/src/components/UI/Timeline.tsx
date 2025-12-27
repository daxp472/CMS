import React from 'react';
import { TimelineEntry } from '../../types';
import { Clock, CheckCircle, AlertCircle, XCircle } from 'lucide-react';

interface TimelineProps {
  entries: TimelineEntry[];
  className?: string;
}

const Timeline: React.FC<TimelineProps> = ({ entries, className = '' }) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-400" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-400" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-400" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-400" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className={`flow-root ${className}`}>
      <ul className="-mb-8">
        {entries.map((entry, entryIdx) => (
          <li key={entry.id}>
            <div className="relative pb-8">
              {entryIdx !== entries.length - 1 && (
                <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-600" />
              )}
              <div className="relative flex space-x-3">
                <div className="flex items-center justify-center h-8 w-8 rounded-full bg-gray-800 border-2 border-gray-600">
                  {getStatusIcon(entry.status)}
                </div>
                <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                  <div>
                    <p className="text-sm text-white font-medium">{entry.action}</p>
                    <p className="text-sm text-gray-400">{entry.description}</p>
                    <p className="text-xs text-gray-500">By {entry.userName}</p>
                  </div>
                  <div className="text-right text-xs text-gray-500 whitespace-nowrap">
                    {formatDate(entry.timestamp)}
                  </div>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Timeline;