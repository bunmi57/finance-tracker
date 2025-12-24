import React from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from './Pages/Home';
import Login from './Pages/Login';
import Register from './Pages/Register';
import Expense from './Pages/Expense';
import Savings from './Pages/Savings';

function App() {
  

  return (
    <>
      <Router> 

        <Routes>
          <Route path="/" element={<Home />}/>
          <Route path="/login" element={<Login />}/>
          <Route path="/register" element={<Register />}/>
          <Route path="/expense" element={<Expense />}/>
          <Route path="/savings" element={<Savings />}/>

        </Routes>
      </Router>
    </>
  )
}

export default App
