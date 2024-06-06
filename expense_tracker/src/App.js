import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import Home from './pages/Home';
import Layout from './components/Layout';
import Expense from './pages/Expense';
import History from './pages/History';

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
            <Route path="history" element={<History />}></Route>
          </Route>
        </Routes>
    </Router>
    </div>
  );
}

export default App;
