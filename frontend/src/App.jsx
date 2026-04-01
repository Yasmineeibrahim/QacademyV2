// src/App.jsx
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { Navbar } from './components/navbar/navbar'
import Hero from './components/hero/hero'
import CoursesSection from './components/coursesSection/coursesection'
import HowItWorks from './components/howItworks/How'
import EducatorsSection from './components/educatorsSection/EducatorsSection'
import CoursesPage from './pages/coursesDetailPage/coursesPage'
import CourseDetailPage from './pages/coursesDetailPage/CourseDetailPage'
import Footer from './components/footer/footer'
import './App.css'
import LoginPage          from './pages/loginpage/loginPage'
import RegisterPage       from './pages/registerpage/registerpage'
import AboutUs from './pages/about/AboutUs'
import StudentCoursesPageComponent from './pages/StudentProfilePage/StudentProfilePage'
import StudentProfilePageComponent from './pages/StudentCoursePage/StudentCoursePage'
import EducatorAnalyticsPage from './pages/EducatorAnalyticsPage/EducatorAnalyticsPage'
import AdminControlPage from './pages/adminControlPage/AdminControlPage'

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
        <Route path="/courses/:id"   element={<CourseDetailPage />} />
        <Route path="/login"         element={<LoginPage />} />
        <Route path="/register"      element={<RegisterPage />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/profile" element={<StudentCoursesPageComponent />} />
        <Route path="/student-courses" element={<StudentProfilePageComponent />} />
        <Route path="/educator-analytics" element={<EducatorAnalyticsPage />} />
        <Route path="/control-nexus" element={<AdminControlPage />} />
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