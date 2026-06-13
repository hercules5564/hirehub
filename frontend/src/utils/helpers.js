export const formatSalary = (salary) => {
  if (!salary || (!salary.min && !salary.max)) return 'Not Disclosed';
  const fmt = (n) => {
    if (n >= 100000) return `₹${(n / 100000).toFixed(n % 100000 === 0 ? 0 : 1)}L`;
    if (n >= 1000) return `₹${(n / 1000).toFixed(0)}K`;
    return `₹${n}`;
  };
  if (salary.min && salary.max) return `${fmt(salary.min)} - ${fmt(salary.max)}`;
  if (salary.min) return `${fmt(salary.min)}+`;
  return `Up to ${fmt(salary.max)}`;
};

export const formatDate = (date) => {
  if (!date) return '';
  const d = new Date(date);
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
};

export const timeAgo = (date) => {
  if (!date) return '';
  const seconds = Math.floor((Date.now() - new Date(date)) / 1000);
  const intervals = [
    { label: 'year', seconds: 31536000 }, { label: 'month', seconds: 2592000 },
    { label: 'week', seconds: 604800 }, { label: 'day', seconds: 86400 },
    { label: 'hour', seconds: 3600 }, { label: 'minute', seconds: 60 },
  ];
  for (const interval of intervals) {
    const count = Math.floor(seconds / interval.seconds);
    if (count >= 1) return `${count} ${interval.label}${count > 1 ? 's' : ''} ago`;
  }
  return 'Just now';
};

export const truncate = (str, len = 100) => {
  if (!str) return '';
  return str.length > len ? str.substring(0, len) + '...' : str;
};

export const getInitials = (name) => {
  if (!name) return '?';
  return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
};
