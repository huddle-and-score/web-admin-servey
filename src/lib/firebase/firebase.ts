import { getApps, initializeApp } from 'firebase/app';
import config from '../../env';
import { getFirestore, initializeFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

export function getFirebase() {
	if (getApps().length == 0) {
		const app = initializeApp(config.firebase);
		// initializeAppCheck(app, {
		// 	isTokenAutoRefreshEnabled: true,
		// 	provider: new ReCaptchaV3Provider('6Lf06tEhAAAAABStHTgnL7mrrp2dSJLsltlq6QOe')
		// });
		initializeFirestore(app, { ignoreUndefinedProperties: true });
	}
	return { db: getFirestore(), str: getStorage() };
}
