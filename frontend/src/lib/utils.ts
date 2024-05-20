import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function getTimeAgo(isoTimestamp: string): string {
	const now = new Date();
	const pastDate = new Date(isoTimestamp);
	const seconds = Math.floor((now.getTime() - pastDate.getTime()) / 1000);

	let interval = Math.floor(seconds / 31536000); // seconds in a year
	if (interval > 1) {
		return `${interval} years ago`;
	} else if (interval === 1) {
		return `1 year ago`;
	}

	interval = Math.floor(seconds / 2592000); // seconds in a month
	if (interval > 1) {
		return `${interval} months ago`;
	} else if (interval === 1) {
		return `1 month ago`;
	}

	interval = Math.floor(seconds / 604800); // seconds in a week
	if (interval > 1) {
		return `${interval} weeks ago`;
	} else if (interval === 1) {
		return `1 week ago`;
	}

	interval = Math.floor(seconds / 86400); // seconds in a day
	if (interval > 1) {
		return `${interval} days ago`;
	} else if (interval === 1) {
		return `1 day ago`;
	}

	interval = Math.floor(seconds / 3600); // seconds in an hour
	if (interval > 1) {
		return `${interval} hours ago`;
	} else if (interval === 1) {
		return `1 hour ago`;
	}

	interval = Math.floor(seconds / 60); // seconds in a minute
	if (interval > 1) {
		return `${interval} minutes ago`;
	} else if (interval === 1) {
		return `1 minute ago`;
	}

	return `${seconds} seconds ago`;
}
