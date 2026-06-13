export const JOB_TYPES = [
  { value: 'full-time', label: 'Full Time' },
  { value: 'part-time', label: 'Part Time' },
  { value: 'contract', label: 'Contract' },
  { value: 'internship', label: 'Internship' },
  { value: 'remote', label: 'Remote' },
];

export const APPLICATION_STATUS = {
  applied: { label: 'Applied', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' },
  reviewing: { label: 'Reviewing', color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' },
  shortlisted: { label: 'Shortlisted', color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' },
  interview: { label: 'Interview', color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' },
  offered: { label: 'Offered', color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' },
  rejected: { label: 'Rejected', color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' },
  withdrawn: { label: 'Withdrawn', color: 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400' },
};

export const SKILLS_LIST = [
  'JavaScript', 'TypeScript', 'React', 'Vue.js', 'Angular', 'Node.js', 'Express.js',
  'Python', 'Django', 'Flask', 'Java', 'Spring Boot', 'C++', 'C#', '.NET',
  'Go', 'Rust', 'Ruby', 'Rails', 'PHP', 'Laravel', 'Swift', 'Kotlin',
  'MongoDB', 'PostgreSQL', 'MySQL', 'Redis', 'GraphQL', 'REST API',
  'AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes', 'CI/CD', 'Terraform',
  'Git', 'Linux', 'Agile', 'Scrum', 'Figma', 'Adobe XD', 'Tailwind CSS',
  'Machine Learning', 'Data Science', 'AI', 'Blockchain', 'DevOps',
];

export const LOCATIONS = [
  'Bangalore, India', 'Mumbai, India', 'Delhi, India', 'Hyderabad, India',
  'Chennai, India', 'Pune, India', 'Kolkata, India', 'Noida, India',
  'Gurugram, India', 'Ahmedabad, India', 'Remote',
];
