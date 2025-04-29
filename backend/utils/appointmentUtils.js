
import db from '../config/db.js'; 

export const isTimeSlotAvailable = async (propertyID, date, time) => {
    try {
        const [existingAppointments] = await db.query(`
            SELECT appointmentTime 
            FROM appointment 
            WHERE propertyID = ? 
            AND appointmentDate = ? 
            AND appointmentStatus = 'confirmed'
        `, [propertyID, date]);

        // Convert time to minutes 
        const requestedTime = convertTimeToMinutes(time);
        
        for (const appointment of existingAppointments) {
            const bookedTime = convertTimeToMinutes(appointment.appointmentTime);
            
            if (Math.abs(requestedTime - bookedTime) < 60) {
                return false; 
            }
        }
        
        return true; 
    } catch (error) {
        console.error('Error checking time slot:', error);
        throw error;
    }
};

const convertTimeToMinutes = (timeString) => {
    const [hours, minutes] = timeString.split(':').map(Number);
    return hours * 60 + minutes;
};