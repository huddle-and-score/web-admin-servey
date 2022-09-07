import { doc, updateDoc } from '@firebase/firestore';
import { getFirebase } from './firebase';
import firebase from 'firebase/compat';
import FieldValue = firebase.firestore.FieldValue;

const { db } = getFirebase();

export interface EventDocument {
	liveStream?: string;
	fixtures: { [fixtureID: string]: string };
	teams: { [teamID: string]: string };
	players: { [playerID: string]: string };
}

export const eventRef = doc(db, 'Event/001');
export const eventID = eventRef.id;
const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
const charactersLength = characters.length;

export function randomStr(length = 10) {
	let result = '';
	for (let i = 0; i < length; i++) {
		result += characters.charAt(Math.floor(Math.random() * charactersLength));
	}
	return result;
}

export async function setLiveStream(url: null | string) {
	await updateDoc(eventRef, {
		liveStream: url ?? FieldValue.delete()
	});
}
