# Full Stack Task Manager

A simple full-stack task management application built with Vue.js, Express.js, and MongoDB.

## Features

* User registration and login
* JWT authentication
* Password reset via email
* Avatar upload
* Create tasks
* Update tasks
* Delete tasks
* View personal tasks

## Tech Stack

### Frontend

* Vue 3
* Vite
* Pinia
* Axios
* Bootstrap

### Backend

* Express.js
* MongoDB
* Mongoose
* JWT
* Multer
* Nodemailer

## Installation

### Backend

```bash
cd Backend
npm install
npm run dev
```

### Frontend

```bash
cd Frontend
npm install
npm run dev
```

## Environment Variables

Create a `.env` file in the Backend directory:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
EMAIL_USER=your_email
EMAIL_PASS=your_email_password
```

## Project Structure

```text
├── Frontend
└── Backend
```

## Author

Mustafa Kullab
