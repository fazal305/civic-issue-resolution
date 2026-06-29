// Firebase configuration

let firebaseConfig = {
  apiKey: "AIzaSyDofp7tbH0wUAK_t-I7Ff_YngK2fPpxJJg",

  authDomain: "civic-issue-resolution-ee4b3.firebaseapp.com",

  projectId: "civic-issue-resolution-ee4b3",

  storageBucket: "civic-issue-resolution-ee4b3.firebasestorage.app",

  messagingSenderId: "612311604202",

  appId: "1:612311604202:web:88d7875dd89af859907093",
};

//
// Initialize Firebase
//

if (firebase.apps.length === 0) {
  firebase.initializeApp(firebaseConfig);
}

//
// Firestore
//

let firestoreDatabase = firebase.firestore();

let complaintsCollection = firestoreDatabase.collection("complaints");

//
// Firebase Storage (Future)
//

// let storage = firebase.storage();

//
// Debug
//

console.group("🔥 CivicConnect Firebase");

console.log("Firebase Initialized");

console.log("Project ID:", firebase.app().options.projectId);

console.log("Firestore:", firestoreDatabase);

console.groupEnd();
