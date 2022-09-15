import { getApps, initializeApp } from 'firebase/app';
import config from '../../env';
import { getFirestore, initializeFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAuth } from 'firebase/auth';
import { initializeAppCheck, ReCaptchaV3Provider } from 'firebase/app-check';
import { dev, browser } from '$app/environment';

export function getFirebase() {
	if (getApps().length == 0) {
		const app = initializeApp(config.firebase);
		if (browser && !dev) {
			try {
				initializeAppCheck(app, {
					isTokenAutoRefreshEnabled: true,
					provider: new ReCaptchaV3Provider(config.ReCaptchaV3Provider_siteKey)
				});
			} catch {}
		}
		initializeFirestore(app, { ignoreUndefinedProperties: true });
	}
	return { db: getFirestore(), str: getStorage(), auth: getAuth() };
}
