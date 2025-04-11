import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'piyasampanna@gmail.com',
      pass: 'ugdalllppzqdwcjd', 
    },
});

export const sendAppointmentStatusEmail = async (to, subject, text) => {
    try {
        const mailOptions = {
            from: 'piyasampanna@gmail.com',
            to,
            subject,
            text
        };

        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully');
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
};

export const sendAppointmentRequestEmail = async (to, sellerName, appointmentDetails) => {
    try {
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to,
            subject: `New Appointment Request for ${appointmentDetails.propertyTitle}`,
            html: `
                <div style="font-family: Arial, sans-serif; line-height: 1.6;">
                    <h2 style="color: #333;">New Appointment Request</h2>
                    <p>Dear ${sellerName},</p>
                    
                    <p>You have received a new appointment request:</p>
                    
                    <div style="background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 15px 0;">
                        <p><strong>Property:</strong> ${appointmentDetails.propertyTitle}</p>
                        <p><strong>Buyer:</strong> ${appointmentDetails.buyerName}</p>
                        <p><strong>Date:</strong> ${appointmentDetails.appointmentDate}</p>
                        <p><strong>Time:</strong> ${appointmentDetails.appointmentTime}</p>
                        <p><strong>Contact:</strong> ${appointmentDetails.buyerContact}</p>
                    </div>
                    
                    <p>Please log in to your account to confirm or cancel this appointment:</p>
                    <a href="${process.env.FRONTEND_URL}/profile?activeTab=appointments"
                       style="background-color: #4CAF50; color: white; padding: 10px 20px; 
                              text-decoration: none; border-radius: 5px; display: inline-block;">
                        Manage Appointments
                    </a>
                    
                    <p>Best regards,</p>
                    <p>Property Management Team</p>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);
        console.log('Seller notification email sent successfully');
    } catch (error) {
        console.error('Error sending seller notification email:', error);
        throw error;
    }
};

export default transporter;