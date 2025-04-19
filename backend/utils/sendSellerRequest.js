import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'piyasampanna@gmail.com',
        pass: 'ugdalllppzqdwcjd',
    },
});

export const sendSellerRequestNotification = async (adminEmails, userDetails) => {
    try {
        const mailOptions = {
            from: 'piyasampanna@gmail.com',
            to: adminEmails.join(','),
            subject: 'New Seller Request Received',
            html: `
                <div style="font-family: Arial, sans-serif; line-height: 1.6;">
                    <h2 style="color: #333;">New Seller Request</h2>
                    <p>Hello Admin,</p>
                    
                    <p>A new seller request has been submitted by:</p>
                    
                    <div style="background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 15px 0;">
                        <p><strong>Name:</strong> ${userDetails.userFirstName} ${userDetails.userLastName}</p>
                        <p><strong>Email:</strong> ${userDetails.userEmail}</p>
                        <p><strong>Contact:</strong> ${userDetails.userContact}</p>
                        <p><strong>Request Date:</strong> ${new Date().toLocaleDateString()}</p>
                    </div>
                    
                    <p>Please review this request in the admin dashboard:</p>
                    <a href="${process.env.FRONTEND_URL}/admin/notifications"
                       style="background-color: #4CAF50; color: white; padding: 10px 20px; 
                              text-decoration: none; border-radius: 5px; display: inline-block;">
                        Review Seller Requests
                    </a>
                    
                    <p>Best regards,</p>
                    <p>Property Management Team</p>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);
        console.log('Seller request notification sent to admins');
    } catch (error) {
        console.error('Error sending seller request notification:', error);
        throw error;
    }
};

export const sendSellerStatusUpdate = async (userEmail, userFirstName, status) => {
    try {
        const isApproved = status === 'Accepted';
        const mailOptions = {
            from: 'piyasampanna@gmail.com',
            to: userEmail,
            subject: `Your Seller Request Has Been ${status}`,
            html: `
                <div style="font-family: Arial, sans-serif; line-height: 1.6;">
                    <h2 style="color: ${isApproved ? '#4CAF50' : '#f44336'};">Seller Request ${status}</h2>
                    <p>Dear ${userFirstName},</p>
                    
                    <p>Your request to become a seller has been <strong>${status.toLowerCase()}</strong>.</p>
                    
                    ${isApproved 
                        ? `<div style="background: #e8f5e9; padding: 15px; border-radius: 5px; margin: 15px 0;">
                            <p>You can now access seller features on our platform. Start listing your properties!</p>
                            <a href="${process.env.FRONTEND_URL}/add-property"
                               style="background-color: #4CAF50; color: white; padding: 10px 20px; 
                                      text-decoration: none; border-radius: 5px; display: inline-block;">
                                Go to Seller Dashboard
                            </a>
                           </div>`
                        : `<div style="background: #ffebee; padding: 15px; border-radius: 5px; margin: 15px 0;">
                            <p>Please provide valid user data to make user you want to sell proprety in Ghar Goomti.</p>
                           </div>`
                    }
                    <p>Best regards,</p>
                    <p>Ghar Goomti Admin</p>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);
        console.log(`Seller status update (${status}) sent to user`);
    } catch (error) {
        console.error('Error sending seller status update:', error);
        throw error;
    }
};

export default transporter;