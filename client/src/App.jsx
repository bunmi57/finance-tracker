import React from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Header from './components/Header'
import Footer from './components/Footer'
import Navbar from './components/Navbar'

function App() {
  

  return (
    <>
      <div>
        <Navbar/>
        <Header />
        <Footer />
      </div>
    </>
  )
}

export default App
