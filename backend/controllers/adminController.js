import db from '../config/db.js';

export const getDashboardStats = async (req, res) => {
  try {
    const [propertiesResult] = await db.query('SELECT COUNT(*) as count FROM property');
    const totalProperties = propertiesResult[0].count;

    const [usersResult] = await db.query('SELECT COUNT(*) as count FROM users');
    const totalUsers = usersResult[0].count;

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

export const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const [user] = await db.query('SELECT userID FROM users WHERE userID = ?', [id]);

    if (user.length === 0) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Delete the user
    await db.query('DELETE FROM users WHERE userID = ?', [id]);
    res.status(200).json({ message: 'User deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting user.', error });
  }
};

export const countPropertyByTypes = async (req, res) => {
  try {
    const [result] = await db.query(`
      SELECT propertyType, COUNT(*) as count
      FROM property
      GROUP BY propertyType
    `);

    const types = ['Apartment', 'Building', 'Flat'];
    const typeCounts = {};

    types.forEach(type => {
      typeCounts[type] = 0;
    });

    result.forEach(row => {
      if (typeCounts.hasOwnProperty(row.propertyType)) {
        typeCounts[row.propertyType] = row.count;
      }
    });

    res.json({
      success: true,
      data: typeCounts
    });
  } catch (error) {
    console.error('Error counting properties by type:', error);
    res.status(500).json({
      success: false,
      message: 'Error counting properties by type'
    });
  }
};

export const countUsersByRoles = async (req, res) => {
  try {
    const [result] = await db.query(`
      SELECT role, COUNT(*) as count
      FROM users
      GROUP BY role
    `);

    const roles = ['buyer', 'seller', 'admin'];
    const roleCounts = {};

    roles.forEach(role => {
      roleCounts[role] = 0;
    });

    result.forEach(row => {
      if (roleCounts.hasOwnProperty(row.role)) {
        roleCounts[row.role] = row.count;
      }
    });

    res.json({
      success: true,
      data: roleCounts
    });
  } catch (error) {
    console.error('Error counting users by role:', error);
    res.status(500).json({
      success: false,
      message: 'Error counting users by role'
    });
  }
};


export const getPropertiesOverTime = async (req, res) => {
  try {
    const { range = 'week' } = req.query;
    let query;

    switch (range) {
      case 'day':
        query = `
          SELECT 
            DATE(created_at) as date,
            COUNT(*) as count
          FROM property
          GROUP BY DATE(created_at)
          ORDER BY DATE(created_at)
        `;
        break;
      case 'week':
        query = `
          SELECT 
            YEAR(created_at) as year,
            WEEK(created_at) as week,
            COUNT(*) as count
          FROM property
          GROUP BY YEAR(created_at), WEEK(created_at)
          ORDER BY YEAR(created_at), WEEK(created_at)
        `;
        break;
      case 'month':
        query = `
          SELECT 
            YEAR(created_at) as year,
            MONTH(created_at) as month,
            COUNT(*) as count
          FROM property
          GROUP BY YEAR(created_at), MONTH(created_at)
          ORDER BY YEAR(created_at), MONTH(created_at)
        `;
        break;
      default:
        return res.status(400).json({
          success: false,
          message: 'Invalid time range specified'
        });
    }

    const [result] = await db.query(query);
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Error fetching properties over time:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching properties over time'
    });
  }
};