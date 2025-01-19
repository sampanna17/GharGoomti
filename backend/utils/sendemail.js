import nodemailer from 'nodemailer';

// Refactor `sendemail` to return a promise
export const sendemail = async (to, subject, otp) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'piyasampanna@gmail.com',
      pass: 'ugdalllppzqdwcjd', 
    },
  });

  const mailOptions = {
    from: 'piyasampanna@gmail.com',
    to,
    subject,
    text: `Your OTP is ${otp}`, 
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully!');
    return true; // Indicate success
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Failed to send email.');
  }
};