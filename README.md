# Office Management System API

This is the backend API for the Office Management System. It is built with Node.js, Express, MongoDB, and uses Swagger for API documentation.

## How to run the project

1. **Clone the repository** and navigate to the project directory:
   ```bash
   cd "office Managment"
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   Create a `.env` file in the root directory (if not already present) and populate it with the required variables (see below).

4. **Start the application**:
   - For development (using nodemon):
     ```bash
     npm run dev
     ```
   - For production:
     ```bash
     npm start
     ```

## Environment Variables (.env)

The following environment variables are used in this project:

- `PORT` - The port on which the server will run (e.g., 5000).
- `MONGO_URL` - The MongoDB connection string.
- `JWT_SECRET` - The secret key used for signing JSON Web Tokens for authentication.

## API Routes

The API includes Swagger documentation. Once the server is running, you can access the Swagger UI at:
- **`GET /api-docs`**

Below is a complete list of all the available routes:

### Auth Routes (`/api/auth`)
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get the logged-in user's profile
- `PUT /api/auth/change-password` - Change the user's password

### Employee Routes (`/api/employees`)
- `POST /api/employees/` - Create a new employee (Admin)
- `GET /api/employees/` - Get all employees (Manager/Admin)
- `GET /api/employees/:id` - Get a specific employee by ID
- `PUT /api/employees/:id` - Update an employee (Admin)
- `DELETE /api/employees/:id` - Delete an employee (Admin)

### Department Routes (`/api/departments`)
- `POST /api/departments/create` - Create a new department (Admin)
- `GET /api/departments/getAll` - Get all departments
- `GET /api/departments/getById/:id` - Get a specific department by ID
- `PUT /api/departments/update/:id` - Update a department (Admin)
- `DELETE /api/departments/delete/:id` - Delete a department (Admin)

### Attendance Routes (`/api/attendance`)
- `POST /api/attendance/checkin` - Check-in for attendance (Manager/Admin)
- `POST /api/attendance/checkout/:id` - Check-out for attendance (Manager/Admin)
- `GET /api/attendance/` - Get all attendance records (Manager/Admin)
- `GET /api/attendance/:id` - Get attendance by ID (Manager/Admin)
- `PUT /api/attendance/:id` - Update an attendance record (Admin)

### Leave Request Routes (`/api/leave`)
- `POST /api/leave/` - Apply for a leave (Manager/Admin)
- `GET /api/leave/` - Get all leave requests (Manager/Admin)
- `GET /api/leave/my` - Get own leave requests
- `GET /api/leave/:id` - Get a specific leave request by ID
- `PUT /api/leave/:id/approve` - Approve a leave request (Manager/Admin)
- `PUT /api/leave/:id/reject` - Reject a leave request (Manager/Admin)
- `PUT /api/leave/:id/cancel` - Cancel a leave request (Manager/Admin)

### Announcement Routes (`/api/announcement`)
- `POST /api/announcement/` - Create an announcement (Admin)
- `GET /api/announcement/` - Get all announcements
- `GET /api/announcement/:id` - Get a specific announcement by ID
- `PUT /api/announcement/:id` - Update an announcement (Admin)
- `DELETE /api/announcement/:id` - Delete an announcement (Admin)
