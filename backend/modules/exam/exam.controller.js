const examModel = require("./exam.model");
const questionModel = require("./../question/question.model");
const AppError = require("../../utils/AppError");
const asyncHandler = require("../../utils/asyncHandler");

exports.getExams = asyncHandler(async (req, res, next) => {
  const exams = await examModel.find({isPublished: true}).sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    data: exams,
  });
});


exports.createExam = asyncHandler(async (req, res, next) => {
  const { title, slug, course, description, timeLimit } = req.body;

  const newExam = await examModel.create({
    title,
    slug,
    course,
    description,
    timeLimit,
  });

  res.status(201).json({
    success: true,
    message: "Exam created successfully",
    data: newExam,
  });
});

exports.addQuestionToExam = asyncHandler(async (req, res, next) => {
  const { examId } = req.params;
  const { title, options, correctAnswer, points } = req.body;

  const exam = await examModel.findById(examId);
  if (!exam) throw new AppError("Exam not found", 404);

  const questionCount = await questionModel.countDocuments({ exam: examId });

  const newQuestion = await questionModel.create({
    title,
    options,
    correctAnswer,
    points: points || 1,
    order: questionCount + 1,
    exam: examId,
  });

  res.status(201).json({
    success: true,
    message: "Question successfully added to the exam",
    data: newQuestion,
  });
});

exports.getExamWithQuestions = asyncHandler(async (req, res, next) => {
  const { examId } = req.params;

  const exam = await examModel.findById(examId).populate({
    path: "questions",
    options: { sort: { order: 1 } },
  });

  if (!exam) throw new AppError("Exam not found", 404);

  const totalPoints = exam.questions.reduce((sum, q) => sum + q.points, 0);

  res.status(200).json({
    success: true,
    data: exam,
    totalPoints,
  });
});

exports.getCourseExams = asyncHandler(async (req, res, next) => {
  const { courseId } = req.params;

  const exams = await examModel.find({ course: courseId , isPublished: true }).sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    data: exams,
  });
});

exports.updateExam = asyncHandler(async (req, res, next) => {
  const { examId } = req.params;
  
  const updatedExam = await examModel.findByIdAndUpdate(examId, req.body, { 
    new: true, 
    runValidators: true 
  });

  if (!updatedExam) throw new AppError("Exam not found", 404);

  res.status(200).json({
    success: true,
    message: "Exam updated successfully",
    data: updatedExam,
  });
});

exports.deleteExam = asyncHandler(async (req, res, next) => {
  const { examId } = req.params;

  const exam = await examModel.findById(examId);
  if (!exam) throw new AppError("Exam not found", 404);

  await questionModel.deleteMany({ exam: examId });
  
  await exam.deleteOne();

  res.status(200).json({
    success: true,
    message: "The exam and all its questions were successfully deleted",
  });
});

exports.getExamForStudent = asyncHandler(async (req, res, next) => {
    const { examId } = req.params;
    const user = req.user

    const exam = await examModel.findById(examId).populate({
    path: "questions",
    options: { sort: { order: 1 } },
  });

  if (!exam) throw new AppError("Exam not found", 404);

  if (!exam.isPublished) {
    throw new AppError("This test has not yet been activated for students.", 403);
  }

  const isEnrolled = user.courses.some(
    (courseId) => courseId.toString() === exam.course.toString()
  );

  if (!isEnrolled) {
    throw new AppError("To take this exam, you must first register for the course", 403);
  }

  res.status(200).json({
    success: true,
    data: exam,
  });
})
