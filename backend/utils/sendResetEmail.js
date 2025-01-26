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
      <body style="margin: 0; padding: 0; background-color: #f4f4f4; font-family: Arial, sans-serif; color: #333; text-align: center;">
        <div style="
          max-width: 600px;
          margin: 30px auto;
          background-color: #ffffff;
          padding: 25px 20px;
          border-radius: 10px;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
          text-align: left;
        ">
          <!-- Content Section -->
          <p style="font-size: 16px; line-height: 1.6; color: #555; margin-bottom: 20px;">
            ${content}
          </p>

          <!-- Button Section -->
          <div style="text-align: center; margin-bottom: 20px;">
            <a href="${buttonUrl}" target="_blank" style="text-decoration: none;">
              <button style="
                background-color: #444394;
                border: none;
                width: 220px;
                height: 45px;
                border-radius: 6px;
                color: #ffffff;
                font-size: 16px;
                font-weight: bold;
                cursor: pointer;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
                transition: background-color 0.3s ease;
              " onmouseover="this.style.backgroundColor='#37317f'" onmouseout="this.style.backgroundColor='#444394'">
                ${buttonText}
              </button>
            </a>
          </div>

          <!-- Alternate Link Section -->
          <p style="font-size: 14px; line-height: 1.5; color: #777; text-align: center; margin: 0 0 10px;">
            If the button above doesn’t work, please copy and paste the following URL into your browser:
          </p>
          <a href="${buttonUrl}" target="_blank" style="
            font-size: 14px;
            color: #444394;
            text-decoration: none;
            word-break: break-word;
            display: inline-block;
            margin: 10px 0;
          ">
            ${buttonUrl}
          </a>
        </div>
      </body>
    </html>
  `;
};

export { sendResetEmail, mailTemplate };
