<p align="center">

<img src="assets/images/logo-horizontal.png" width="320">

</p>
# CivicConnect – Smart Civic Issue Reporting Platform

A modern civic-tech web application that enables Pakistani citizens to report municipal issues such as garbage collection, electricity outages, water shortages, gas supply problems, and road damage through an intuitive multilingual interface.

CivicConnect is being developed as an **Aptech Vision / Grand Finale Project** with a focus on accessibility, responsive design, and real-world civic problem solving. The platform allows users to generate structured complaints, store them in Firebase Firestore, and manage them through an interactive dashboard.

---

# Live Demo

https://fazal305.github.io/civic-issue-resolution/

---

# GitHub Repository

https://github.com/fazal305/civic-issue-resolution

---

# Project Objectives

The primary goal of CivicConnect is to simplify civic issue reporting for citizens by providing a modern, user-friendly reporting platform.

The project aims to:

- Report municipal issues online
- Support English, Roman Urdu, and Urdu
- Generate professionally formatted complaint letters
- Store complaints securely in Firebase Firestore
- Allow citizens to track complaint status
- Provide an intuitive dashboard with search and filtering
- Build a scalable foundation for future authentication and administration

---

# Current Features

## Complaint Reporting Wizard

- Multi-step reporting wizard
- Progress indicator
- Inline validation
- Live character counter
- Keyboard navigation
- Responsive design
- Auto category selection
- Complaint preview

## Complaint Dashboard

- Firebase Firestore integration
- Search complaints
- Category filtering
- Status filtering
- Language filtering
- Date filtering
- Quick filter chips
- Pagination
- Empty state
- Skeleton loading
- Status badges
- Complaint preview
- View full complaint
- Delete complaint

## User Experience

- Dark / Light theme
- Responsive layout
- Scroll reveal animations
- Bootstrap toast notifications
- Accessible keyboard navigation
- Mobile-friendly interface
- Modern civic-tech design

---

# Complaint Categories

- Garbage Collection
- Electricity
- Water Supply
- Gas Supply
- Road Damage

---

# Languages Supported

- English
- Roman Urdu
- Urdu

---

# Technologies Used

## Frontend

- HTML5
- CSS3
- JavaScript (ES6)
- jQuery 3.7.1
- Bootstrap 5.3.3

## Backend

- Firebase Firestore
- Firebase Compat SDK (CDN)

## Fonts

- Google Fonts
- Outfit

---

# Project Structure

```text
civic-issue-resolution/

│
├── index.html
│
├── assets/
│   ├── css/
│   │   └── style.css
│   │
│   ├── js/
│   │   ├── complaints.js
│   │   ├── firebase.js
│   │   ├── main.js
│   │   ├── report.js
│   │   └── ui.js
│   │
│   └── images/
│
├── pages/
│   ├── about.html
│   ├── admin.html
│   ├── complaints.html
│   ├── contact.html
│   ├── garbage-details.html
│   ├── report.html
│   ├── road-details.html
│   └── water-details.html
│
├── docs/
│   ├── firebase-setup.md
│   └── roadmap.md
│
├── .gitignore
└── README.md
```

---

# Firebase

The project uses Firebase Firestore for cloud data storage.

Current implementation:

- Save complaints
- Load complaints
- Delete complaints
- Status tracking
- Timestamp support

---

# Planned Features

The project roadmap includes:

- Animated wizard progress bar
- Complaint detail page
- Admin dashboard
- Firebase Authentication
- Citizen login
- Admin login
- Protected routes
- Leaflet + OpenStreetMap integration
- Image uploads
- Firebase Storage
- Real-time Firestore listeners
- Push notifications
- PDF export
- Print support
- Offline support
- Progressive Web App (PWA)
- Production security rules
- Performance optimization

## Image Upload Note

The project includes prepared UI and JavaScript structure for complaint evidence image uploads.

However, Firebase Storage requires the Blaze pay-as-you-go plan for new Firebase projects. To keep the project free for student/demo use, image uploads are currently hidden and disabled.

The feature can be enabled later by:

- Upgrading the Firebase project to Blaze
- Removing `d-none` from the evidence upload section in `report.html`
- Restoring Firebase Storage upload logic in `assets/js/report-upload.js`

---

# Team Members

- Sufyan
- Fazal Abbas
- Sana

---

# Local Development

Clone the repository:

```bash
git clone <repository-url>
```

Open the project folder:

```text
civic-issue-resolution
```

Open `index.html` using your preferred browser or Live Server.

No build tools or package managers are required.

---

# Browser Support

- Google Chrome
- Microsoft Edge
- Mozilla Firefox
- Brave

---

# License

This project was developed for educational purposes as part of the Aptech Vision Project and Grand Finale Exhibition.

---

# Acknowledgements

Special thanks to:

- Aptech Learning Pakistan
- Firebase
- Bootstrap
- Google Fonts
- jQuery

for providing the technologies used in this project.

---

## Grand Finale Vision

This project is being prepared for presentation in the Aptech Grand Finale exhibition as a civic technology solution focused on improving communication between citizens and public service departments in Pakistan.

---

## Status

Phase 1 — Frontend Development In Progress
