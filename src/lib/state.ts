import type { User } from 'firebase/auth';
import { writable } from 'svelte/store';
import type { News, Event, Video } from './firebase/db';

export const event = writable<Event>();
export const news = writable<News[]>();
export const videos = writable<Video[]>();
export const auth = writable<User | null>(null);
