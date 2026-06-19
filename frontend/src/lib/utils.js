import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * cn — merge conditional class names and de-dupe conflicting Tailwind classes.
 * The standard shadcn/ui helper, in plain JS (this project is JavaScript, not TS).
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
