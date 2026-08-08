const commentModel = require("./comment.model");
const courseModel = require("./../course/course.model");
const asyncHandler = require("../../utils/asyncHandler");
const AppError = require("../../utils/AppError");

exports.create = asyncHandler(async (req, res) => {
  const { user } = req;
  const { body, rate, course: courseId } = req.body;

  const course = await courseModel.findById(courseId);
  if (!course) {
    throw new AppError("Course not found", 404);
  }

  const add = await commentModel.create({
    body,
    course: courseId,
    creator: user._id,
    rate: rate || 5,
  });

  return res.status(201).json({
    success: true,
    message: "Your comment added successfully",
    data: add,
  });
});

exports.getCourseComments = asyncHandler(async (req, res) => {
  const { courseId } = req.params;

  const comments = await commentModel
    .find({ course: courseId, isAccept: true, isAnswer: false })
    .populate("creator", "username name")
    .sort({ createdAt: -1 })
    .lean();

  const answers = await commentModel
    .find({
      course: courseId,
      isAccept: true,
      isAnswer: true,
    })
    .populate("creator", "username name")
    .lean();

  const commentsWithReplies = comments.map((comment) => {
    return {
      ...comment,
      replies: answers.filter(
        (ans) => String(ans.mainCommentID) === String(comment._id),
      ),
    };
  });

  return res.json({
    success: true,
    data: commentsWithReplies,
  });
});

exports.answer = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { user } = req;
  const { body } = req.body;

  const mainComment = await commentModel.findById(id);
  if (!mainComment) {
    throw new AppError("Main comment not found", 404);
  }

  const answerComment = await commentModel.create({
    body,
    course: mainComment.course,
    article: mainComment.article,
    creator: user._id,
    isAccept: true,
    isAnswer: true,
    mainCommentID: id,
  });

  return res.status(201).json({
    success: true,
    message: "Your answer comment added successfully",
    data: answerComment,
  });
});

exports.accept = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const comment = await commentModel.findByIdAndUpdate(
    id,
    {
      isAccept: true,
    },
    { new: true },
  );

  if (!comment) {
    throw new AppError("Comment not found", 404);
  }

  return res.json({
    success: true,
    message: "Comment accepted seccessfully",
    data: comment,
  });
});

exports.getAllAdminComments = asyncHandler(async (req, res) => {
  const comments = await commentModel
    .find({})
    .populate("creator", "username name")
    .populate("course", "name")
    .sort({ createdAt: -1 })
    .lean();

  return res.json({
    success: true,
    data: comments,
  });
});

exports.remove = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const comment = await commentModel.findByIdAndDelete(id);
  if (!comment) {
    throw new AppError("Comment not found", 404);
  }

  if (!comment.isAnswer) {
    await commentModel.deleteMany({ mainCommentID: id });
  }

  return res.status(200).json({
    success: true,
    message: "Comment deleted successfully",
  });
});
