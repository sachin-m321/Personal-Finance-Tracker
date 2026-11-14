

IF DB_ID('PersonalFinanceTrackerDB') IS NULL
BEGIN
    CREATE DATABASE PersonalFinanceTrackerDB;
END;
GO

-- 2. Select the database
USE PersonalFinanceTrackerDB;
GO

-- 3. Create Transactions table if it does not exist
IF OBJECT_ID('dbo.Transactions', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.Transactions
    (
        id BIGINT IDENTITY(1,1) PRIMARY KEY,
        name VARCHAR(150) NOT NULL,
        amount DECIMAL(12,2) NOT NULL,
        type VARCHAR(20) NOT NULL,
        category VARCHAR(50) NOT NULL,
        transaction_date DATETIME2 NOT NULL
            CONSTRAINT DF_Transactions_Date
            DEFAULT SYSDATETIME(),

        CONSTRAINT CK_Transactions_Amount
            CHECK (amount > 0),

        CONSTRAINT CK_Transactions_Type
            CHECK (type IN ('income', 'expense'))
    );
END;
GO

-- 4. Insert sample records only when the table is empty
IF NOT EXISTS (SELECT 1 FROM dbo.Transactions)
BEGIN
    INSERT INTO dbo.Transactions
        (name, amount, type, category)
    VALUES
        ('Monthly Salary', 28000.00, 'income', 'Salary'),
        ('Grocery Shopping', 1250.00, 'expense', 'Food'),
        ('Travel', 350.00, 'expense', 'Transport'),
        ('Internet Bill', 799.00, 'expense', 'Bills');
END;
GO

-- 5. Display all transactions
SELECT *
FROM dbo.Transactions
ORDER BY transaction_date DESC, id DESC;
GO

-- 6. Calculate total income
SELECT COALESCE(SUM(amount), 0) AS TotalIncome
FROM dbo.Transactions
WHERE type = 'income';
GO

-- 7. Calculate total expenses
SELECT COALESCE(SUM(amount), 0) AS TotalExpenses
FROM dbo.Transactions
WHERE type = 'expense';
GO

-- 8. Calculate current balance
SELECT
    COALESCE(SUM(
        CASE
            WHEN type = 'income' THEN amount
            WHEN type = 'expense' THEN -amount
            ELSE 0
        END
    ), 0) AS CurrentBalance
FROM dbo.Transactions;
GO

-- 9. Calculate totals by category
SELECT
    category,
    type,
    SUM(amount) AS TotalAmount
FROM dbo.Transactions
GROUP BY category, type
ORDER BY category, type;
GO

-- 10. Display monthly income and expenses
SELECT
    YEAR(transaction_date) AS TransactionYear,
    MONTH(transaction_date) AS TransactionMonth,
    SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END)
        AS TotalIncome,
    SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END)
        AS TotalExpenses
FROM dbo.Transactions
GROUP BY YEAR(transaction_date), MONTH(transaction_date)
ORDER BY TransactionYear, TransactionMonth;
GO