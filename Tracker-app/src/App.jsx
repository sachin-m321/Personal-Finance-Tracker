
import { useEffect, useState } from "react";
import FinanceCharts from "./Components/FinanceCharts.jsx";

const API_URL = "http://localhost:8080/api/transactions";

const sampleTransactions = [
  { id: 1, name: "Monthly Salary", amount: 28000, type: "income", category: "Salary" },
  { id: 2, name: "Grocery Shopping", amount: 1250, type: "expense", category: "Food" },
  { id: 3, name: "Travel", amount: 350, type: "expense", category: "Transport" },
  { id: 4, name: "Internet Bill", amount: 799, type: "expense", category: "Bills" }
];

export default function App() {
  const [transactions, setTransactions] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("financeTransactions")) || sampleTransactions;
    } catch {
      return sampleTransactions;
    }
  });

  const [loaded, setLoaded] = useState(false);
  const [message, setMessage] = useState("");

  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("expense");
  const [category, setCategory] = useState("Food");

  const [editingId, setEditingId] = useState(null);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const categories = ["Food", "Transport", "Bills", "Shopping", "Other"];

  // Fetch transactions from SQL Server
  useEffect(() => {
    async function fetchTransactions() {
      try {
        const response = await fetch(API_URL);

        if (!response.ok) {
          throw new Error("Unable to fetch transactions");
        }

        const data = await response.json();
        setTransactions(data);
        setMessage("");
      } catch (error) {
        console.error(error);
        setMessage("Backend unavailable. Showing locally saved transactions.");
      } finally {
        setLoaded(true);
      }
    }

    fetchTransactions();
  }, []);

  // Local Storage backup
  useEffect(() => {
    if (loaded) {
      localStorage.setItem("financeTransactions", JSON.stringify(transactions));
    }
  }, [transactions, loaded]);

  const income = transactions
    .filter((item) => item.type === "income")
    .reduce((sum, item) => sum + Number(item.amount), 0);

  const expenses = transactions
    .filter((item) => item.type === "expense")
    .reduce((sum, item) => sum + Number(item.amount), 0);

  const balance = income - expenses;

  function money(value) {
    return value.toLocaleString("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0
    });
  }

  // Reset form
  function resetForm() {
    setName("");
    setAmount("");
    setType("expense");
    setCategory("Food");
    setEditingId(null);
  }

  // Load existing transaction into form
  function startEdit(item) {
    setName(item.name);
    setAmount(String(item.amount));
    setType(item.type);
    setCategory(item.category);
    setEditingId(item.id);
    setMessage("");
  }

  // Add or Update transaction
  async function addTransaction(event) {
    event.preventDefault();

    if (
      !name.trim() ||
      !Number.isFinite(Number(amount)) ||
      Number(amount) <= 0
    ) {
      return;
    }

    const transactionData = {
      name: name.trim(),
      amount: Number(amount),
      type,
      category: type === "income" ? "Salary" : category,
      transactionDate: new Date().toISOString().slice(0, 19)
    };

    try {
      const isEditing = editingId !== null;

      const response = await fetch(
        isEditing ? `${API_URL}/${editingId}` : API_URL,
        {
          method: isEditing ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(transactionData)
        }
      );

      if (!response.ok) {
        throw new Error("Unable to save transaction");
      }

      const savedTransaction = await response.json();

      if (isEditing) {
        setTransactions((previous) =>
          previous.map((item) =>
            item.id === editingId ? savedTransaction : item
          )
        );

        setMessage("Transaction updated successfully!");
      } else {
        setTransactions((previous) => [
          savedTransaction,
          ...previous
        ]);

        setMessage("Transaction added successfully!");
      }

      resetForm();

    } catch (error) {
      console.error(error);
      setMessage("Could not save transaction. Please check your backend.");
    }
  }

  // Delete transaction
  async function deleteTransaction(id) {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE"
      });

      if (!response.ok) {
        throw new Error("Unable to delete transaction");
      }

      setTransactions((previous) =>
        previous.filter((item) => item.id !== id)
      );

      if (editingId === id) {
        resetForm();
      }

      setMessage("Transaction deleted successfully!");

    } catch (error) {
      console.error(error);
      setMessage("Could not delete transaction. Please check your backend.");
    }
  }

  const filteredTransactions = transactions.filter((item) => {
    const matchesName = item.name.toLowerCase().includes(search.toLowerCase());
    const matchesType = filter === "all" || item.type === filter;

    return matchesName && matchesType;
  });

  return (
    <main className="container-fluid finance-page">

      <header className="page-header">
        <div>
          <h1>Personal Finance Tracker</h1>
          <p>Manage your income and expenses in one place.</p>
        </div>
        <span className="dashboard-label">My Dashboard</span>
      </header>

      {message && <p role="status">{message}</p>}


      <section className="balance-card">
        <div className="balance-info">
          <p>Available Balance</p>
          <h2>{money(balance)}</h2>
          <span>Income minus expenses</span>
        </div>

        <div className="balance-illustration">
          <svg
            viewBox="0 0 300 190"
            xmlns="http://www.w3.org/2000/svg"
            role="img"
            aria-label="Financial growth illustration"
          >
            {/* Growth bars */}
            <rect x="25" y="115" width="32" height="55" rx="4" fill="#000" />
            <rect x="70" y="85" width="32" height="85" rx="4" fill="#000" />
            <rect x="115" y="52" width="32" height="118" rx="4" fill="#000" />

            {/* Growth arrow */}
            <path
              d="M25 90 Q100 65 155 12"
              fill="none"
              stroke="#000"
              strokeWidth="7"
              strokeLinecap="round"
            />
            <path d="M143 10 L174 5 L168 36 Z" fill="#000" />

            {/* Coin stack */}
            <ellipse cx="170" cy="150" rx="27" ry="10" fill="#000" />
            <rect x="143" y="128" width="54" height="22" fill="#000" />
            <ellipse cx="170" cy="128" rx="27" ry="10" fill="#000" />

            <ellipse cx="225" cy="135" rx="27" ry="10" fill="#000" />
            <rect x="198" y="95" width="54" height="40" fill="#000" />
            <ellipse cx="225" cy="95" rx="27" ry="10" fill="#000" />

            {/* Money bag */}
            <path
              d="M215 65 L235 43 L260 43 L280 65
           Q292 85 288 115
           Q285 160 248 165
           Q210 160 207 115
           Q203 85 215 65 Z"
              fill="#000"
            />
            <path d="M225 40 L235 20 L260 20 L270 40 Z" fill="#000" />

            {/* Rupee symbol */}
            <text
              x="248"
              y="120"
              textAnchor="middle"
              fontSize="55"
              fontWeight="bold"
              fill="#fff"
            >
              ₹
            </text>

            {/* Base line */}
            <path
              d="M12 175 H290"
              stroke="#000"
              strokeWidth="5"
              strokeLinecap="round"
            />
          </svg>
        </div>
      </section>
      <section className="row g-3 summary-section">
        <div className="col-md-4">
          <div className="summary-card">
            <p>Total Income</p>
            <h3 className="income">{money(income)}</h3>
          </div>
        </div>

        <div className="col-md-4">
          <div className="summary-card">
            <p>Total Expenses</p>
            <h3 className="expense">{money(expenses)}</h3>
          </div>
        </div>

        <div className="col-md-4">
          <div className="summary-card">
            <p>Transactions</p>
            <h3>{transactions.length}</h3>
          </div>
        </div>
      </section>

      <section className="content-card add-section">
        <h2>{editingId !== null ? "Edit Transaction" : "Add Transaction"}</h2>

        <form onSubmit={addTransaction}>
          <div className="row g-2 align-items-end">

            <div className="col-lg-4">
              <label className="form-label">Transaction Name</label>
              <input
                className="form-control"
                type="text"
                placeholder="e.g. Grocery Shopping"
                value={name}
                onChange={(event) => setName(event.target.value)}
                required
              />
            </div>

            <div className="col-lg-3">
              <label className="form-label">Amount (₹)</label>
              <input
                className="form-control"
                type="number"
                min="1"
                step="any"
                placeholder="Enter amount"
                value={amount}
                onChange={(event) => setAmount(event.target.value)}
                required
              />
            </div>

            <div className="col-lg-2">
              <label className="form-label">Type</label>
              <select
                className="form-select"
                value={type}
                onChange={(event) => setType(event.target.value)}
              >
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </select>
            </div>

            {type === "expense" && (
              <div className="col-lg-2">
                <label className="form-label">Category</label>
                <select
                  className="form-select"
                  value={category}
                  onChange={(event) => setCategory(event.target.value)}
                >
                  {categories.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="col">
              <button className="btn add-button w-100" type="submit">
                {editingId !== null ? "Update" : "Add"}
              </button>

              {editingId !== null && (
                <button
                  className="btn btn-secondary w-100 mt-2"
                  type="button"
                  onClick={resetForm}
                >
                  Cancel
                </button>
              )}
            </div>

          </div>
        </form>
      </section>

      <section className="content-card transactions-section">

        <div className="transactions-header">
          <div>
            <h2>Recent Transactions</h2>
            <p>All your income and expenses.</p>
          </div>

          <div className="transaction-controls">
            <input
              className="form-control"
              type="search"
              placeholder="Search by name"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />

            <select
              className="form-select"
              value={filter}
              onChange={(event) => setFilter(event.target.value)}
            >
              <option value="all">All transactions</option>
              <option value="income">Income only</option>
              <option value="expense">Expenses only</option>
            </select>
          </div>
        </div>

        <div className="transaction-table-wrap">
          <table className="table transaction-table align-middle">
            <thead>
              <tr>
                <th>Transaction</th>
                <th>Category</th>
                <th>Type</th>
                <th className="text-end">Amount</th>
                <th className="text-end">Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredTransactions.map((item) => (
                <tr key={item.id}>
                  <td className="transaction-name">{item.name}</td>
                  <td>{item.category}</td>

                  <td>
                    <span className={`type-label ${item.type}`}>
                      {item.type === "income" ? "Income" : "Expense"}
                    </span>
                  </td>

                  <td className={`text-end amount-cell ${item.type}`}>
                    {item.type === "income" ? "+" : "-"}
                    {money(Number(item.amount))}
                  </td>

                  <td className="text-end">
                    <button
                      className="btn edit-button"
                      onClick={() => startEdit(item)}
                    >
                      Edit
                    </button>

                    <button
                      className="btn delete-button"
                      onClick={() => deleteTransaction(item.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}

              {filteredTransactions.length === 0 && (
                <tr>
                  <td colSpan="5" className="empty-message">
                    No transactions found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <footer className="transaction-footer">
          Showing {filteredTransactions.length} of {transactions.length} transactions
        </footer>

      </section>
    </main>
  );
}
