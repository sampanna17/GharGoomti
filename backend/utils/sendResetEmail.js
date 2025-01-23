import nodemailer from 'nodemailer';

const sendResetEmail = async ({ email, subject, message }) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'piyasampanna@gmail.com', // Replace with your Gmail email
      pass: 'ugdalllppzqdwcjd', // Replace with your Gmail app password
    },
  });

  const mailOptions = {
    from: 'piyasampanna@gmail.com', // Replace with your Gmail email
    to: email, // Use the `email` property from the `mailOption` object
    subject,
    html: message, // Use `html` for rich content
  };

  try {
    await transporter.sendMail(mailOptions); // Corrected method name
    console.log('Email sent successfully!');
    return true;
  } catch (error) {
    console.error('Error sending email:', error.message);
    throw new Error('Failed to send email.');
  }
};

const mailTemplate = (content, buttonUrl, buttonText) => {
  return `
    <!DOCTYPE html>
    <html>
      <body style="margin: 0; padding: 0; text-align: center; font-family: Arial, sans-serif; color: #000; background-color: #f4f4f4;">
        <div style="
          max-width: 600px;
          margin: 20px auto;
          background-color: #ffffff;
          padding: 20px;
          border-radius: 10px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          text-align: left;
        ">
          <p style="font-size: 16px; line-height: 1.5;">
            ${content}
          </p>
          <a href="${buttonUrl}" target="_blank" style="text-decoration: none;">
            <button style="
              background-color: #444394;
              border: none;
              width: 200px;
              height: 40px;
              border-radius: 6px;
              color: #ffffff;
              font-size: 16px;
              cursor: pointer;
              margin: 10px 0;
            ">
              ${buttonText}
            </button>
          </a>
          <p style="font-size: 14px; line-height: 1.5;">
            If you are unable to click the above button, copy and paste the URL below into your browser:
          </p>
          <a href="${buttonUrl}" target="_blank" style="font-size: 14px; color: #444394; text-decoration: none; word-break: break-all;">
            ${buttonUrl}
          </a>
        </div>
      </body>
    </html>
  `;
};

export { sendResetEmail, mailTemplate };