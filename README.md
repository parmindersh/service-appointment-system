# 🗓️ Service Appointment Booking System

A simple appointment booking system built while learning **Node.js, Express, MongoDB, Mongoose and EJS**.

The main idea of this project is to allow customers to book appointments with service providers while making sure that the same provider cannot be booked for the same date and time.

This project started as a CRUD project, but I also added things like **appointment status management, available time-slot checking, MongoDB indexes and cancellation handling** to make it more realistic.

---

## ✨ Features

* 📅 Book an appointment with a service provider
* 👤 Store customer information
* 🧑‍💼 Manage service providers
* 🕐 Check available time slots for a provider
* 🚫 Prevent double booking for the same provider, date and time
* 🔄 Update appointment status
* ❌ Cancel appointments
* 📝 Store cancellation reasons
* 🔗 Use Mongoose `populate()` to connect appointments with providers
* 🗄️ MongoDB database integration
* 📊 Server-side rendering using EJS
* 🌐 REST-style routes using Express

---

## 🔄 Appointment Status Flow

Appointments follow a fixed status flow instead of allowing random status changes.

```text
PENDING
   ↓
CONFIRMED
   ↓
IN_PROGRESS
   ↓
COMPLETED
```

An appointment can also be cancelled from an active state:

```text
PENDING ──────→ CANCELLED
CONFIRMED ────→ CANCELLED
IN_PROGRESS ──→ CANCELLED
```

Once an appointment is:

* `COMPLETED` → it cannot be cancelled
* `CANCELLED` → it cannot be changed again

This was one of the parts of the project where I learned how business rules can be handled in the backend instead of just relying on the frontend.

---

## 🧠 How Double Booking Is Prevented

One of the main things I wanted to solve was this problem:

> What happens if two people try to book the same provider at the same time?

The appointment collection uses a **compound unique index** on:

```text
providerId + date + time
```

Cancelled appointments are excluded from this restriction using a MongoDB **partial index**.

```js
appointmentSchema.index(
  { providerId: 1, date: 1, time: 1 },
  {
    unique: true,
    partialFilterExpression: {
      status: { $ne: "CANCELLED" }
    }
  }
);
```

So if a provider is already booked for a particular date and time, MongoDB rejects another booking for the same combination.

The backend catches MongoDB's duplicate-key error (`11000`) and returns a conflict message to the user.

---

## 🕐 Available Time Slots

The system currently has predefined appointment slots:

```text
09:00
10:00
11:00
12:00
14:00
15:00
16:00
17:00
```

When a date and provider are selected, the backend checks existing appointments and removes the already booked times.

For example:

```text
All Slots:
09:00  10:00  11:00  12:00  14:00  15:00

Booked:
10:00  14:00

Available:
09:00  11:00  12:00  15:00
```

This logic is handled on the server and returned as JSON.

---

## 🛠️ Tech Stack

| Technology                  | Used For                             |
| --------------------------- | ------------------------------------ |
| **Node.js**                 | Backend runtime                      |
| **Express.js**              | Server and routing                   |
| **MongoDB**                 | Database                             |
| **Mongoose**                | MongoDB ODM                          |
| **EJS**                     | Server-side rendered pages           |
| **method-override**         | PATCH and DELETE requests from forms |
| **dotenv**                  | Environment variables                |
| **HTML / CSS / JavaScript** | Frontend                             |

---

## 📂 Project Structure

```text
service-appointment-system/
│
├── public/
│   └── styles.css
│
├── src/
│   ├── config/
│   │   └── db.js
│   │
│   ├── controllers/
│   │   └── appointmentController.js
│   │
│   ├── models/
│   │   ├── appointment.js
│   │   └── provider.js
│   │
│   └── routes/
│       └── appointmentRoutes.js
│
├── views/
│   ├── book.ejs
│   ├── index.ejs
│   └── partials/
│
├── .gitignore
├── app.js
├── server.js
├── init.js
├── package.json
└── package-lock.json
```

---

## 🌐 Main Routes

| Method   | Route                           | Purpose                   |
| -------- | ------------------------------- | ------------------------- |
| `GET`    | `/`                             | View all appointments     |
| `GET`    | `/book`                         | Open booking form         |
| `POST`   | `/appointments`                 | Create appointment        |
| `PATCH`  | `/appointments/:id/status`      | Update appointment status |
| `DELETE` | `/appointments/:id`             | Cancel appointment        |
| `GET`    | `/providers/:id/availableSlots` | Get available slots       |

---

## 🗄️ Database Models

### Provider

A provider contains information such as:

```text
name
service
isActive
```

### Appointment

An appointment contains:

```text
providerId
customerName
customerPhone
serviceType
date
time
status
cancellationReason
createdAt
updatedAt
```

The appointment is connected to the provider using a Mongoose reference:

```js
providerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Provider"
}
```

This allows provider information to be populated when retrieving appointments.

---

## ⚙️ Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/parmindersh/service-appointment-system.git
```

### 2. Go into the project

```bash
cd service-appointment-system
```

### 3. Install dependencies

```bash
npm install
```

### 4. Create a `.env` file

Create a file named:

```text
.env
```

Add your MongoDB connection string:

```env
MONGO_URL=your_mongodb_connection_string
```

### 5. Start the project

```bash
npm start
```

The server will run on:

```text
http://localhost:3000
```

---

## 🔐 Environment Variables

The project uses an environment variable for the MongoDB connection.

```env
MONGO_URL=your_mongodb_connection_string
```

**Don't upload your `.env` file to GitHub.**

---

## 📸 Screenshots

### 🏠 Appointment Dashboard

Add a screenshot of your main appointment page here.

```md
![Appointment Dashboard](screenshots/dashboard.png)
```

### 📅 Booking Page

Add a screenshot of your booking form here.

```md
![Booking Page](screenshots/booking.png)
```

### 🔄 Appointment Status

Add a screenshot showing the appointment status controls.

```md
![Appointment Status](screenshots/status.png)
```

> You can create a `screenshots` folder in the project and put your screenshots there.

---

## 🧠 What I Learned

This project helped me understand how a backend application actually works beyond just creating routes.

Some of the things I learned while building this project:

* How Express routes connect with controllers
* How to structure a Node.js project
* How MongoDB works with Mongoose
* Creating and using Mongoose schemas
* Using references between MongoDB collections
* Using `populate()` to get related documents
* Handling CRUD operations
* Using `PATCH` and `DELETE` routes
* Using `method-override` with HTML forms
* Working with environment variables
* Checking available appointment slots
* Handling duplicate database entries
* Creating MongoDB compound indexes
* Using partial indexes
* Handling appointment status transitions
* Handling errors on the backend
* Rendering dynamic pages using EJS

---

## 🚧 Things I Want to Improve

This is still a learning project, so there are several things I would like to add later:

* 🔐 User authentication and login
* 👨‍💼 Separate admin/provider accounts
* 📱 Better mobile responsive design
* 📧 Email appointment confirmations
* 🔔 Appointment reminders
* 📆 Calendar-based appointment view
* 🔎 Search and filter appointments
* ✏️ Rescheduling appointments
* 📊 Admin dashboard with statistics
* 🧪 Automated tests
* ☁️ Deployment
* 🎨 Improve the overall UI

---

## 🚀 Future Goal

I want to keep improving this project as I learn more backend development.

Some possible future features are:

```text
Authentication
      ↓
Role-based access
      ↓
Better appointment management
      ↓
Notifications
      ↓
Admin dashboard
      ↓
Deployment
```

---

## 👨‍💻 About This Project

This is a **learning project** that I built to practice backend development with the Node.js ecosystem.

I wanted to go beyond a basic CRUD application and understand how real applications handle things like:

* data relationships
* booking conflicts
* business rules
* database constraints
* status management
* error handling

I'm still learning, so this project will probably change as I learn new things.

---

## 📌 Project Status

🟢 **Currently working on**

The basic appointment booking and management functionality is implemented.

More features and improvements will be added as I continue learning.

---

## 🔗 Repository

**GitHub:**
https://github.com/parmindersh/service-appointment-system

---

## ⭐ If You Like It

If you found this project interesting, feel free to ⭐ the repository.

Thanks for checking out my project! 🙂
