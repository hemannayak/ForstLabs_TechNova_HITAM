# CivicSense 🏙️🚧

> **CivicSense** is a comprehensive web application designed for citizens in metropolitan cities to report and resolve road-related infrastructure issues. By integrating **AI-powered verification**, **community-driven validation**, and **automated government notifications**, CivicSense bridges the gap between urban residents and city authorities.

---

## 🚀 Key Features

### 🔐 Secure & Anonymized Authentication

* **Firebase Integration:** Robust authentication via email/password.
* **Privacy-First Design:** Only usernames are displayed publicly to ensure an anonymized user experience.
* **Identity Management:** Quick-access user dashboard for profile customization and secure logout.

### 📍 Metropolitan Mapping & Geolocation

* **Dynamic Location Detection:** Auto-detects user coordinates with built-in permission handling.
* **Regional Validation:** Ensures reports are filed within supported metropolitan boundaries.
* **Real-time Interaction:** Live map updates with user-friendly error messages for precise issue localization.

### 🤖 AI-Powered Image Verification

* **Authenticity Analysis:** Uses **TensorFlow.js** and **Sharp** to detect fake, manipulated, or AI-generated images.
* **Metadata Scrubbing:** Analyzes EXIF data, including GPS tags and camera information, to verify the photo's origin.
* **Structural Detection:** Automatically identifies road damage and assesses severity to prioritize high-risk issues.
* **Fraud Prevention:** Automatic rejection of suspicious uploads to maintain data integrity.

### 🗳️ Community Voting & Authority Loop

* **Democratic Validation:** Verified genuine reports trigger a community poll for local residents.
* **Threshold Monitoring:** Once a report reaches a **50% approval threshold**, the system initiates the notification phase.
* **Automated Authority Contact:** Professional HTML reports are automatically emailed to relevant departments, including AI assessments, images, and location data.

---

## 🧩 Technology Stack

| Layer | Technologies |
| --- | --- |
| **Frontend** | React 18 (TypeScript), Vite, Tailwind CSS, React Leaflet (Maps) |
| **Backend** | Node.js, Express |
| **Database/Auth** | Firebase Admin SDK, Firebase Auth |
| **AI & Processing** | TensorFlow.js, Sharp (Image processing), Multer |
| **Communication** | Nodemailer (Automated SMTP reports) |

---

## 📦 Installation & Setup

### Prerequisites

* **Node.js** (v16 or higher)
* **Firebase Project** credentials
* **SMTP Credentials** (e.g., Gmail App Password) for authority emails

### Steps

1. **Clone & Install**
```bash
git clone https://github.com/hemannayak/CivicSense.git
cd CivicSense
npm install

```


2. **Environment Configuration**
Create a `.env` file in the `server/` directory and include:
```env
EMAIL_USER=your-authority-handler@gmail.com
EMAIL_PASS=your-app-password
# Add Firebase Config variables

```


3. **Run Development Environment**
```bash
# Run Frontend
npm run dev

# Run Backend
cd server
npm run dev

```



---

## 🎯 Usage Flow

1. **Report Submission:** User uploads two photos of the road issue from different angles.
2. **AI Verification:** The system analyzes the images for authenticity and damage severity.
3. **Community Consensus:** Valid reports appear on the metropolitan map for community voting.
4. **Action Trigger:** Once the poll hits the required threshold, a comprehensive report is dispatched to the authorities with a timestamped delivery confirmation.

---

## 🚧 Development Roadmap

* **AI Scaling:** Transitioning from mock verification to full **Google Cloud Vision** or **AWS Rekognition** integration.
* **Persistent Storage:** Moving from in-memory buffers to **Firebase Firestore** or **PostgreSQL** for historical data analysis.
* **Regional Expansion:** Scaling the geo-fencing logic to support all major global metropolitan hubs.

---

## 📄 License

This project is licensed under the **MIT License**.

**CivicSense** — Making metropolitan cities better, one report at a time! 🌟

---

Would you like me to help you draft the **AI Image Analysis** logic or a more detailed **System Architecture** diagram for this project?
