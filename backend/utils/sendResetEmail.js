import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();
const logoUrl = process.env.LOGO_URL;

const sendResetEmail = async ({ email, subject, message }) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'piyasampanna@gmail.com',
      pass: 'ugdalllppzqdwcjd',
    },
  });

  const mailOptions = {
    from: 'piyasampanna@gmail.com',
    to: email,
    subject,
    html: message,
  };

  try {
    await transporter.sendMail(mailOptions);
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
      <body style="margin: 0; padding: 0; background-color: #ffffff; font-family: Arial, sans-serif; color: #333; text-align: center;">
        <div style="
          max-width: 600px;
          margin: 30px auto;
          background-color: #f4f4f4;
          padding: 25px 20px;
          border-radius: 10px;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
          text-align: left;
        ">
          <div style="display: flex; align-items: center; justify-content: center; margin-bottom: 20px;">
            <div style="display: flex; align-items: center;">
              <img src="https://res.cloudinary.com/dszzmdq4a/image/upload/v1744388438/LOGO_xiswbu.png" alt="Ghar Goomti Logo" style="height: 50px; margin-right: 10px;">
              <span style="font-size: 22px; font-weight: bold; color: #444394;">Ghar Goomti</span>
            </div>
          </div>  
          
          <!-- Horizontal Line -->
          <hr style="border: none; height: 1px; background-color: #ddd; margin: 20px 0;">

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
          <p style="font-size: 14px; line-height: 1.5; color: #777; text-align: center; margin: 20px auto; width: 80%;">
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
