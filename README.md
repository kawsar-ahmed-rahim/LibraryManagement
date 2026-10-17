# 📚 Library Management System

A full-stack Library Management System with separate **Admin** and **Student** interfaces. Admins can issue books, track returns, manage fines, and export records, while students can manage their profile and track the status of their books.

---

## 🚀 Features

### 👨‍💼 Admin Panel

* 🔐 Secure admin login and logout
* 📊 Dashboard overview
* 🔍 Search a student by **roll number** and issue books to them
* 📖 Issue history with search
* ✅ Mark books as returned
* 💰 Clear a student's fine
* 📤 Export records as a **CSV** file
* ⚙️ Fine settings page to edit the fine amount

### 🎓 Student Panel

* 📝 Create a profile and log in
* ✏️ Edit profile page
* 📊 Dashboard
* 📚 Books page with **search and filter** for issued books
* 🏷️ View book status (issued / returned / overdue)
* 🚪 Logout

### ⚠️ Fine System

* A **fixed fine** is charged automatically if a student fails to return a book by the due date.
* Admins can change the fine amount from the Fine Settings page.

---

## 🛠️ Built With

* [Frontend: e.g. React, Vite, CSS / Tailwind]
* [Backend: e.g. Node.js, Express.js]
* [Database: e.g. MongoDB]
* [Authentication: e.g. JWT]

---

## 📂 Project Structure

```text
Library-Management-System/
│
├── client/                 # Frontend
│   └── src/
│       ├── context/        # LibraryContext.jsx
│       ├── pages/
│       └── components/
│
├── server/                 # Backend
│   ├── controllers/        # bookController.js
│   ├── middleware/         # authMiddleware.js
│   ├── routes/             # bookRoutes.js
│   ├── models/
│   └── server.js
│
└── README.md
```

---

## ⚙️ How It Works

1. A student creates a profile and logs in.
2. The admin searches the student by roll number and issues books.
3. Each issue is recorded with an issue date and a due date.
4. Students can view their books and statuses on their Books page.
5. If a book isn't returned by the due date, a fixed fine is applied.
6. The admin marks the book as returned and can clear the fine once it's paid.
7. The admin can search the history and export it as a CSV file.

---

## 🔌 API Endpoints (Books)

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/books/fine-settings` | Authenticated | Get fine settings |
| PUT | `/api/books/fine-settings` | Admin | Update fine settings |
| GET | `/api/books/issues` | Admin | Get all issues |
| GET | `/api/books/issues/student` | Student | Get the logged-in student's issues |
| POST | `/api/books/issue-manual` | Admin | Issue books to a student |
| PUT | `/api/books/issues/:id/return` | Admin | Mark a book as returned |
| PUT | `/api/books/issues/:id/fine` | Admin | Apply a fine |
| PUT | `/api/books/issues/:id/clear-fine` | Admin | Clear a fine |

---

## 🔑 Setup & Installation

```bash
# Clone the repository
git clone [your-repo-url]
cd Library-Management-System

# Backend
cd backend
npm install
npm start

# Frontend
cd frontend
npm install
npm run dev
```

Create a `.env` file in `server/`:

```env
PORT=5000
[DATABASE_URL=...]
[JWT_SECRET=...]
```
---

## 📚 What I Learned

* Building a full-stack app with separate admin and student roles
* Role-based access control with authentication middleware
* Designing REST APIs with Express
* Managing global state with React Context
* [Add more]

---

## 🔮 Future Improvements

* 📧 Email reminders before the due date
* 💳 Online fine payment
* 📚 Add, edit, and delete books from the admin panel
* 📱 Improved mobile responsiveness

---

## 🔗 Live Demo

👉 

---

## 👨‍💻 Author

**Rahim**

If you found this project helpful or interesting, feel free to ⭐ the repository and share your feedback. Contributions, suggestions, and improvements are always welcome!
