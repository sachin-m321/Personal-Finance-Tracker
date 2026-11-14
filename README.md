# Personal Finance Tracker

A full-stack Personal Finance Tracker built using React.js, Java, Spring Boot, Spring Data JPA, and Microsoft SQL Server. This application helps users manage their income and expenses, track their available balance, and organize financial transactions through a responsive dashboard.

## Features

### Dashboard
- View available account balance
- Display total income
- Display total expenses
- View total number of transactions
- Responsive dashboard interface

### Transaction Management
- Add new income and expense transactions
- Edit existing transaction details
- Delete transactions
- View all recent transactions
- Store transaction name, amount, type, and category

### Search and Filter
- Search transactions by name
- Filter income transactions
- Filter expense transactions
- View all transactions

### Financial Calculations
- Automatically calculate total income
- Automatically calculate total expenses
- Calculate available balance
- Update financial summaries after adding, editing, or deleting transactions

### Data Management
- Store transaction records in Microsoft SQL Server
- Retrieve transaction data through Spring Boot REST APIs
- Use browser Local Storage as a backup
- Maintain database persistence

## Technology Stack

### Frontend
- **React.js** - User interface development
- **JavaScript** - Application logic
- **HTML5** - Web page structure
- **CSS3** - Styling and responsive design
- **Bootstrap** - UI layout and components

### Backend
- **Java 21** - Programming language
- **Spring Boot 4.1.2** - Backend application development
- **Spring Data JPA** - Database access
- **Hibernate** - ORM implementation
- **REST APIs** - Frontend and backend communication
- **Maven** - Dependency and build management

### Database
- **Microsoft SQL Server 2022** - Database management
- **JDBC** - Database connectivity

### Development Tools
- Visual Studio Code
- IntelliJ IDEA / Eclipse
- SQL Server Management Studio (SSMS)
- Postman

## Project Structure

```text
PersonalFinanceTracker/
│
├── Tracker-app/                       # React Frontend
│   ├── public/
│   ├── src/
│   │   ├── Components/
│   │   │   └── FinanceCharts.jsx
│   │   ├── assets/
│   │   ├── App.jsx                    # Main application
│   │   ├── App.css                    # Dashboard styling
│   │   └── main.jsx                   # React entry point
│   ├── package.json
│   └── index.html
│
├── finance-backend/                   # Spring Boot Backend
│   ├── src/main/java/com/sachin/finance_backend/
│   │   ├── controller/
│   │   │   └── TransactionController.java
│   │   ├── entity/
│   │   │   └── Transaction.java
│   │   ├── repository/
│   │   │   └── TransactionRepository.java
│   │   ├── service/
│   │   │   └── TransactionService.java
│   │   └── FinanceBackendApplication.java
│   │
│   ├── src/main/resources/
│   │   └── application.properties
│   └── pom.xml
│
├── FinanceTable.sql                   # Database setup script
├── .gitignore
└── README.md
```

## Database Setup

1. Install Microsoft SQL Server.
2. Open SQL Server Management Studio.
3. Execute the `FinanceTable.sql` script.
4. The script creates the `PersonalFinanceTrackerDB` database and `Transactions` table.
5. Configure the database connection in the backend's `application.properties` file.

## How to Run the Project

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/Personal-Finance-Tracker.git
```

### 2. Start the Backend

Navigate to the backend directory:

```bash
cd finance-backend
```

Run the Spring Boot application:

```bash
./mvnw spring-boot:run
```

On Windows PowerShell:

```powershell
.\mvnw.cmd spring-boot:run
```

Backend runs at:

```text
http://localhost:8080
```

### 3. Start the Frontend

Open another terminal:

```bash
cd Tracker-app
```

Install dependencies:

```bash
npm install
```

Start the React development server:

```bash
npm run dev
```

Frontend runs at:

```text
http://localhost:5173
```

## REST API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/transactions` | Get all transactions |
| GET | `/api/transactions/{id}` | Get transaction by ID |
| POST | `/api/transactions` | Add transaction |
| PUT | `/api/transactions/{id}` | Update transaction |
| DELETE | `/api/transactions/{id}` | Delete transaction |

## Future Enhancements

- Monthly expense analysis
- Interactive financial charts
- Budget planning and tracking
- Category-wise expense reports
- User authentication
- Export financial reports

## Author

**Sachin M**

Full Stack Development Project

**Technologies:** React.js | Java | Spring Boot | SQL Server
