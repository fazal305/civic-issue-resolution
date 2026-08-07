// Firebase configuration comes from firebase-config.js (gitignored),
// which must be loaded before this script. See
// assets/js/firebase-config.example.js for the template.

if (typeof firebaseConfig === "undefined") {
  throw new Error(
    "firebaseConfig is not defined. Copy assets/js/firebase-config.example.js " +
      "to assets/js/firebase-config.js and fill in your project values.",
  );
}

// Initialize Firebase

if (firebase.apps.length === 0) {
  firebase.initializeApp(firebaseConfig);
}

// Firebase Services

let firebaseAuth = firebase.auth();

let firestoreDatabase = firebase.firestore();

let firebaseStorage = null;

if (firebase.storage) {
  firebaseStorage = firebase.storage();
}

// Firestore Collection

let complaintsCollection = firestoreDatabase.collection("complaints");
