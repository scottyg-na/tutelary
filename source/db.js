import fbAdmin from 'firebase-admin';
import fbCertificate from '.auth/firebase-certificate.json';
import { initialize as initializeFireorm } from 'fireorm';

fbAdmin.initializeApp({
    credential: fbAdmin.credential.cert(fbCertificate),
    databaseURL: process.env.FIREBASE_DATABASE_URL,
});

export const admin = fbAdmin;
export const firestore = admin.firestore();
export const auth = admin.auth();

firestore.settings({
    timestampInSnapshots: true,
});

initializeFireorm(firestore);