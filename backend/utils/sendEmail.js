const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    pool: true, 
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: `"پلتفرم آموزشی" <${process.env.EMAIL_USER}>`, 
    to: options.email,
    subject: options.subject,
    html: options.message,
  };

  const info = await transporter.sendMail(mailOptions);
  return info; 
};

module.exports = sendEmail;