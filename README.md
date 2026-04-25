# 🌆 CivicTrack AI

### AI-Powered Smart City Issue Reporting System

---

## 🚀 Overview

CivicLens AI is a smart web-based platform that allows citizens to report civic issues such as potholes, garbage dumping, sewage problems, and broken streetlights using just an image. The system leverages AI to automatically generate issue details like title, description, and priority, making reporting fast, simple, and efficient.

All reports are stored in a centralized database and visualized on a public dashboard and interactive map, ensuring transparency and better urban management.

---

## 💡 Problem Statement

Urban areas face numerous civic issues daily, but existing reporting systems are:

* Slow and manual
* Lack transparency
* Not user-friendly
* Poorly centralized

This leads to delayed resolutions and low citizen engagement.

---

## 🎯 Solution

CivicLens AI simplifies the process by:

* Allowing users to upload an image of the issue
* Automatically generating issue details using AI
* Capturing user location
* Displaying all reports on a public dashboard and map

---

## 🔥 Key Features

* 📸 **Image-Based Reporting**
* 🤖 **AI-Generated Title, Description & Priority**
* 📍 **Automatic Location Detection**
* 🗺️ **Interactive Map with Issue Markers**
* 📊 **Public Dashboard (All Reports Visible)**
* 🌍 **Full Transparency System**

---

## 🧠 How It Works

1. User uploads an image
2. Image is uploaded to ImgBB → URL generated
3. Image URL is sent to AI (Google AI Studio)
4. AI generates:

   * Title
   * Description
   * Priority
5. User location is captured
6. Data is sent to backend
7. Stored in MySQL database
8. Displayed on dashboard and map

---

## 🏗️ System Architecture

Frontend (React)
↓
Backend (Spring Boot)
↓
Database (MySQL)

External Services:

* ImgBB (Image Hosting)
* Google AI Studio (AI Processing)
* Google Maps API (Location & Map)

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
* Helps identify problem areas
* Provides real-time transparency

---

## 🗺️ Map Feature

* Displays issues as markers on map
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

This reduces manual input and speeds up reporting.

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
  "title": "Pothole detected on main road",
  "description": "Large pothole causing traffic disruption",
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
git clone https://github.com/your-repo/civiclens-ai.git
```

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

### 3. Backend Setup

```bash
cd backend
mvn spring-boot:run
```

### 4. Configure Environment Variables

* ImgBB API Key
* Google AI API Key
* Database credentials

---

## 🌍 Impact

* Faster issue reporting
* Increased citizen participation
* Transparent system
* Better city management
* Data-driven insights

---

## ⚠️ Challenges

* AI accuracy
* API latency
* Image handling
* Real-time synchronization

---

## 🔮 Future Scope

* Admin dashboard
* Push notifications
* Improved AI models
* Government integration
* Mobile app expansion

##

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

CivicLens AI aims to bridge the gap between citizens and authorities by making civic issue reporting faster, smarter, and more transparent.

---

**⭐ If you like this project, consider giving it a star!**
