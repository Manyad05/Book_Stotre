import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Home';
import Course from './Courses/Courses';

function App() {
  return (
    <>
    <div className='dark:bg-slate-900 dark:text-white' >
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Course" element={<Course />} /> {/* Corrected path */}
      </Routes>
      </Router></div >
      </>
  );
}

export default App;


