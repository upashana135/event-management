# 🎉 Event Management System (Express.js)

A simple Event Management API built using **Node.js** and **Express.js**, supporting user registration/login, event creation & management, and participant registration.

---

## 📦 Features

- 🔐 **User Authentication** (Register/Login)
- 📅 **Event Management** (CRUD operations)
- 🙋‍♂️ **Participant Registration** (Join or leave events)
- 🛡️ Middleware-based authorization & validation

---

## 🛠️ Tech Stack

- Node.js
- Express.js
- Middleware-based validation
- JWT or custom auth (assumed)

---

## 📁 API Routes

👤 User Routes

Method	Endpoint	Description
POST	/register	Register a new user (uses validateUser middleware)
POST	/login	    Login user and generate token

🗓️ Event Routes

Method	Endpoint	    Description
GET	    /events	        Get all events
POST	/events	        Create a new event (uses validateEvent)
PUT	    /events/:id	    Update an existing event (uses validateEvent)
DELETE	/events/:id	    Delete an event by ID

👥 Participant Routes

Method	Endpoint	                    Description
POST	/participants/events/:id	    Register participant to an event
GET	    /participants/events	        View participant registrations
DELETE	/participants/events/:id	    Unregister from an event

---

## 🧩 Middlewares
validateUser: Validates user details before registration.

validateEvent: Validates event details while creation and update.

validateEventOrganizer: Ensures the user is allowed to manage events.

validateParticipants: Ensures the user is allowed to register for events.

authorization: Verifies JWT or user token.

---

Let me know if you'd like to include example responses, test cases, or setup instructions for a `.env` file.