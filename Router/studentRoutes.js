import express from 'express';
import {
  createStudentForm,
  getStudentForm,
} from '../Controller/10thstudentController.js';
import { isAuthenticated } from '../middlewares/auth.js';

const router = express.Router();

router.post('/add/student-details', createStudentForm);
router.get('/student-details', isAuthenticated, getStudentForm);

export default router;
