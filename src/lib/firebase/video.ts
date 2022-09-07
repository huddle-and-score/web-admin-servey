import { eventID, eventRef, randomStr } from './event';
import { collection, deleteDoc, doc, setDoc } from '@firebase/firestore';
import type { Timestamp } from '@firebase/firestore';
import { deleteObject, getDownloadURL, ref, uploadBytes } from '@firebase/storage';
import { getFirebase } from './firebase';
import firebase from 'firebase/compat';
import FieldValue = firebase.firestore.FieldValue;

const { str } = getFirebase();

export const videoColl = collection(eventRef, 'Video/');

export interface VideoProps<video = string> {
	video: video;
	caption: string;
	connectionIDs: string[]; // teamID || playerID
}
export interface VideoDocument<image = string> extends VideoProps<image> {
	createdAt: Timestamp;
}

export function setVideo(videoID: undefined, data: VideoProps<File>): Promise<string>;
export function setVideo(videoID: string, data: VideoProps<File | string>): Promise<string>;
export function setVideo(videoID: string, data: null): Promise<string>;
export async function setVideo(
	videoID: string | undefined,
	data: VideoProps<File | string> | null
) {
	if (videoID === undefined) {
		videoID = randomStr();
		(data as any).createdAt = FieldValue.serverTimestamp();
	}
	const image = ref(str, 'Event/' + eventID + '/Video/' + videoID);
	const videoRef = doc(videoColl, videoID);
	if (data !== null) {
		if (typeof data.video !== 'string') {
			await uploadBytes(image, data.video);
			data = { ...data, video: await getDownloadURL(image) };
		}
		await setDoc(videoRef, data, { merge: true });
	} else {
		await deleteObject(image);
		await deleteDoc(videoRef);
	}
	return videoID;
}