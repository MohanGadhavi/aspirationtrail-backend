import mongoose, { Schema } from 'mongoose';

const studentSchema = new mongoose.Schema(
  {
    standard: {
      type: String,
      enum: ['10th'],
      // enum: ['10th', '12th', 'Graduation', 'Post Graduation'],
      required: [true, 'Standard Required!'],
    },
    filedOfInterest: {
      type: String,
      // enum: function () {
      //   if (this.standard === '10th') {
      //     return ['Commerce', 'Science', 'Arts', 'Diploma'];
      //   } else if (this.standard === '12th') {
      //     return 'error';
      //   } else if (this.standard === 'Graduation') {
      //     return 'error';
      //   } else if (this.standard === 'Post Graduation') {
      //     return 'error';
      //   }
      // },
      enum: {
        values: ['Commerce', 'Science', 'Arts', 'Diploma'],
        message: 'Please select valid field of interest',
      },
      required: function () {
        return this.standard === '10th';
      },
    },
    marks: {
      type: String,
      required: [true, 'Marks Required!'],
    },
  },
  { timestamps: true }
);

export const studentFrom = mongoose.model('StudentFrom', studentSchema);
