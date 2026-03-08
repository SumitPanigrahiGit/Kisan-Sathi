# 🌿 KisanSathi - किसान साथी
### Smart Farming Platform for Indian Farmers

A full-stack MERN application providing Indian farmers with crop intelligence, community Q&A, live mandi rates, and transport booking.

---

## 🚀 Quick Setup

### Prerequisites
- **Node.js** v18+ ([nodejs.org](https://nodejs.org))
- **MongoDB** v6+ ([mongodb.com](https://www.mongodb.com/try/download/community)) — running locally on port 27017
- **npm** v8+

---

## 📦 Installation

### Step 1: Clone / Download the project
```bash
cd kisansathi
```

### Step 2: Install Backend Dependencies
```bash
cd backend
npm install
```

### Step 3: Install Frontend Dependencies
```bash
cd ../frontend
npm install
```

### Step 4: Configure Environment
The backend `.env` file is pre-configured for local development:
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/farmerapp
JWT_SECRET=farmerapp_super_secret_key_2024
NODE_ENV=development
```
> ⚠️ Change `JWT_SECRET` to a strong random string in production!

---

## ▶️ Running the App

### Terminal 1 — Start MongoDB
```bash
# On Linux/Mac:
mongod
# Or if installed as service:
sudo systemctl start mongod

# On Windows:
net start MongoDB
```

### Terminal 2 — Start Backend (Port 5000)
```bash
cd backend
npm run dev
# OR: npm start
```

You should see:
```
MongoDB connected successfully
Server running on port 5000
Crop seed data inserted
Mandi rates seed data inserted
```

### Terminal 3 — Start Frontend (Port 3000)
```bash
cd frontend
npm start
```

Frontend opens at: **http://localhost:3000**

---

## 🔑 Test the App

1. Open **http://localhost:3000**
2. Click **Register** — create a free account
3. Explore features: Crops, Community, Mandi Rates, Transport

---

## 🏗️ Project Structure

```
kisansathi/
├── backend/
│   ├── server.js              # Express app + MongoDB connection
│   ├── .env                   # Environment variables
│   ├── middleware/
│   │   └── auth.js            # JWT auth middleware
│   ├── models/
│   │   ├── User.js            # Farmer/Expert/Admin model
│   │   ├── Crop.js            # Crop library model
│   │   ├── Question.js        # Community Q&A model
│   │   ├── MandiRate.js       # Market price model
│   │   └── Transport.js       # Logistics request model
│   └── routes/
│       ├── auth.js            # Register, Login, Profile
│       ├── crops.js           # Crop library + seed data
│       ├── community.js       # Questions & Answers
│       ├── mandi.js           # Market rates + seed data
│       └── transport.js       # Logistics booking
│
└── frontend/
    ├── public/
    │   └── index.html
    └── src/
        ├── App.js             # Routes + Auth wrapper
        ├── App.css            # Global styles
        ├── index.js           # Entry point
        ├── context/
        │   └── AuthContext.js # JWT Auth state
        ├── components/
        │   ├── Navbar.js      # Navigation
        │   └── Footer.js      # Footer
        └── pages/
            ├── Home.js        # Landing page
            ├── Login.js       # Login form
            ├── Register.js    # Registration form
            ├── CropLibrary.js # Browse crops
            ├── CropDetail.js  # Crop detail with tabs
            ├── Community.js   # Q&A forum
            ├── QuestionDetail.js # Question + Answers
            ├── MandiRates.js  # Live mandi prices
            ├── Transport.js   # Logistics booking
            └── Profile.js     # User profile
```

---

## 🌾 Features

| Feature | Details |
|---------|---------|
| **Auth** | JWT-based register/login/logout with bcrypt password hashing |
| **Crop Library** | 8 major crops with soil, irrigation, fertilizer, pest, disease & harvest info |
| **Community Q&A** | Post questions, answer, upvote, mark resolved — expert badges |
| **Mandi Rates** | 500+ market entries across 8 states, top gainers/losers |
| **Transport** | Request pickup form, provider directory, booking management |
| **Multi-language** | User preference for 10 Indian languages |
| **Responsive** | Mobile-first design works on all devices |

---

## 🔌 API Endpoints

### Auth
- `POST /api/auth/register` — Create account
- `POST /api/auth/login` — Get JWT token
- `GET /api/auth/me` — Get current user (protected)
- `PUT /api/auth/profile` — Update profile (protected)

### Crops
- `GET /api/crops` — All crops (with ?category=&season=&search=)
- `GET /api/crops/:id` — Crop details

### Community
- `GET /api/community/questions` — All questions
- `POST /api/community/questions` — Post question (auth)
- `GET /api/community/questions/:id` — Question detail
- `POST /api/community/questions/:id/answers` — Post answer (auth)
- `PUT /api/community/questions/:id/upvote` — Upvote (auth)

### Mandi
- `GET /api/mandi/rates` — Market rates (filterable)
- `GET /api/mandi/states` — List of states
- `GET /api/mandi/commodities` — List of commodities
- `GET /api/mandi/markets?state=` — Markets by state
- `GET /api/mandi/top-movers` — Top gainers & losers

### Transport
- `POST /api/transport/request` — Book transport (auth)
- `GET /api/transport/my-requests` — My bookings (auth)
- `GET /api/transport/providers` — Provider list
- `PUT /api/transport/:id/cancel` — Cancel booking (auth)

---

## 🛠️ Tech Stack

- **Backend:** Node.js, Express.js, MongoDB, Mongoose, JWT, bcryptjs
- **Frontend:** React 18, React Router v6, Axios, React Hot Toast
- **Styling:** Custom CSS with Google Fonts (Baloo 2 + Hind)
- **Design:** Indian farming aesthetic — earth tones, green palette

---

## 🔒 Security Features
- Passwords hashed with bcrypt (salt rounds: 10)
- JWT tokens expire in 30 days
- Protected routes require valid Bearer token
- Input validation on all forms (frontend + backend)
- CORS configured for localhost development

---

*KisanSathi — Jai Jawan, Jai Kisan 🇮🇳*
