import nodemailer from 'nodemailer';

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
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Failed to send email.');
  }
};