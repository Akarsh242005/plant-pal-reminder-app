# PlantPal - Plant Care Reminder App

A beautiful and intuitive web app to help you never forget to water your plants again! 🌱

PlantPal lets you track your plant collection, set custom watering schedules, and get timely reminders so your green friends stay happy and healthy.

## ✨ Features

- **Add & Manage Plants** — Track name, species, location, notes, and custom watering frequency
- **Smart Watering Schedule** — Visual indicators showing when each plant needs water
- **One-Click Watering** — Mark plants as watered with a single tap
- **Beautiful Plant Cards** — Rich visuals with images and details
- **User Authentication** — Secure login and registration (MongoDB backend)
- **Responsive Design** — Works perfectly on mobile and desktop
- **Sample Plants** — Get started quickly with beautiful example plants

## 🛠 Tech Stack

- **Frontend**: React + TypeScript + Vite
- **Styling**: Tailwind CSS + shadcn/ui components
- **Backend**: MongoDB (via direct connection)
- **State Management**: React Context
- **Notifications**: Sonner toast library
- **Icons**: Lucide React

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB running locally (`mongodb://localhost:27017`)

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd plant-pal-reminder-app-main

Install dependenciesBashnpm install
Start the development serverBashnpm run dev
Open http://localhost:8080

Note: Make sure MongoDB is running on your machine before starting the app.
📱 How to Use

Register or Login — Create an account or sign in
Add Your Plants — Click "Add New Plant" and fill in the details
Track Watering — Use the water button when you've watered a plant
Stay on Schedule — Visual cues help you know which plants need attention

📁 Project Structure
textsrc/
├── components/          # Reusable UI components
├── contexts/            # Auth & Plant state management
├── integrations/        # MongoDB connection
├── pages/               # Main app pages (Dashboard, Add Plant, etc.)
├── hooks/               # Custom React hooks
├── types/               # TypeScript interfaces
└── lib/                 # Utilities
🎯 Key Pages

/ — Landing page
/login — User login
/register — User registration
/dashboard — Main plant collection
/add-plant — Add new plant form
/edit-plant/:id — Edit existing plant
/profile — User profile
/settings — App preferences

🌟 Highlights

Clean, modern, plant-friendly UI
Persistent data with MongoDB
Real-time watering status updates
Fully responsive mobile-first design
Built with modern React patterns and TypeScript


Built with ❤️ for plant lovers everywhere.
Never forget to water your plants again!
