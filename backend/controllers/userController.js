import db from '../config/db.js';

// **Get User Profile**
export const getUser = (req, res) => {
  const userId = req.params.id;
  const sql = "SELECT userFirstName, userLastName, userContact, userEmail, userAge, role FROM users WHERE userID = ?";

  db.query(sql, [userId], (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Error fetching user details" });
    }
    if (result.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(result[0]);
  });
};

// **Update User Profile**
export const updateUser = (req, res) => {
    const { userFirstName, userLastName, userContact, userEmail, userAge } = req.body;
    const userId = req.params.id; 
    
    if (!userFirstName || !userLastName || !userContact || !userEmail || !userAge) {
      return res.status(400).json({ message: "All fields are required." });
    }
  
    const sql = "UPDATE users SET userFirstName=?, userLastName=?, userContact=?, userEmail=?, userAge=? WHERE userID=?";
  
    db.query(sql, [userFirstName, userLastName, userContact, userEmail, userAge, userId], (err, result) => {
      if (err) {
        return res.status(500).json({ error: "Error updating user profile" });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "User not found." });
      }
      res.json({ message: "Profile updated successfully." });
    });
  };
  
