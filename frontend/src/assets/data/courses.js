// src/assets/data/courses.js

export const courses = [
  { id: 1,  category: 'Calculus',           title: 'Differential & Integral Calculus',          instructor: 'Dr. Sarah Ahmed',    initials: 'SA', lessons: 24, duration: '18h 30m', price: '$49.00', color: '#042a4e', semester: 1, major: 'All' },
  { id: 2,  category: 'Linear Algebra',     title: 'Matrices, Vectors & Transformations',        instructor: 'Prof. Omar Hassan',  initials: 'OH', lessons: 18, duration: '14h 00m', price: '$45.00', color: '#1a4a7a', semester: 1, major: 'All' },
  { id: 3,  category: 'Physics',            title: 'Classical Mechanics & Dynamics',             instructor: 'Dr. Layla Nasser',   initials: 'LN', lessons: 30, duration: '22h 15m', price: '$55.00', color: '#042a4e', semester: 2, major: 'All' },
  { id: 4,  category: 'Statistics',         title: 'Probability & Statistical Analysis',         instructor: 'Prof. Karim Adel',   initials: 'KA', lessons: 20, duration: '16h 45m', price: '$42.00', color: '#1a4a7a', semester: 2, major: 'All' },
  { id: 5,  category: 'Engineering',        title: 'Thermodynamics & Heat Transfer',             instructor: 'Dr. Nour Ibrahim',   initials: 'NI', lessons: 26, duration: '20h 00m', price: '$50.00', color: '#042a4e', semester: 3, major: 'Mechanical' },
  { id: 6,  category: 'Differential Eq.',   title: 'Ordinary Differential Equations',            instructor: 'Prof. Hana Zaki',    initials: 'HZ', lessons: 22, duration: '17h 30m', price: '$48.00', color: '#1a4a7a', semester: 3, major: 'All' },
  { id: 7,  category: 'Circuits',           title: 'Electric Circuit Analysis',                  instructor: 'Dr. Youssef Gamal',  initials: 'YG', lessons: 28, duration: '21h 00m', price: '$52.00', color: '#042a4e', semester: 3, major: 'Electrical' },
  { id: 8,  category: 'Programming',        title: 'C++ for Engineers',                          instructor: 'Prof. Rania Samir',  initials: 'RS', lessons: 32, duration: '24h 00m', price: '$58.00', color: '#1a4a7a', semester: 2, major: 'Computer' },
  { id: 9,  category: 'Fluid Mechanics',    title: 'Fluid Statics & Dynamics',                   instructor: 'Dr. Amr Khalil',     initials: 'AK', lessons: 24, duration: '19h 00m', price: '$51.00', color: '#042a4e', semester: 4, major: 'Mechanical' },
  { id: 10, category: 'Electromagnetics',   title: 'Electromagnetic Fields & Waves',             instructor: 'Prof. Dina Salah',   initials: 'DS', lessons: 20, duration: '15h 30m', price: '$46.00', color: '#1a4a7a', semester: 4, major: 'Electrical' },

]

export const SEMESTERS = [1, 2, 3, 4, 5, 6, 7, 8]
export const MAJORS    = ['All', 'Electrical', 'Mechanical', 'Computer', 'Civil']