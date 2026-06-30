# Firebase Setup Guide — CivicConnect

CivicConnect uses Firebase through CDN scripts only.

No npm, no React, no build tools, and no backend server are used.

---

## Firebase Services Used

Current services:

- Firebase App
- Firebase Authentication
- Cloud Firestore
- Firebase Storage

---

## Firebase CDN Scripts

Pages that use Firebase should load the required compat scripts.

### Firestore only

```html
<script src="https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js"></script>

<script src="https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore-compat.js"></script>
```
