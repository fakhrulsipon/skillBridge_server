# ⚙️ SkillBridge Backend


The robust API engine powering the SkillBridge marketplace. Built with **Express.js** and **Prisma**, it provides secure authentication, complex booking logic, and comprehensive user management.


## 🔗 Quick Links


- **Frontend GitHub:** []()
- **Backend GitHub:** []()
- **Live Site:** []()
- **Backend API:** [Render](https://skillbridge-server-ya87.onrender.com)




## 🔑 Demo Credentials


| Role | Email | Password |
| :--- | :--- | :--- |
| **Admin** | `admin@example.com` | `admin123`


## 🚀 Key Modules


- **Auth System:** JWT-based authentication with role-based access control (Admin, Tutor, Student).
- **Booking Engine:** Handles session scheduling, status updates, and prevents double-booking.
- **Tutor Profiles:** Manages tutor metadata, pricing, and category relationships.
- **Review System:** Allows students to post verified ratings for completed sessions.
- **Admin API:** Specialized endpoints for platform-wide user and booking oversight.


---


## 🛠️ Tech Stack


- **Runtime:** [Node.js](https://nodejs.org/)
- **Framework:** [Express.js](https://expressjs.com/)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Database:** [PostgreSQL](https://www.postgresql.org/)
- **ORM:** [Prisma](https://www.prisma.io/)
- **Validation:** [Zod](https://zod.dev/)


---


## 🏗️ Architecture


The project follows a modular architecture:
- **Routes:** Defines API endpoints.
- **Controllers:** Handles request logic.
- **Services:** Contains business logic and database interactions.
- **Middlewares:** Global error handling, authentication, and route protection.


---


## 🚀 Getting Started


### 1. Installation
```bash
git clone
cd skill-bridge
npm install
```


### 2. Database Setup
Ensure you have a PostgreSQL instance running, then configure your `.env`:
```env
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/skillbridge_server?schema=public"
JWT_SECRET="your_secret_key"
PORT=5000
```


### 3. Migrations & Seeding
```bash
# Run migrations
npx prisma migrate dev


# Seed initial data (Admin & Categories)
npm run seed
```


### 4. Run Server
```bash
# Development mode
npm run dev


# Build and start
npm run build
npm start
```


---


## 🛡️ Error Handling
The backend implements a **Centralized Error Handling** system:
- **Global Error Filter:** Catches all unhandled exceptions and returns structured JSON responses.
- **Zod Validation:** Ensures all incoming data meets strict schema requirements before processing.


---


## 📄 License
This project is licensed under the MIT License.
