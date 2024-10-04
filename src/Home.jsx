import React from 'react'
import Nav from "./components/Nav"
import Banner from "./components/Banner"
import Footer from "./components/Footer"
import Card from './components/Card'
import './App.css'
function Home() {
  return (
  <>
          <Nav/>
          <Banner/>
          <Card/>
          <Footer/>
  </>
  )
}

export default Home