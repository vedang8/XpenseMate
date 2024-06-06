import React, { useState, useEffect } from "react";
import "../Expense/Expense.css";
import { Pie } from "react-chartjs-2";
import { message } from "antd";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { FaCalendarAlt, FaMoneyBillWave, FaBullseye } from "react-icons/fa";

// Register chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

const Home = () => {
  const [chartData, setChartData] = useState(null);
  const [error, setError] = useState(null);
  const [todayExpense, setTodayExpense] = useState(0);
  const [monthlyExpense, setMonthlyExpense] = useState(0);
  const [highestExpense, setHighestExpense] = useState(null);
  const [lowestExpense, setLowestExpense] = useState(null);
  const [categories, setCategories] = useState([]);
  const [hoveredExpense, setHoveredExpense] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const response = await fetch(
        "http://localhost:5013/api/Category/category"
      );
      if (!response.ok) {
        throw new Error("Failed to fetch categories");
      }
      const data = await response.json();
      setCategories(data.$values);
    } catch (error) {
      console.error("Error fetching categories:", error);
      // Handle error: You can set an empty array as a fallback
      setCategories([]);
      message.error("Failed to fetch categories");
    } finally {
      setLoading(false); // Update loading state when categories are fetched
    }
  };

  const fetchTodayTotal = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "http://localhost:5013/api/Expense/today/total",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch expenses");
      }
      const data = await response.json();
      setTodayExpense(data);
    } catch (error) {
      message.error("Failed to fetch total Expense ", error);
    }
  };

  const fetchMonthlyExpense = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "http://localhost:5013/api/Expense/current-month/total",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch expenses");
      }
      const data = await response.json();
      setMonthlyExpense(data);
    } catch (error) {
      message.error("Failed to fetch total Expense ", error);
    }
  };

  const fetchHighestExpense = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "http://localhost:5013/api/Expense/maximum",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch expenses");
      }
      const data = await response.json();
      setHighestExpense(data);
    } catch (error) {
      message.error("Failed to fetch total Expense ", error);
    }
  };

  const fetchLowestExpense = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "http://localhost:5013/api/Expense/minimum",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if(!response){

      }
      if (!response.ok) {
        throw new Error("Failed to fetch expenses");
      }
      const data = await response.json();
      setLowestExpense(data);
    } catch (error) {
      message.error("Failed to fetch total Expense ", error);
    }
  };

  useEffect(() => {
    const fetchExpenseData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          "http://localhost:5013/api/Expense/chart",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch expense data");
        }

        const data = await response.json();

        // Extract the values array from the response
        const expenses = data.$values;

        // Calculate percentage for each category
        const totalAmount = expenses.reduce(
          (acc, expense) => acc + expense.totalAmount,
          0
        );

        const categoryNames = expenses.map((expense) => expense.categoryName);
        const categoryPercentages = expenses.map((expense) =>
          ((expense.totalAmount / totalAmount) * 100).toFixed(2)
        );

        // Prepare data for Chart.js
        const chartData = {
          labels: categoryNames,
          datasets: [
            {
              data: categoryPercentages,
              backgroundColor: [
                "#1f77b4",
                "#ff7f0e",
                "#2ca02c",
                "#d62728",
                "#9467bd",
                "#8c564b",
                "#e377c2",
                "#7f7f7f",
                "#bcbd22",
                "#17becf",
              ].slice(0, categoryNames.length),
            },
          ],
        };

        setChartData(chartData);
      } catch (error) {
        setError(error.message);
        message.error("Error fetching expense data: " + error.message);
      }
    };

    fetchCategories();
    fetchExpenseData();
    fetchTodayTotal();
    fetchMonthlyExpense();
    fetchHighestExpense();
    fetchLowestExpense();
  }, []);

  const formatDate = (dateString) => {
    const options = { day: "2-digit", month: "2-digit", year: "numeric" };
    return new Date(dateString).toLocaleDateString("en-GB", options);
  };

  return (
    <div className="expenses-page">
      <h1>
        💸Xpense <span>Mate</span>
      </h1>
      <div className="expenses-container">
        {error ? (
          <p>Loading...</p>
        ) : (
          <div style={{ height: "400px", width: "400px" }}>
            {chartData ? (
              <Pie data={chartData} options={{ responsive: true }} />
            ) : (
              <p>😇You Haven't made any Expenses Yet!</p>
            )}
          </div>
        )}

        <div className="expense-list">
          <h3>Monthly Expenses = ₹ {monthlyExpense}</h3>
          <h3>Today's Expenses = ₹ {todayExpense}</h3>

          <h3>Highest Expense</h3>
          {highestExpense && (
            <ul>
              <li
                key={highestExpense.id}
                className="expense-item"
                onMouseEnter={() => setHoveredExpense(highestExpense.id)}
                onMouseLeave={() => setHoveredExpense(null)}
              >
                <div className="expense-category">
                  {
                    categories.find(
                      (cat) => cat.id === highestExpense.categoryId
                    )?.emoji
                  }
                </div>
                <div className="expense-details">
                  <span className="expense-name">{highestExpense.name}</span>
                  <span className="expense-date">
                    <FaCalendarAlt /> {formatDate(highestExpense.date)}
                  </span>
                  <span className="expense-amount">
                    <FaMoneyBillWave /> ₹{highestExpense.amount}
                  </span>
                  <span className="expense-description">
                    <FaBullseye />
                    {highestExpense.description}
                  </span>
                </div>
              </li>
            </ul>
          )}
          
          <h3>Lowest Expense</h3>
          {lowestExpense && (
            <ul>
              <li
                key={lowestExpense.id}
                className="expense-item"
                onMouseEnter={() => setHoveredExpense(lowestExpense.id)}
                onMouseLeave={() => setHoveredExpense(null)}
              >
                <div className="expense-category">
                  {
                    categories.find(
                      (cat) => cat.id === lowestExpense.categoryId
                    )?.emoji
                  }
                </div>
                <div className="expense-details">
                  <span className="expense-name">{lowestExpense.name}</span>
                  <span className="expense-date">
                    <FaCalendarAlt /> {formatDate(lowestExpense.date)}
                  </span>
                  <span className="expense-amount">
                    <FaMoneyBillWave /> ₹{lowestExpense.amount}
                  </span>
                  <span className="expense-description">
                    <FaBullseye />
                    {lowestExpense.description}
                  </span>
                </div>
              </li>
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
