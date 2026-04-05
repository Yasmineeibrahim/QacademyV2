import express from 'express'
import { getAllCourses, getCourseById, getCoursesByEducatorId } from '../controllers/coursesController.js'

const router = express.Router()

router.get('/', getAllCourses)
router.get('/educator/:educatorId', getCoursesByEducatorId)
router.get('/:id', getCourseById)
export default router