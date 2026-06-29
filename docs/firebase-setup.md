# Firebase Setup Guide — CivicConnect

This guide explains how Firebase is used in the CivicConnect project.

CivicConnect uses Firebase through CDN scripts only. No npm, no build tools, and no backend server are required.

---

## 1. Firebase Services Used

Currently used:

- Firebase App
- Firebase Firestore

Planned for later:

- Firebase Authentication
- Firebase Storage
- Firebase Hosting

---

## 2. Current Firebase SDK

The project uses the Firebase Compat SDK.

These scripts are included in the HTML pages that need Firebase:

```html
<script src="https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js"></script>

<script src="https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore-compat.js"></script>
```
