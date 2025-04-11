import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaCalendarAlt, FaClock, FaCheck, FaTimes, FaEdit, FaTrash } from 'react-icons/fa';
import Calendar from "../assets/SinglePage/calendar.png";

const AppointmentsTab = ({ userID, role, userFirstName, userLastName }) => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingAppointment, setEditingAppointment] = useState(null);
    const [newDate, setNewDate] = useState('');
    const [newTime, setNewTime] = useState('');

    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                const response = await axios.get(
                    `http://localhost:8000/api/appointment/user/${userID}`
                );
                setAppointments(response.data.appointments);
            } catch (error) {
                console.error('Error fetching appointments:', error);
            } finally {
                setLoading(false);
            }
        };

        if (userID) {
            fetchAppointments();
        }
    }, [userID]);

    const handleStatusUpdate = async (appointmentId, newStatus) => {
        try {
            await axios.put(
                `http://localhost:8000/api/appointment/seller/${appointmentId}/status`,
                { status: newStatus ,
                    sellerID: userID
                }
            );

            setAppointments(prev => prev.map(app =>
                app.appointmentID === appointmentId
                    ? { ...app, appointmentStatus: newStatus }
                    : app
            ));
            toast.success(`Appointment ${newStatus}`);
        } catch (error) {
            console.error('Error updating status:', error);
            toast.error('Failed to update status');
        }
    };

    const handleDeleteAppointment = async (appointmentId) => {
        if (window.confirm('Are you sure you want to delete this appointment?')) {
            try {
                await axios.delete(
                    `http://localhost:8000/api/appointment/${appointmentId}`
                );
                
                setAppointments(prev => prev.filter(
                    app => app.appointmentID !== appointmentId
                ));
                toast.success('Appointment deleted successfully');
            } catch (error) {
                console.error('Error deleting appointment:', error);
                toast.error('Failed to delete appointment');
            }
        }
    };

    const handleEditClick = (appointment) => {
        setEditingAppointment(appointment.appointmentID);
        setNewDate(appointment.appointmentDate.split('T')[0]);
        setNewTime(appointment.appointmentTime.substring(0, 5));
    };

    const handleUpdateAppointment = async (appointmentId) => {
        try {
            await axios.put(
                `http://localhost:8000/api/appointment/${appointmentId}`,
                {
                    appointmentDate: `${newDate}T${newTime}:00.000Z`,
                    appointmentTime: `${newTime}:00`,
                    userID: userID,
                    userRole: role
                }
            );

            setAppointments(prev => prev.map(app =>
                app.appointmentID === appointmentId
                    ? {
                        ...app,
                        appointmentDate: `${newDate}T${newTime}:00.000Z`,
                        appointmentTime: `${newTime}:00`
                    }
                    : app
            ));
            setEditingAppointment(null);
            toast.success('Appointment updated successfully');
        } catch (error) {
            console.error('Error updating appointment:', error);
            toast.error('Failed to update appointment');
        }
    };

    const formatTime = (time) => {
        if (!time) return '';
        const [hours, minutes] = time.split(':');
        const hourNum = parseInt(hours, 10);

        if (hourNum === 0) {
            return `12:${minutes} AM`;
        } else if (hourNum < 12) {
            return `${hourNum}:${minutes} AM`;
        } else if (hourNum === 12) {
            return `12:${minutes} PM`;
        } else {
            return `${hourNum - 12}:${minutes} PM`;
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    if (loading) {
        return (
            <div className="flex justify-center py-8">
                <p>Loading appointments...</p>
            </div>
        );
    }

    if (appointments.length === 0) {
        return (
            <div className="text-center py-8">
                <p className="text-gray-600">No appointments found</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {appointments.map((appointment) => (
                <div key={appointment.appointmentID} className="p-4 border rounded-lg bg-white shadow-sm">
                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className="font-semibold text-lg">
                                {role === 'buyer'
                                    ? `Property: ${appointment.propertyTitle}`
                                    : `Buyer: ${userFirstName} ${userLastName}`}
                            </h3>
                            <div className="flex items-center mt-2 text-gray-600">
                                <FaCalendarAlt className="mr-2" />
                                <span>{formatDate(appointment.appointmentDate)}</span>
                            </div>
                            <div className="flex items-center mt-1 text-gray-600">
                                <FaClock className="mr-2" />
                                <span>{formatTime(appointment.appointmentTime)}</span>
                            </div>
                            <div className="mt-2">
                                <span className={`px-2 py-1 rounded text-sm font-medium ${
                                    appointment.appointmentStatus === 'pending' 
                                        ? 'bg-yellow-100 text-yellow-800' 
                                        : appointment.appointmentStatus === 'confirmed' 
                                            ? 'bg-green-100 text-green-800' 
                                            : 'bg-red-100 text-red-800'
                                }`}>
                                    {appointment.appointmentStatus.charAt(0).toUpperCase() + appointment.appointmentStatus.slice(1)}
                                </span>
                            </div>
                            <div className="mt-2 text-sm text-gray-600">
                                <p>Address: {appointment.propertyAddress}, {appointment.propertyCity}</p>
                                {role === 'buyer' && (
                                    <>
                                        <p>Seller: {appointment.sellerName}</p>
                                        <p>Contact: {appointment.sellerContact}</p>
                                    </>
                                )}
                            </div>
                        </div>

                        {role === 'seller' && (
                            <div className="flex space-x-2">
                                {appointment.appointmentStatus === 'pending' && (
                                    <>
                                        <button
                                            onClick={() => handleStatusUpdate(appointment.appointmentID, 'confirmed')}
                                            className="p-2 bg-green-100 text-green-700 rounded hover:bg-green-200"
                                            title="Confirm"
                                        >
                                            <FaCheck />
                                        </button>
                                        <button
                                            onClick={() => handleStatusUpdate(appointment.appointmentID, 'cancelled')}
                                            className="p-2 bg-red-100 text-red-700 rounded hover:bg-red-200"
                                            title="Cancel"
                                        >
                                            <FaTimes />
                                        </button>
                                    </>
                                )}
                            </div>
                        )}

                        {role === 'buyer' && appointment.appointmentStatus === 'pending' && (
                            <div className="flex space-x-2">
                                <button
                                    onClick={() => handleEditClick(appointment)}
                                    className="p-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                                    title="Edit"
                                >
                                    <FaEdit />
                                </button>
                                <button
                                    onClick={() => handleDeleteAppointment(appointment.appointmentID)}
                                    className="p-2 bg-red-100 text-red-700 rounded hover:bg-red-200"
                                    title="Delete"
                                >
                                    <FaTrash />
                                </button>
                            </div>
                        )}
                    </div>

                    {editingAppointment === appointment.appointmentID && (
                        <div className="mt-4 pt-4 border-t">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                                    <div className="relative">
                                        <input
                                            type="date"
                                            value={newDate}
                                            onChange={(e) => setNewDate(e.target.value)}
                                            className="p-2 pr-8 outline-none bg-transparent border border-gray-300 rounded-md appearance-none w-full"
                                            min={new Date().toISOString().split('T')[0]}
                                        />
                                        <img
                                            src={Calendar}
                                            alt="Calendar"
                                            className="absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer"
                                            style={{ width: "18px", height: "18px" }}
                                            onClick={() => document.querySelector('input[type="date"]').showPicker()}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                                    <select
                                        value={newTime}
                                        onChange={(e) => setNewTime(e.target.value)}
                                        className="w-full px-3 py-2 border rounded-md"
                                    >
                                        <option value="">Select Time</option>
                                        {['10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'].map(time => (
                                            <option key={time} value={time}>{formatTime(time)}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="flex justify-end space-x-2 mt-4">
                                <button
                                    onClick={() => setEditingAppointment(null)}
                                    className="px-4 py-2 border rounded-md hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => handleUpdateAppointment(appointment.appointmentID)}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                                    disabled={!newDate || !newTime}
                                >
                                    Save Changes
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default AppointmentsTab;