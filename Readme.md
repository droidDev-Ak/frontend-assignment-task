# TaskManager – Scalable Web App with Authentication & Dashboard 

TaskManager is a full-stack web application built as part of a Frontend Developer Intern assignment.  
The project demonstrates modern frontend development with React, secure authentication using JWT, and seamless integration with a Node.js backend.

The application allows users to register, log in, and manage tasks through a clean and responsive dashboard.

---

##  Features

### Authentication
- User registration and login
- JWT-based authentication
- Secure password hashing using bcrypt
- Persistent login across page refresh
- Logout functionality

### Dashboard
- Display logged-in user information
- Create, read, update, and delete tasks
- Mark tasks as pending or completed
- Search and filter tasks
- Real-time task statistics (total, pending, completed)

### UI / UX
- Responsive design using Tailwind CSS
- Clean and modern layout
- Form validation with inline error messages
- Custom modals for actions like delete confirmation

---

## 🛠️ Tech Stack

### Frontend
- React.js
- React Router
- Tailwind CSS
- JavaScript (ES6+)

### Backend
- Node.js
- Express.js
- JWT (JSON Web Tokens)
- bcrypt for password hashing

### Database
- MongoDB (Mongoose)

---

##  Authentication Approach

Authentication is implemented using JWT.  
Tokens are securely managed via HTTP-only cookies to ensure better protection against XSS attacks while maintaining persistent login across sessions and page refreshes.

---

##  Project Structure

TASK2/
├── client/ # React frontend
├── server/ # Node.js backend
├── logs.txt # Backend activity logs
├── server_log.png # Screenshot of server logs
├── Scalability.md # Scalability strategy
├── README.md

#  Testing & Verification

The following authentication tests were manually performed:

- User registration redirects correctly
- Login authenticates user successfully
- Session persists after page refresh
- Logout clears authentication and redirects to login

Server activity logs have been included as proof of backend functionality.

---

##  Scalability Considerations

A detailed scalability strategy is documented in `Scalability.md`, covering:
- Caching using Redis
- Load balancing with Nginx
- Database indexing
- Containerization using Docker

---

##  How to Run Locall 


### Backend
```bash
cd server
npm install
npm run dev

## Frontend

cd client
npm install
npm run dev

Author
- Akash