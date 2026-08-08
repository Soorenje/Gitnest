const newsletterModel = require("./newsletter.model");
const userModel = require("./../user/user.model");
const sendEmail = require("./../../utils/sendEmail");
const newsletterTemplate = require("./../../utils/emailTemplate");
const asyncHandler = require("./../../utils/asyncHandler");
const AppError = require("./../../utils/AppError");

exports.getHistory = asyncHandler(async (req, res) => {
  const history = await newsletterModel
    .find({})
    .sort({ createdAt: -1 })
    .limit(5)
    .select("-content");

  res.status(200).json({ success: true, data: history });
});

exports.saveDraft = asyncHandler(async (req, res) => {
  const { subject, content, audience } = req.body;

  const draft = await newsletterModel.create({
    subject,
    content,
    audience,
    status: "draft",
    sender: req.user._id,
  });

  res.status(201).json({
    success: true,
    message: "Draft saved successfully.",
    data: draft,
  });
});

exports.sendNewsletter = asyncHandler(async (req, res) => {
  const { subject, content, audience } = req.body;

  let filter = {};
  if (audience === "students") filter = { role: "User" };
  else if (audience === "instructors") filter = { role: "Instructor" };

  const users = await userModel.find(filter);

  if (!users || users.length === 0) {
    throw new AppError("No users found for the selected audience.", 404);
  }

  const newsletter = await newsletterModel.create({
    subject,
    content,
    audience,
    status: "pending",
    recipientsCount: users.length,
    sender: req.user._id,
  });

  try {
    const finalHtmlTemplate = newsletterTemplate(subject, content);

    await Promise.allSettled(
      users.map(async (user) => {
        await sendEmail({
          email: user.email,
          subject,
          message: finalHtmlTemplate,
        });
      }),
    );

    newsletter.status = "sent";
    newsletter.sendAt = Date.now();
    await newsletter.save();

    res.status(200).json({
      success: true,
      message: `Newsletter successfully sent to ${users.length} recipient(s).`,
    });
  } catch (error) {
    newsletter.status = "failed";
    await newsletter.save();

    throw new AppError("Failed to send emails. Please try again.", 500);
  }
});
