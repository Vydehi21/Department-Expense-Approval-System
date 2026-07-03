# Department Expense Approval System

A finance-domain web application where employees can submit expense claims and a Finance Manager can review, approve, reject, and monitor department-wise monthly budget usage.

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | Java 17, Spring Boot 4.1.0 |
| Frontend | React 19 (Vite) |
| Database | MySQL |
| HTTP Client | Axios |

## Project Structure

```
Department-Expense-Approval-System/
├── DepartmentExpenseApprovalSystem/     # Spring Boot backend
│   └── src/main/java/com/company/expenseapp/
│       ├── controller/                  # REST endpoints
│       ├── service/                     # Business logic
│       ├── repository/                  # JPA repositories
│       ├── entity/                      # DB entities
│       ├── dto/                         # Request/response DTOs
│       └── exception/                   # Custom exceptions + global handler
└── expense-frontend/expense-frontend/   # React frontend
    └── src/
        ├── components/                  # Screens (Claim Submission, Budget Setup, Expense Board, Dashboard)
        ├── constants/                   # Shared dropdown values (departments, categories)
        └── api/                         # Axios API layer
```

## Prerequisites

- Java 17+
- Maven (or use the included `mvnw` wrapper)
- Node.js 18+ and npm
- MySQL Server running locally

## Database Setup

The application auto-creates the database on first run via `createDatabaseIfNotExist=true`, so you only need MySQL running — no manual schema setup required.

1. Make sure MySQL is running on `localhost:3306`.
2. Set your database credentials as environment variables (do **not** hardcode them in `application.properties`):

   ```bash
   # macOS/Linux
   export DB_USERNAME=root
   export DB_PASSWORD=your_mysql_password

   # Windows PowerShell
   $env:DB_USERNAME="root"
   $env:DB_PASSWORD="your_mysql_password"
   ```

3. On startup, Spring Boot/Hibernate will automatically create the `expense_db` database and all required tables (`ddl-auto=update`).

## Running the Backend

```bash
cd DepartmentExpenseApprovalSystem
./mvnw spring-boot:run
```

Backend runs on **http://localhost:8080**.

## Running the Frontend

```bash
cd expense-frontend/expense-frontend
npm install
npm run dev
```

Frontend runs on **http://localhost:5173** (default Vite port).

## User Roles

The system simulates two user types without requiring login (per project scope):

- **Employee** — submits expense claims
- **Finance Manager** — reviews/approves/rejects claims, sets department budgets, views the expense board

Switch roles using the dropdown in the top session bar of the UI.

## Core Features

- **Expense Claim Submission** — employees submit claims with department, category, amount, date, and description. New claims default to `PENDING`.
- **Claim Review** — Finance Manager approves or rejects pending claims with a mandatory review remark.
- **Department Budget Management** — one monthly budget per department per year; duplicates are blocked.
- **Budget Control** — a claim cannot be approved if doing so would exceed the department's remaining monthly budget. Rejected claims never count against budget usage.
- **Expense Tracking** — filter claims by department, month/year, status, and category.
- **Monthly Finance Summary** — per-department dashboard showing budget, approved/pending totals, remaining budget, and claim counts by status.

## API Overview

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/claims` | Submit a new expense claim |
| GET | `/api/claims` | Get claims (supports department/month/year/status/category filters) |
| PUT | `/api/claims/{id}/review` | Approve or reject a pending claim |
| POST | `/api/budgets` | Create a monthly department budget |
| GET | `/api/budgets/summary` | Get monthly finance summary for a department |

## Validation Rules

- Expense amount must be greater than zero
- Department, category, and expense date are required
- Monthly budget amount must be greater than zero
- No duplicate department budget for the same month/year
- Only claims in `PENDING` status can be approved or rejected

## Known Limitations (Out of Scope per SRS)

- No authentication/login system
- No JWT security
- No email notifications, payment gateway, or file uploads
- No charts/graphs or advanced analytics
- Single-branch finance workflow only

## Security Note

Database credentials are read from environment variables (`DB_USERNAME`, `DB_PASSWORD`) and are **not** committed to source control. Set these before running the backend locally.
