// src/App.jsx
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { Navbar }         from './components/navbar'
import Hero               from './components/hero'
import CoursesSection     from './components/coursesection'
import HowItWorks         from './components/How'
import EducatorsSection   from './components/EducatorsSection'
import CoursesPage        from './pages/courses page/coursesPage'
import CourseDetailPage   from './pages/courses page/CourseDetailPage'   // ← NEW
import Footer             from './components/footer'
import './App.css'
import { GetStartedButton } from './components/getstartedbutton'
import LoginPage          from './pages/loginpage/loginPage'
import RegisterPage       from './pages/registerpage/registerpage'
import AboutUs from './pages/about/AboutUs'

function HomePage() {
  return (
    <>
      <Hero />
      <CoursesSection />
      <HowItWorks />
      <EducatorsSection />
    </>
  )
}

function AppContent() {
  const location = useLocation()
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register'

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/"              element={<HomePage />} />
        <Route path="/courses"       element={<CoursesPage />} />
        <Route path="/courses/:id"   element={<CourseDetailPage />} />  {/* ← NEW */}
        <Route path="/login"         element={<LoginPage />} />
        <Route path="/register"      element={<RegisterPage />} />
        <Route path="/about" element={<AboutUs />} />
      </Routes>
      {!isAuthPage && <Footer />}
    </>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  )
}

export default App