![React](https://img.shields.io/badge/Frontend-React-blue)
![Node](https://img.shields.io/badge/Backend-Node.js-green)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-brightgreen)
![JWT](https://img.shields.io/badge/Auth-JWT-orange)
![Status](https://img.shields.io/badge/Status-Active-success)

# 📚 Assignment Submission System

Assignment Submission System is a full-stack web application designed to streamline the workflow between mentors and students. Mentors can create assignments, while students can view their assigned work and submit answers through a secure, role-based dashboard.

Built with a clean UI and modular architecture, this project demonstrates practical full-stack development using React, Node.js, Express, and MongoDB.

***

## 🚀 Features

- 🔐 User registration and login system
- 👤 Role-based access for mentor and student
- 🧑‍🏫 Mentor dashboard for assignment management
- 📝 Assignment creation for mentors
- 📖 Student dashboard for viewing assigned work
- 📤 Assignment submission form
- 🖱️ Drag and drop file upload
- 📎 File upload support for documents, images, and videos
- ⏰ Deadline validation before submission
- 📋 Submission status flow
- 📊 Grades section on student dashboard
- 💬 Feedback display for reviewed submissions
- 🖼️ Profile update support
- 🔔 Mentor notification on new submission
- 📧 Email integration in the submission flow
- 📁 Clean and modular folder structure
- 📱 Responsive design

***

## 🛠️ Tech Stack

### Frontend
- React.js
- React Router DOM
- CSS

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose

### Other Tools
- JWT Authentication
- bcrypt.js
- REST APIs

***

## 📂 Project Structure

```bash
assignment_submission_system/
│
├── backend/
│   ├── controllers/     # Business logic
│   ├── middleware/      # Auth middleware
│   ├── models/          # MongoDB schemas
│   ├── routes/          # API routes
│   ├── utils/           # Helper functions
│   └── server.js        # Entry point
│
├── frontend/
│   └── src/
│       ├── pages/       # App pages
│       ├── services/    # API calls
│       └── App.js       # Main routing
│
└── package.json
```

***

## ⚙️ Installation & Setup

### 1. Clone the Repository

```bash
git clone [your-repository-url]
cd assignment_submission_system
```

### 2. Setup Backend

```bash
cd backend
npm install
```

Create a `.env` file inside `backend/` and add:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
PORT=5000
```

Run the backend server:

```bash
node server.js
```

### 3. Setup Frontend

```bash
cd frontend
npm install
npm start
```

***

## 🔐 Environment Variables

| Variable | Description |
|---|---|
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret key for JWT authentication |
| `PORT` | Backend server port |

***

## 📸 Live Demo / Screenshots

> Add your live demo link here if the project is deployed.

> Example: [Live Demo](https://your-deployment-link.com)

> Add screenshots of the mentor dashboard, student dashboard, and assignment submission form here.

***

## ✅ Why This Project Matters

- Shows a complete workflow between mentors and students.
- Demonstrates secure authentication and protected routes.
- Proves you can connect frontend and backend APIs in a real product flow.
- Includes real-world features like file upload, deadline checks, grading, and feedback display.
- Makes a strong placement project because it reflects practical full-stack thinking, not just basic CRUD.

***

## 🚧 Future Scope

- 📊 Submission history view for students
- 📈 Analytics dashboard for mentors
- 🔔 Deadline reminder notifications
- 🧾 More detailed grading and review flow
- 🖥️ Live deployment with hosted frontend and backend
- 🧪 Additional validation and testing coverage

***

## 🧠 Key Learning Outcomes

- Built a full-stack application using React and Node.js
- Implemented authentication using JWT and bcrypt
- Designed role-based access for mentors and students
- Built assignment creation and submission workflows
- Managed file uploads and deadline validation
- Structured scalable frontend and backend architecture

***

## 👩‍💻 Author
**Trisha Patil**  
GitHub: [github.com/trisha-patil05](https://github.com/trisha-patil05)  
LinkedIn: [linkedin.com/in/trisha-patil05](https://www.linkedin.com/in/trisha-patil05/)

***

## 🌟 Support

If you found this project helpful, consider giving it a ⭐ on GitHub!
