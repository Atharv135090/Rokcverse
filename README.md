# 🌆 CivicTrack AI

### AI-Powered Smart City Issue Reporting System

---

## 🚀 Overview

CivicLens AI is an intelligent web platform that enables citizens to report civic issues such as potholes, garbage dumping, sewage problems, and broken streetlights using **just an image**.

The system leverages AI to automatically generate issue details (title, description, and priority), reducing manual effort and enabling faster reporting. All reports are stored in a centralized database and visualized on a public dashboard and interactive map.

---

## 💡 Problem Statement

Urban civic issues are often:

* Reported manually and inefficiently
* Lacking transparency in resolution
* Scattered across multiple systems
* Ignored due to low citizen engagement

---

## 🎯 Our Solution

CivicLens AI simplifies civic reporting by:

* Allowing **image-only reporting**
* Using AI to **auto-generate issue details**
* Automatically capturing **user location**
* Providing a **public dashboard + map for transparency**

---

## 🔥 Key Features

* 📸 Image-based issue reporting
* 🤖 AI-generated title, description, and priority
* 📍 Automatic GPS location detection
* 🗺️ Interactive map with issue markers
* 📊 Public dashboard showing all reports
* 🌍 Transparent and accessible system

---

## 🧠 How It Works

1. User uploads an image
2. Image is uploaded to ImgBB → URL generated
3. Image URL is sent to Google AI Studio
4. AI generates:

   * Title
   * Description
   * Priority (Low / Medium / High)
5. User location is captured
6. Data is sent to backend
7. Stored in MySQL database
8. Displayed on dashboard and map

---

## 🏗️ System Architecture

```
Frontend (React)
       ↓
Backend (Spring Boot)
       ↓
Database (MySQL)
```

### External Services:

* ImgBB → Image hosting
* Google AI Studio → AI processing
* Google Maps API → Map & location

---

## 🧰 Tech Stack

### Frontend

* React.js
* Tailwind CSS

### Backend

* Spring Boot

### Database

* MySQL

### APIs & Services

* ImgBB API
* Google AI Studio
* Google Maps API

---

## 📊 Dashboard

* Displays all reported issues
* Shows priority levels
* Highlights problem areas
* Provides city-wide transparency

---

## 🗺️ Map Feature

* Displays issues as markers
* Click marker to view:

  * Image
  * Title
  * Description
  * Priority

---

## 🤖 AI Integration

* Input: Image
* Output:

  * Title
  * Description
  * Priority

👉 Eliminates manual form filling

---

## 📦 API Endpoints

### POST /report

Create a new issue

### GET /issues

Fetch all issues

### GET /issues/{id}

Fetch a specific issue

---

## 📸 Sample Data

```json
{
  "title": "Large pothole on main road",
  "description": "A deep pothole causing traffic disruptions",
  "priority": "High",
  "imageUrl": "https://imgbb.com/...",
  "lat": 19.99,
  "lng": 73.78
}
```

---

## ⚙️ Setup Instructions

### 1. Clone Repository

```bash
git clone https://github.com/Atharv135090/Rokcverse.git
```

---

### 2. Frontend Setup

```bash
cd frontend
npm install
npm start
```

---

### 3. Backend Setup

```bash
cd backend
mvn spring-boot:run
```

---

### 4. Environment Variables

Configure:

* ImgBB API Key
* Google AI API Key
* MySQL Database credentials

---

## 🌍 Impact

* Faster issue reporting
* Increased citizen participation
* Transparent governance
* Better urban planning
* Data-driven insights

---

## ⚠️ Challenges

* AI accuracy
* API latency
* Image upload dependency
* Real-time synchronization

---

## 🔮 Future Scope

* Admin panel for authorities
* Push notifications
* AI accuracy improvements
* Government API integration
* Mobile application

---

## 👥 Team

* [Your Name]
* [Teammate Name 1]
* [Teammate Name 2]
* [Teammate Name 3]

---

## 🏆 Hackathon

Rockverse Hackathon 2026

---

## 🙌 Acknowledgements

* Google AI Studio
* ImgBB
* Open-source community

---

## 📌 Final Note

CivicLens AI aims to make cities smarter by enabling fast, intelligent, and transparent civic issue reporting.

---

**⭐ Star this repo if you like the project!**
