import firebaseAdmin from 'firebase-admin';
import firebaseCertificate from '.auth/firebase-certificate.json';
import { initialize as orm } from 'fireorm';
import DatabaseProvider from "../models/provider";

export default class FirestoreDatabaseProvider extends DatabaseProvider {

    constructor(options) {
        super();

        // Initialize Firebase
        firebaseAdmin.initializeApp({
            credential: firebaseAdmin.credential.cert(firebaseCertificate),
            databaseURL: process.env.FIREBASE_DATABASE_URL,
        });

        this.instance = firebaseAdmin.firestore();
        this.instance.settings({
            timestampInSnapshots: true,
        });

        orm(this.instance);

    }
}