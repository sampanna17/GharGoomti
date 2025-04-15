import db from '../config/db.js';

export const getDashboardStats = async (req, res) => {
    try {
        // Get total properties count
        const [propertiesResult] = await db.query('SELECT COUNT(*) as count FROM property');
        const totalProperties = propertiesResult[0].count;

        // Get total users count
        const [usersResult] = await db.query('SELECT COUNT(*) as count FROM users');
        const totalUsers = usersResult[0].count;

        // Get subscribed users count
        const [subscribedResult] = await db.query('SELECT COUNT(*) as count FROM users WHERE hasSubscribed = TRUE');
        const totalSubscribedUsers = subscribedResult[0].count;

        res.json({
            success: true,
            data: {
                totalProperties,
                totalUsers,
                totalSubscribedUsers
            }
        });
    } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching dashboard statistics'
        });
    }
};