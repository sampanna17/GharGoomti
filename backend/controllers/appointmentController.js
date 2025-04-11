
import db from '../config/db.js'; 
import { sendAppointmentStatusEmail,sendAppointmentRequestEmail } from '../utils/sendBookingStatus.js';
import { isTimeSlotAvailable } from '../utils/appointmentUtils.js';

// export const addAppointment = async (req, res) => {
//     const { userID, propertyID, appointmentDate, appointmentTime } = req.body;

//     if (!userID || !propertyID || !appointmentDate || !appointmentTime) {
//         return res.status(400).json({ message: 'All fields are required.' });
//     }

//     try {
//         const isAvailable = await isTimeSlotAvailable(propertyID, appointmentDate, appointmentTime);

//         if (!isAvailable) {
//             return res.status(409).json({ 
//                 message: 'This time slot is already booked. Please choose another time.' 
//             });
//         }

//         // Check if property exists and get seller info
//         const [property] = await db.query(`
//             SELECT p.*, u.userEmail as sellerEmail, 
//                    CONCAT(u.userFirstName, ' ', u.userLastName) as sellerName,
//                    u.userContact as sellerContact
//             FROM property p
//             JOIN users u ON p.userID = u.userID
//             WHERE p.propertyID = ?
//         `, [propertyID]);

//         if (property.length === 0) {
//             return res.status(404).json({ message: 'Property not found.' });
//         }

//         if (property[0].userID === userID) {
//             return res.status(403).json({ message: 'You cannot book appointments for your own properties.' });
//         }

//         // Get buyer info
//         const [buyer] = await db.query(`
//             SELECT CONCAT(userFirstName, ' ', userLastName) as buyerName, userContact
//             FROM users
//             WHERE userID = ?
//         `, [userID]);

//         if (buyer.length === 0) {
//             return res.status(404).json({ message: 'Buyer not found.' });
//         }

//         // Create appointment
//         const [result] = await db.query(`
//             INSERT INTO appointment (userID, propertyID, appointmentDate, appointmentTime, appointmentStatus, created_at)
//             VALUES (?, ?, ?, ?, 'pending', NOW())
//         `, [userID, propertyID, appointmentDate, appointmentTime]);

//         // Prepare and send notification to seller
//         const appointmentDetails = {
//             propertyTitle: property[0].propertyTitle,
//             buyerName: buyer[0].buyerName,
//             buyerContact: buyer[0].userContact,
//             appointmentDate,
//             appointmentTime
//         };

//         await sendAppointmentRequestEmail(
//             property[0].sellerEmail,
//             property[0].sellerName,
//             appointmentDetails
//         );

//         res.status(201).json({
//             message: 'Appointment requested successfully. Seller has been notified.',
//             appointmentID: result.insertId
//         });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Error creating appointment.', error });
//     }
// };
export const addAppointment = async (req, res) => {
    const { userID, propertyID, appointmentDate, appointmentTime } = req.body;

    if (!userID || !propertyID || !appointmentDate || !appointmentTime) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    try {
        // Check for existing appointment by same user for same property and time
        const [existingAppointments] = await db.query(`
            SELECT * FROM appointment 
            WHERE userID = ? 
            AND propertyID = ? 
            AND appointmentDate = ? 
            AND appointmentTime = ?
            AND appointmentStatus != 'cancelled'
        `, [userID, propertyID, appointmentDate, appointmentTime]);

        if (existingAppointments.length > 0) {
            return res.status(409).json({ 
                message: 'You already have an appointment booked for this property at this time.' 
            });
        }

        // Check general time slot availability
        const isAvailable = await isTimeSlotAvailable(propertyID, appointmentDate, appointmentTime);
        if (!isAvailable) {
            return res.status(409).json({ 
                message: 'This time slot is already booked. Please choose another time.' 
            });
        }

        // Check if property exists and get seller info
        const [property] = await db.query(`
            SELECT p.*, u.userEmail as sellerEmail, 
                   CONCAT(u.userFirstName, ' ', u.userLastName) as sellerName,
                   u.userContact as sellerContact
            FROM property p
            JOIN users u ON p.userID = u.userID
            WHERE p.propertyID = ?
        `, [propertyID]);

        if (property.length === 0) {
            return res.status(404).json({ message: 'Property not found.' });
        }

        if (property[0].userID === userID) {
            return res.status(403).json({ message: 'You cannot book appointments for your own properties.' });
        }

        // Get buyer info
        const [buyer] = await db.query(`
            SELECT CONCAT(userFirstName, ' ', userLastName) as buyerName, userContact
            FROM users
            WHERE userID = ?
        `, [userID]);

        if (buyer.length === 0) {
            return res.status(404).json({ message: 'Buyer not found.' });
        }

        // Create appointment
        const [result] = await db.query(`
            INSERT INTO appointment (userID, propertyID, appointmentDate, appointmentTime, appointmentStatus, created_at)
            VALUES (?, ?, ?, ?, 'pending', NOW())
        `, [userID, propertyID, appointmentDate, appointmentTime]);

        // Prepare and send notification to seller
        const appointmentDetails = {
            propertyTitle: property[0].propertyTitle,
            buyerName: buyer[0].buyerName,
            buyerContact: buyer[0].userContact,
            appointmentDate,
            appointmentTime
        };

        await sendAppointmentRequestEmail(
            property[0].sellerEmail,
            property[0].sellerName,
            appointmentDetails
        );

        res.status(201).json({
            message: 'Appointment requested successfully. Seller has been notified.',
            appointmentID: result.insertId
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating appointment.', error });
    }
};

export const getUserAppointments = async (req, res) => {
    const { userID } = req.params;

    try {
        // Get user role and name
        const [user] = await db.query(
            'SELECT role, userFirstName, userLastName FROM users WHERE userID = ?', 
            [userID]
        );
        
        if (user.length === 0) {
            return res.status(404).json({ message: 'User not found.' });
        }

        let query;
        let params = [userID];
        
        if (user[0].role === 'buyer') {
            query = `
                SELECT a.*, 
                       p.propertyTitle, p.propertyAddress, p.propertyCity,
                       CONCAT(s.userFirstName, ' ', s.userLastName) as sellerName,
                       s.userContact as sellerContact,
                       s.userEmail as sellerEmail
                FROM appointment a
                JOIN property p ON a.propertyID = p.propertyID
                JOIN users s ON p.userID = s.userID
                WHERE a.userID = ?
                ORDER BY a.appointmentDate DESC
            `;
        } else if (user[0].role === 'seller') {
            query = `
                (SELECT a.*, 
                        p.propertyTitle, p.propertyAddress, p.propertyCity,
                        CONCAT(b.userFirstName, ' ', b.userLastName) as buyerName,
                        b.userContact as buyerContact,
                        b.userEmail as buyerEmail
                 FROM appointment a
                 JOIN property p ON a.propertyID = p.propertyID
                 JOIN users b ON a.userID = b.userID
                 WHERE p.userID = ?)
                
                UNION
                
                (SELECT a.*, 
                        p.propertyTitle, p.propertyAddress, p.propertyCity,
                        CONCAT(s.userFirstName, ' ', s.userLastName) as sellerName,
                        s.userContact as sellerContact,
                        s.userEmail as sellerEmail
                 FROM appointment a
                 JOIN property p ON a.propertyID = p.propertyID
                 JOIN users s ON p.userID = s.userID
                 WHERE a.userID = ?)
                ORDER BY appointmentDate DESC
            `;
            params = [userID, userID];
        } else {
            return res.status(403).json({ message: 'Access denied.' });
        }

        const [appointments] = await db.query(query, params);

        if (appointments.length === 0) {
            return res.status(404).json({ message: 'No appointments found.' });
        }

        res.status(200).json({ 
            user: {
                name: `${user[0].userFirstName} ${user[0].userLastName}`,
                role: user[0].role
            },
            appointments 
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error retrieving appointments.', error });
    }
};

// Controller to remove an appointment
export const removeAppointment = async (req, res) => {
    const { appointmentID } = req.params;

    if (!appointmentID) {
        return res.status(400).json({ message: 'Appointment ID is required.' });
    }

    try {
        const query = 'DELETE FROM appointment WHERE appointmentID = ?';
        await db.query(query, [appointmentID]);

        res.status(200).json({ message: 'Appointment removed successfully.' });
    } catch (error) {
        res.status(500).json({ message: 'Error removing appointment.', error });
    }
};

// Get all pending appointments for seller's properties
export const getSellerPendingAppointments = async (req, res) => {
    const { sellerID } = req.params;

    try {
        // Verify the user is a seller
        const [user] = await db.query(
            'SELECT role, userFirstName, userLastName FROM users WHERE userID = ?', 
            [sellerID]
        );
        
        if (user.length === 0 || user[0].role !== 'seller') {
            return res.status(403).json({ message: 'Only sellers can access this resource.' });
        }

        const query = `
            SELECT a.*, 
                   CONCAT(u.userFirstName, ' ', u.userLastName) as buyerName,
                   u.userEmail as buyerEmail,
                   u.userContact as buyerContact,
                   p.propertyTitle, p.propertyAddress, p.propertyCity
            FROM appointment a
            JOIN property p ON a.propertyID = p.propertyID
            JOIN users u ON a.userID = u.userID
            WHERE p.userID = ? AND a.appointmentStatus = 'pending'
            ORDER BY a.appointmentDate DESC
        `;
        
        const [appointments] = await db.query(query, [sellerID]);

        res.status(200).json({
            seller: `${user[0].userFirstName} ${user[0].userLastName}`,
            appointments: appointments.length > 0 ? appointments : []
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error retrieving appointments.', error });
    }
};

// Update appointment status
export const updateAppointmentStatus = async (req, res) => {
    const { appointmentID } = req.params;
    const { status, sellerID } = req.body;

    if (!appointmentID || !status || !['confirmed', 'cancelled'].includes(status)) {
        return res.status(400).json({ message: 'Invalid input. Appointment ID and valid status are required.' });
    }

    try {
        // verify the seller and the property
        const [appointmentCheck] = await db.query(`
            SELECT p.userID as propertyOwner
            FROM appointment a
            JOIN property p ON a.propertyID = p.propertyID
            WHERE a.appointmentID = ?
        `, [appointmentID]);

        if (appointmentCheck.length === 0) {
            return res.status(404).json({ message: 'Appointment not found.' });
        }

        if (appointmentCheck[0].propertyOwner !== sellerID) {
            return res.status(403).json({ message: 'You can only manage appointments for your own properties.' });
        }

        const [appointments] = await db.query(`
            SELECT a.*, 
                   CONCAT(u.userFirstName, ' ', u.userLastName) as buyerName,
                   u.userEmail as buyerEmail,
                   p.propertyTitle
            FROM appointment a
            JOIN users u ON a.userID = u.userID
            JOIN property p ON a.propertyID = p.propertyID
            WHERE a.appointmentID = ?
        `, [appointmentID]);

        const appointment = appointments[0];

        await db.query(
            'UPDATE appointment SET appointmentStatus = ? WHERE appointmentID = ?',
            [status, appointmentID]
        );

        // Send email notification to buyer
        try {
            const subject = `Your Appointment for ${appointment.propertyTitle} Has Been ${status}`;
            const text = `Dear ${appointment.buyerName},\n\nYour appointment for ${appointment.propertyTitle} scheduled for ${appointment.appointmentDate} at ${appointment.appointmentTime} has been ${status}.\n\nThank you.`;
            
            await sendAppointmentStatusEmail(appointment.buyerEmail, subject, text);
        } catch (emailError) {
            console.error('Failed to send email:', emailError);
        }

        res.status(200).json({ 
            message: `Appointment ${status} successfully.`,
            notification: 'Buyer has been notified via email.',
            appointment: {
                id: appointmentID,
                status,
                property: appointment.propertyTitle,
                buyer: appointment.buyerName
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating appointment status.', error });
    }
};

// Controller to check if user has an appointment for a property
export const checkAppointment = async (req, res) => {
    const { userID, propertyID } = req.params;

    if (!userID || !propertyID) {
        return res.status(400).json({ message: 'User ID and Property ID are required.' });
    }

    try {
        // Check if user exists
        const [user] = await db.query('SELECT userID FROM users WHERE userID = ?', [userID]);
        if (user.length === 0) {
            return res.status(404).json({ message: 'User not found.' });
        }

        // Check if property exists
        const [property] = await db.query('SELECT propertyID FROM property WHERE propertyID = ?', [propertyID]);
        if (property.length === 0) {
            return res.status(404).json({ message: 'Property not found.' });
        }

        // Check for existing appointment
        const [appointments] = await db.query(`
            SELECT 
                appointmentID, 
                appointmentDate, 
                appointmentTime, 
                appointmentStatus,
                DATE_FORMAT(appointmentDate, '%Y-%m-%d') as formattedDate,
                DATE_FORMAT(appointmentTime, '%h:%i %p') as formattedTime
            FROM appointment 
            WHERE userID = ? 
            AND propertyID = ?
            AND appointmentStatus != 'cancelled'
            ORDER BY appointmentDate DESC, appointmentTime DESC
            LIMIT 1
        `, [userID, propertyID]);

        if (appointments.length > 0) {
            const appointment = appointments[0];
            return res.status(200).json({ 
                exists: true,
                appointment: {
                    appointmentDate: appointment.formattedDate,
                    appointmentTime: appointment.formattedTime,
                    status: appointment.appointmentStatus
                }
            });
        }

        res.status(200).json({ exists: false });
    } catch (error) {
        console.error('Error checking appointment:', error);
        res.status(500).json({ message: 'Error checking appointment status.', error });
    }
};

// Add to your appointmentController.js

// Get single appointment details
export const getAppointmentDetails = async (req, res) => {
    const { appointmentID } = req.params;

    try {
        const [appointments] = await db.query(`
            SELECT a.*, 
                   p.propertyTitle, p.propertyAddress,
                   CONCAT(u.userFirstName, ' ', u.userLastName) as otherPartyName,
                   u.userContact as otherPartyContact
            FROM appointment a
            JOIN property p ON a.propertyID = p.propertyID
            JOIN users u ON 
                (${req.user.role === 'buyer' ? 'p.userID' : 'a.userID'} = u.userID)
            WHERE a.appointmentID = ?
        `, [appointmentID]);

        if (appointments.length === 0) {
            return res.status(404).json({ message: 'Appointment not found' });
        }

        const appointment = appointments[0];
        
        // Format for frontend
        const response = {
            ...appointment,
            formattedDate: new Date(appointment.appointmentDate).toISOString().split('T')[0],
            formattedTime: formatTimeForDisplay(appointment.appointmentTime)
        };

        res.status(200).json(response);
    } catch (error) {
        console.error('Error fetching appointment:', error);
        res.status(500).json({ message: 'Error fetching appointment details', error });
    }
};

// Update appointment date/time
export const updateAppointment = async (req, res) => {
    const { appointmentID } = req.params;
    const { appointmentDate, appointmentTime, userID, userRole } = req.body;

    if (!appointmentDate || !appointmentTime || !userID || !userRole) {
        return res.status(400).json({ message: 'Date, time, user ID, and user role are required' });
    }

    try {
        // Get the appointment details first
        const [appointment] = await db.query(
            'SELECT a.*, p.userID as propertyOwner FROM appointment a JOIN property p ON a.propertyID = p.propertyID WHERE a.appointmentID = ?',
            [appointmentID]
        );

        if (appointment.length === 0) {
            return res.status(404).json({ message: 'Appointment not found' });
        }

        // Authorization check
        if (userRole === 'buyer') {
            if (appointment[0].userID !== parseInt(userID)) {
                return res.status(403).json({ message: 'Unauthorized to update this appointment' });
            }
        } else if (userRole === 'seller') {
            if (appointment[0].propertyOwner !== parseInt(userID)) {
                return res.status(403).json({ message: 'Unauthorized to update this appointment' });
            }
        } else {
            return res.status(403).json({ message: 'Invalid user role' });
        }

        // Check if status allows editing
        if (appointment[0].appointmentStatus !== 'pending') {
            return res.status(400).json({ 
                message: 'Only pending appointments can be modified' 
            });
        }

        // Parse the date and time to ensure proper format
        const formattedDate = new Date(appointmentDate).toISOString().split('T')[0];
        const formattedTime = appointmentTime.includes(':') 
            ? appointmentTime.split(':').slice(0, 2).join(':')
            : appointmentTime;

        // Check time slot availability
        const isAvailable = await isTimeSlotAvailable(
            appointment[0].propertyID,
            formattedDate,
            formattedTime,
            appointmentID
        );

        if (!isAvailable) {
            return res.status(409).json({ 
                message: 'This time slot is already booked' 
            });
        }

        // Update the appointment
        await db.query(`
            UPDATE appointment 
            SET appointmentDate = ?, appointmentTime = ?
            WHERE appointmentID = ?
        `, [`${formattedDate}T00:00:00.000Z`, `${formattedTime}:00`, appointmentID]);

        // Get updated appointment for response
        const [updated] = await db.query(`
            SELECT * FROM appointment WHERE appointmentID = ?
        `, [appointmentID]);

        res.status(200).json({
            message: 'Appointment updated successfully',
            appointment: updated[0]
        });
    } catch (error) {
        console.error('Error updating appointment:', error);
        res.status(500).json({ message: 'Error updating appointment', error: error.message });
    }
};

// Helper function to format time for display
function formatTimeForDisplay(time) {
    if (!time) return '';
    
    // If already in AM/PM format, return as-is
    if (time.includes('AM') || time.includes('PM')) {
        return time;
    }
    
    // Convert 24-hour to 12-hour format
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours, 10);
    const suffix = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    
    return `${displayHour}:${minutes} ${suffix}`;
}
