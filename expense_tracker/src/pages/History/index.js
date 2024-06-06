import React, { useState, useEffect } from "react";
import { DatePicker, Select, Button, message, Modal } from "antd";
import { FaCalendarAlt, FaMoneyBillWave, FaBullseye, FaEdit, FaTrash } from "react-icons/fa";
import moment from "moment"; // Import moment for date manipulation
import "../Expense/Expense.css";

const { Option } = Select;
const { RangePicker } = DatePicker;

const History = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [selectedDateRange, setSelectedDateRange] = useState(null);
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editExpense, setEditExpense] = useState(null);

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const response = await fetch(
        'http://localhost:5013/api/Category/category'
      );
      if (!response.ok) {
        throw new Error("Failed to fetch categories");
      }
      const data = await response.json();
      setCategories(data.$values);
    } catch (error) {
      console.error("Error fetching categories:", error);
      message.error("Failed to fetch categories");
    }
  };
  
  // Fetch filtered expenses
  const fetchFilteredExpenses = async () => {
    try {
      const token = localStorage.getItem("token");
      const query = new URLSearchParams();

      if (selectedCategory) query.append("category", selectedCategory);
      if (selectedYear) query.append("year", selectedYear);
      if (selectedMonth) query.append("month", selectedMonth);
      if (selectedDateRange) {
        query.append("startDate", selectedDateRange[0].format("YYYY-MM-DD"));
        query.append("endDate", selectedDateRange[1].format("YYYY-MM-DD"));
      }

      const response = await fetch(
        `http://localhost:5013/api/Expense/filter?${query.toString()}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch filtered expenses");
      }
      const data = await response.json();
      setFilteredExpenses(data.$values);
    } catch (error) {
      console.error("Error fetching filtered expenses:", error);
      message.error("Failed to fetch filtered expenses");
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCategoryChange = (value) => {
    setSelectedCategory(value);
  };

  const handleYearChange = (value) => {
    setSelectedYear(value);
  };

  const handleMonthChange = (value) => {
    setSelectedMonth(value);
  };

  const handleDateRangeChange = (dates) => {
    setSelectedDateRange(dates);
  };

  const handleFilterClick = () => {
    fetchFilteredExpenses();
  };

  const formatDate = (dateString) => {
    const options = { day: "2-digit", month: "2-digit", year: "numeric" };
    return new Date(dateString).toLocaleDateString("en-GB", options);
  };

  const handleEdit = (expense) => {
    setEditExpense(expense);
    setEditModalVisible(true);
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:5013/api/Expense/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to delete expense");
      }
      message.success("Expense deleted successfully");
      // Refetch filtered expenses after deletion
      fetchFilteredExpenses();
    } catch (error) {
      console.error("Error deleting expense:", error);
      message.error("Failed to delete expense");
    }
  };

  const handleEditExpense = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:5013/api/Expense/${editExpense.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editExpense),
      });
      if (!response.ok) {
        throw new Error("Failed to edit expense");
      }
      message.success("Expense edited successfully");
      setEditModalVisible(false);
      // Refetch filtered expenses after editing
      fetchFilteredExpenses();
    } catch (error) {
      console.error("Error editing expense:", error);
      message.error("Failed to edit expense");
    }
  };

  const handleEditModalCancel = () => {
    setEditModalVisible(false);
  };

  return (
    <div className="history-page">
      <h1>Expense History</h1>
      <div className="filters">
        <div className="filter-controls">
          <Select
            placeholder="Select Category"
            onChange={handleCategoryChange}
            style={{ width: 200, marginRight: 10 }}
          >
            {categories.map((category) => (
              <Option key={category.id} value={category.id}>
                {category.emoji} {category.name}
              </Option>
            ))}
          </Select>

          <Select
            placeholder="Select Year"
            onChange={handleYearChange}
            style={{ width: 120, marginRight: 10 }}
          >
            {Array.from({ length: 10 }, (_, i) => (
              <Option key={i} value={new Date().getFullYear() - i}>
                {new Date().getFullYear() - i}
              </Option>
            ))}
          </Select>

          <Select
            placeholder="Select Month"
            onChange={handleMonthChange}
            style={{ width: 120, marginRight: 10 }}
          >
            {Array.from({ length: 12 }, (_, i) => (
              <Option key={i} value={i + 1}>
                {new Date(0, i).toLocaleString("default", { month: "long" })}
              </Option>
            ))}
          </Select>

          <RangePicker onChange={handleDateRangeChange} style={{ marginRight: 10 }} />

          <Button
            type="primary"
            onClick={handleFilterClick}
            style={{ background: "#FF1493", border: "none", marginLeft: 10 }}
          >
            Filter
          </Button>
        </div>
      </div>

      <div className="expenses-container">
        <ul>
          {filteredExpenses.map((expense) => (
            <li key={expense.id} className="expense-item">
              <div className="expense-category">
                {categories.find((cat) => cat.id === expense.categoryId)?.emoji}
              </div>
              <div className="expense-details">
                <span className="expense-name">{expense.name}</span>
                <span className="expense-date">
                  <FaCalendarAlt /> {formatDate(expense.date)}
                </span>
                <span className="expense-amount">
                  <FaMoneyBillWave /> ₹{expense.amount}
                </span>
                <span className="expense-description">
                  <FaBullseye />
                  {expense.description}
                </span>
              </div>
              <div className="expense-actions">
                <FaEdit className="edit-icon" onClick={() => handleEdit(expense)} />
                <FaTrash className="delete-icon" onClick={() => handleDelete(expense.id)} />
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Edit Expense Modal */}
      <Modal
        title="Edit Expense"
        visible={editModalVisible}
        onOk={handleEditExpense}
        onCancel={handleEditModalCancel}
      >
        <div className="modal-content">
          <label>Name:</label>
          <input
            type="text"
            value={editExpense?.name || ""}
            onChange={(e) => setEditExpense({ ...editExpense, name: e.target.value })}
            style={{ marginBottom: 10, width: "100%", padding: "5px" }}
          />
          <label>Description:</label>
          <input
            type="text"
            value={editExpense?.description || ""}
            onChange={(e) => setEditExpense({ ...editExpense, description: e.target.value })}
            style={{ marginBottom: 10, width: "100%", padding: "5px" }}
          />
          <label>Amount:</label>
          <input
            type="number"
            value={editExpense?.amount || ""}
            onChange={(e) => setEditExpense({ ...editExpense, amount: e.target.value })}
            style={{ marginBottom: 10, width: "100%", padding: "5px" }}
          />
          <label>Date:</label>
          <DatePicker
            value={editExpense?.date ? moment(editExpense.date) : null}
            onChange={(date) => setEditExpense({ ...editExpense, date: date })}
            style={{ width: "100%", marginBottom: 10 }}
          />
        </div>
      </Modal>
    </div>
  );
};

export default History;
