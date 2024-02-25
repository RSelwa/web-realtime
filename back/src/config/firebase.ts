import admin from "firebase-admin"
import firebaseKeys from "../../keys.json"

admin.initializeApp({
  credential: admin.credential.cert(firebaseKeys),
  databaseURL: "https://web-realtime-fdd51.firebaseio.com",
});

export const firestore = admin.firestore();
