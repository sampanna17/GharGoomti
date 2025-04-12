import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'piyasampanna@gmail.com',
      pass: 'ugdalllppzqdwcjd', 
    },
});

export const sendPropertyNotificationEmail = async (toEmail, userName, property) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: toEmail,
        subject: 'New Property Available!',
        html: `
            <h2>Hello ${userName},</h2>
            <p>A new property has been listed that might interest you:</p>
            <h2>${property.title}</h2>
            <p><strong>Price:</strong> ${property.price}</p>
            <p><strong>Location:</strong> ${property.address}, ${property.city}</p>
            <p><strong>Type:</strong> ${property.type} for ${property.for}</p>
            <p><strong>Size:</strong> ${property.size} sq.ft.</p>
            <br/>
            <p>Log in to your account to view more details.</p>
            <br/>
            <p>Best regards,</p>
            <p>Your Property Team</p>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Notification sent to ${toEmail}`);
    } catch (error) {
        console.error(`Error sending email to ${toEmail}:`, error);
    }
};