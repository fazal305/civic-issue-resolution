# Firebase Setup Guide — CivicConnect

CivicConnect uses **Firebase Compat SDK (CDN)** only.

This project does **not** use:

- npm
- React
- Vite
- Webpack
- Build tools
- Backend server

Everything runs entirely in the browser using Firebase services.

---

# Firebase Services

CivicConnect currently uses:

- Firebase App
- Firebase Authentication
- Cloud Firestore

Firebase Storage support has already been prepared but is currently disabled.

---

# Firebase SDK Version

Current version:

```
10.12.2 (Compat)
```

---

# Required CDN Scripts

Pages using Firebase should include the following scripts in this order:

```html
<script src="https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js"></script>

<script src="https://www.gstatic.com/firebasejs/10.12.2/firebase-auth-compat.js"></script>

<script src="https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore-compat.js"></script>

<script src="https://www.gstatic.com/firebasejs/10.12.2/firebase-storage-compat.js"></script>
```

---

# Firebase Configuration

Replace the values inside:

```
assets/js/firebase.js
```

with your own Firebase project configuration.

Example:

```javascript
let firebaseConfig = {
  apiKey: "...",
  authDomain: "...",
  projectId: "...",
  storageBucket: "...",
  messagingSenderId: "...",
  appId: "...",
};
```

---

# Firestore Collections

Current collections:

```
complaints
```

```
users
```

---

# Authentication

Supported authentication method:

- Email / Password

---

# Firestore Security Rules

For development only:

```javascript
rules_version = '2';

service cloud.firestore {

  match /databases/{database}/documents {

    match /{document=**} {

      allow read, write: if request.auth != null;

    }

  }

}
```

These rules should be tightened before production deployment.

---

# Firebase Storage

Firebase Storage is currently disabled.

Reason:

Many new Firebase projects require the Blaze Pay-As-You-Go plan before Storage can be fully used.

Since CivicConnect is intended to remain free for educational and portfolio purposes, image uploads are disabled by default.

The project already includes:

- Upload UI
- Preview system
- Upload helper
- Feature flag

No images are uploaded while the feature is disabled.

---

# Enabling Image Uploads Later

To enable image uploads:

1. Upgrade Firebase to the Blaze plan.
2. Enable Firebase Storage.
3. Publish Storage security rules.
4. Open:

```
assets/js/report-upload.js
```

5. Change:

```javascript
let IMAGE_UPLOADS_ENABLED = false;
```

to:

```javascript
let IMAGE_UPLOADS_ENABLED = true;
```

6. Remove the hidden class from the evidence upload section in:

```
pages/report.html
```

---

# Notes

- Uses Firebase Compat SDK only.
- Uses `.then().catch()` throughout the project.
- No async/await.
- No build step required.
- Simply clone the repository, configure Firebase, and open the project with Live Server.
