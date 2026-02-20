# HRMS Lite - Human Resource Management System

A lightweight Human Resource Management System (HRMS) built with React, FastAPI, and MongoDB. This application allows HR admins to manage employee records and track daily attendance efficiently.

## 📋 Features

### Core Features
- **Employee Management**
  - Add new employees with unique ID, name, email, and department
  - View all employees in a sortable table
  - Delete employees with cascade delete of attendance records
  - Form validation with error handling

- **Attendance Management**
  - Mark daily attendance (Present/Absent) for employees
  - View attendance history for each employee
  - Filter attendance records by date
  - Prevent duplicate attendance entries

- **Dashboard & Analytics**
  - Total employees count
  - Present today counter
  - Average attendance percentage
  - Top performers leaderboard
  - Visual progress bars for attendance rates

### Bonus Features
- ✅ Filter attendance by date
- ✅ Display total present days per employee
- ✅ Dashboard with summary statistics
- ✅ Loading, error, and empty states
- ✅ Responsive design for mobile devices

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **State Management**: React Context API + TanStack Query
- **Form Handling**: React Hook Form
- **HTTP Client**: Axios
- **Notifications**: React Hot Toast
- **Date Handling**: date-fns

### Backend
- **Framework**: FastAPI (Python)
- **Database**: MongoDB with Motor (async driver)
- **Validation**: Pydantic
- **CORS**: Configured for frontend domains

### DevOps & Deployment
- **Frontend Hosting**: Vercel/Netlify
- **Backend Hosting**: Render/Railway
- **Database**: MongoDB Atlas
- **Version Control**: Git & GitHub

