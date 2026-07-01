<p align="center">
  <img src="assets/images/logo-horizontal.png" width="320" alt="CivicConnect Logo">
</p>

# CivicConnect – Smart Civic Issue Reporting Platform

CivicConnect is a modern civic-tech web application that enables Pakistani citizens to report municipal issues such as garbage collection, electricity outages, water shortages, gas supply problems, and road damage through a clean, multilingual interface.

Developed as an **Aptech Vision / Grand Finale Project**, CivicConnect focuses on accessibility, responsive design, and practical civic problem solving. Users can generate professional complaint letters, save them to Firebase Firestore, and manage them through an interactive dashboard.

---

# Live Demo

https://fazal305.github.io/civic-issue-resolution/

# GitHub Repository

https://github.com/fazal305/civic-issue-resolution

---

# Features

## Complaint Reporting

- Multi-step reporting wizard
- English, Roman Urdu and Urdu support
- Live character counter
- Inline validation
- Keyboard navigation
- Category auto-selection
- OpenStreetMap location picker
- Professional complaint generation
- Copy complaint
- Firebase Firestore storage

## Complaint Dashboard

- Search and filters
- Pagination
- Status badges
- Delete complaints
- Dynamic complaint details page
- Complaint timeline
- Print and Save as PDF
- OpenStreetMap location link

## User Experience

- Responsive design
- Dark / Light theme
- Scroll reveal animations
- Bootstrap toast notifications
- Mobile-friendly interface

---

# Complaint Categories

- Garbage Collection
- Electricity
- Water Supply
- Gas Supply
- Road Damage

---

# Technologies

- HTML5
- CSS3
- JavaScript (ES6)
- jQuery 3.7.1
- Bootstrap 5.3.3
- Firebase Firestore (Compat SDK)
- Leaflet
- OpenStreetMap

---

# Project Structure

```text
civic-issue-resolution/
├── index.html
├── 404.html
├── assets/
│   ├── css/
│   ├── js/
│   └── images/
├── pages/
│   ├── about.html
│   ├── admin.html
│   ├── complaint-details.html
│   ├── complaints.html
│   ├── contact.html
│   ├── login.html
│   ├── report.html
│   └── signup.html
├── docs/
├── README.md
└── LICENSE
```

---

# Firebase

- Firestore integration
- Complaint storage
- Server timestamps
- Status tracking
- Dynamic complaint details

## Image Upload Note

Image upload UI and code are prepared but intentionally hidden.

Firebase Storage generally requires the Blaze plan for new projects, so uploads are disabled to keep the project free for student demonstrations.

To enable later:

- Upgrade to Firebase Blaze
- Restore upload logic in `assets/js/report-upload.js`
- Remove the hidden class from the upload section in `pages/report.html`

---

# Local Development

```bash
git clone https://github.com/fazal305/civic-issue-resolution.git
cd civic-issue-resolution
```

Open with Live Server or any local web server.

No build tools are required.

---

# Team

- Fazal Abbas
- Sufyan
- Sana

---

# License

Released under the MIT License.

---

# Acknowledgements

- Aptech Learning Pakistan
- Firebase
- Bootstrap
- jQuery
- Google Fonts

---

# Status

**Version 0.9**

- Responsive frontend complete
- Firebase Firestore integration complete
- Complaint reporting wizard complete
- Complaint dashboard complete
- Dynamic complaint details complete
- Authentication implemented
- Admin dashboard implemented
- Image upload prepared (disabled for free plan compatibility)
