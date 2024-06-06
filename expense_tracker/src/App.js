import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import Home from './pages/Home';
import Layout from './components/Layout';
import Expense from './pages/Expense';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/register" element={<Register/>} />  
          <Route path="/login" element={<Login/>} />
          <Route path="/" element={<Layout />} >
            <Route path="home" element={<Home/>}/>
            <Route path="expense" element={<Expense/>}/>
          </Route>
        </Routes>
    </Router>
    </div>
  );
}

export default App;
