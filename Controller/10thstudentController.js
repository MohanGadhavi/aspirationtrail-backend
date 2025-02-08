import { studentFrom } from '../models/10thstudentSchema.js';
import { catchAsyncError } from '../middlewares/catchAsyncError.js';
import ErrorHandler from '../middlewares/error.js';

export const createStudentForm = catchAsyncError(async (req, res, next) => {
  const { standard, filedOfInterest, marks } = req.body;

  const studentForm = await studentFrom.create({
    standard,
    filedOfInterest,
    marks,
  });

  const result = studentForm.toJSON();
  res.status(200).json({
    success: true,
    message: 'student data saved',
    data: result,
  });
});

export const getStudentForm = catchAsyncError(async (req, res, next) => {
  const studentForm = await studentFrom.find();
  res.status(200).json({
    success: true,
    message: 'student data',
    data: studentForm,
  });
});
