
import db from '../config/db.js'; 

// Controller for adding an appointment
export const addAppointment = async (req, res) => {
    const { userID, propertyID, appointmentDate, appointmentTime, notes } = req.body;

    // Inputy validation 
    if (!userID || !propertyID || !appointmentDate || !appointmentTime) {
        return res.status(400).json({ message: 'User ID, Property ID, Date, and Time are required.' });
    }

    try {
        const query = `
            INSERT INTO appointment (userID, propertyID, appointmentDate, appointmentTime, notes, appointmentStatus, created_at)
            VALUES (?, ?, ?, ?, ?, 'pending', NOW())
        `;
        const [result] = await db.query(query, [userID, propertyID, appointmentDate, appointmentTime, notes || null]);

        // Respond with the appointment ID and success message
        res.status(201).json({ message: 'Appointment booked successfully.', appointmentID: result.insertId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error booking appointment.', error });
    }
};

// Controller to get all appointments
export const getUserAppointments = async (req, res) => {
    const { userID } = req.params;

    try {
        // Query to fetch appointments for the given user
        const [appointments] = await db.query('SELECT * FROM appointment WHERE userID = ?', [userID]);

        // If no appointments found
        if (appointments.length === 0) {
            return res.status(404).json({ message: 'No appointments found for this user.' });
        }

        // Return the list of appointments
        res.status(200).json({ appointments });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error retrieving appointments.', error });
    }
};

// Controller to update the status of an appointment
export const updateAppointmentStatus = async (req, res) => {
    const { appointmentID, status } = req.body;

    // Validate input
    if (!appointmentID || !status) {
        return res.status(400).json({ message: 'Appointment ID and status are required.' });
    }

    // Validate status
    if (!['pending', 'confirmed', 'completed', 'cancelled'].includes(status)) {
        return res.status(400).json({ message: 'Invalid status.' });
    }

    try {
        console.log('Updating appointment status:', status, 'for appointmentID:', appointmentID);

        const query = 'UPDATE appointment SET appointmentStatus = ? WHERE appointmentID = ?';
        const [result] = await db.query(query, [status, appointmentID]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Appointment not found.' });
        }

        res.status(200).json({ message: `Appointment status updated to ${status}.` });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating appointment status.', error });
    }
};

// Controller to remove an appointment
export const removeAppointment = async (req, res) => {
    const { appointmentID } = req.body;

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


