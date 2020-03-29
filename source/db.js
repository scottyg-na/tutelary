import fbAdmin from 'firebase-admin';
import fbCertificate from '.auth/firebase-certificate.json';
// import fbFunctions from 'firebase-functions';

fbAdmin.initializeApp({
    credential: fbAdmin.credential.cert(fbCertificate),
    databaseURL: process.env.FIREBASE_DATABASE_URL,
});

export const admin = fbAdmin;
export const firestore = admin.firestore();
export const auth = admin.auth();
// export const functions = fbFunctions;