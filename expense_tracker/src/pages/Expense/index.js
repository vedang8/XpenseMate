import React, { useState, useEffect } from 'react';
import './Expense.css';
import { FaPlus, FaCalendarAlt, FaMoneyBillWave, FaEdit, FaTrash, FaBullseye, FaAd, FaAirbnb, FaBook, FaBellSlash, FaCircle } from 'react-icons/fa';
import { message } from 'antd';

const Expense = () => {
  const [expenses, setExpenses] = useState([]);
  const [form, setForm] = useState({ name: '', description: '', date: '', amount: '', categoryId: '' });
  const [categories, setCategories] = useState([]);
  const [hoveredExpense, setHoveredExpense] = useState(null);
  const [todayExpense, setTodayExpense] = useState(0);


  // Fetch expenses
  const fetchExpenses = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5013/api/Expense/expenses', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        }
      });
      if (!response.ok) {
        throw new Error('Failed to fetch expenses');
      }
      const data = await response.json();
      setExpenses(data.$values); // Assuming expenses.$values contains the array of expenses
    } catch (error) {
      console.error('Error fetching expenses:', error);
      setExpenses([]);
      message.error('Failed to fetch expenses');
    }
  };
  

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const response = await fetch('http://localhost:5013/api/Category/category');
      if (!response.ok) {
        throw new Error('Failed to fetch categories');
      }
      const data = await response.json();
      setCategories(data.$values);
    } catch (error) {
      console.error('Error fetching categories:', error);
      // Handle error: You can set an empty array as a fallback
      setCategories([]);
      message.error('Failed to fetch categories');
    } 
  };

  const fetchTodayTotal = async () => {
    try{
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5013/api/Expense/today/total', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        }
      });
      if (!response.ok) {
        throw new Error('Failed to fetch expenses');
      }
      const data = await response.json();
      setTodayExpense(data);
    }catch(error){
      message.error("Failed to fetch total Expense ", error);
    }
  }

  useEffect(() => {
    fetchCategories();
    fetchExpenses();
    fetchTodayTotal();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleDelete = async (index) => {
    try {
      const token = localStorage.getItem('token');
      const expenseId = expenses[index].id; // Assuming each expense object has an 'id' field
  
      const response = await fetch(`http://localhost:5013/api/Expense/${expenseId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
  
      if (response.ok) {
        // Remove the deleted expense from the expenses state
        const updatedExpenses = [...expenses];
        updatedExpenses.splice(index, 1);
        setExpenses(updatedExpenses);
        message.success('Expense deleted successfully');
      } else {
        const errorData = await response.json();
        message.error(`Failed to delete expense: ${errorData.title || response.statusText}`);
        console.error('Server response:', errorData);
      }
    } catch (error) {
      console.error('Error:', error);
      message.error('An error occurred');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5013/api/Expense/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: form.name,
          description: form.description,
          amount: parseFloat(form.amount),
          date: form.date,
          categoryId: parseInt(form.categoryId)
        })
      });

      if (response.ok) {
        const newExpense = await response.json();
        setExpenses([...expenses, newExpense]);
        message.success('Expense added successfully');
        setForm({ name: '', description: '', date: '', amount: '', categoryId: '' });
      } else {
        const errorData = await response.json();
        message.error(`Failed to add your expense: ${errorData.title || response.statusText}`);
        console.error('Server response:', errorData);
      }
    } catch (error) {
      console.error('Error:', error);
      message.error('An error occurred');
    }
  };

  const formatDate = (dateString) => {
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-GB', options);
  };

  return (
    <div className="expenses-page">
      <h2>Daily Expenses</h2>
      <div className="expenses-container">
        {/* Expense Form */}
        <div className="expense-form">
          <h3>Add Expense</h3>
          <form onSubmit={handleSubmit}>
            <select name="categoryId" value={form.categoryId} onChange={handleChange} required>
              <option value="">Select Category</option>
              {categories && categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.emoji} {category.name}
                </option>
              ))}
            </select>
            <input type="text" name="name" placeholder="Expense Name" value={form.name} onChange={handleChange} required />
            <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} required></textarea>
            <input type="date" name="date" value={form.date} onChange={handleChange} required />
            <input type="number" name="amount" placeholder="Amount" value={form.amount} onChange={handleChange} required />

            <button type="submit">
              <span className="plus-circle"><FaPlus /></span> Add Expense
            </button>
          </form>
        </div>

        {/* Expense List */}
       
          <div className="expense-list">
            <h3>Today's Expenses = ₹ {todayExpense}</h3>
            <ul>
              {expenses && expenses.map((expense, index) => (
                <li
                  key={index}
                  className="expense-item"
                  onMouseEnter={() => setHoveredExpense(index)}
                  onMouseLeave={() => setHoveredExpense(null)}
                >
                  <div className="expense-category">{categories.find(cat => cat.id === expense.categoryId)?.emoji}</div>
                  <div className="expense-details">
                    <span className="expense-name">📝{expense.name}</span>
                    <span className="expense-date">📅 {formatDate(expense.date)}   </span>
                    <span className="expense-amount">🪙₹{expense.amount}</span>
                    <span className="expense-description"><FaBullseye />{expense.description}</span>
                  </div>
                  <div className="expense-actions">
                    <FaEdit className="edit-icon" />
                    <FaTrash className="delete-icon" onClick={() => handleDelete(index)} />
                  </div>
                  {/* Conditional rendering of description on hover */}
                  {hoveredExpense === index && (
                    <div className="expense-description"></div>
                  )}
                </li>
              ))}
            </ul>
          </div>
         
      </div>
    </div>
  );
};

export default Expense;
