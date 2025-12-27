import React from 'react';

interface StatusBadgeProps {
  status: string;
  className?: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className = '' }) => {
  const getStatusClass = (status: string) => {
    switch (status.toLowerCase()) {
      case 'draft':
        return 'status-draft';
      case 'registered':
      case 'preparing':
        return 'status-preparing';
      case 'submitted_to_sho':
        return 'status-submitted_to_sho';
      case 'approved_by_sho':
        return 'status-approved_by_sho';
      case 'submitted_to_court':
        return 'status-submitted_to_court';
      case 'court_acknowledged':
        return 'status-court_acknowledged';
      case 'under_review':
        return 'status-under_review';
      case 'accepted':
        return 'status-accepted';
      case 'locked':
        return 'status-locked';
      case 'pending':
        return 'status-pending';
      case 'completed':
        return 'status-completed';
      case 'failed':
        return 'status-failed';
      default:
        return 'status-default';
    }
  };

  const formatStatus = (status: string) => {
    return status
      .replace(/_/g, ' ')
      .replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusClass(status)} ${className}`}>
      {formatStatus(status)}
    </span>
  );
};

export default StatusBadge;