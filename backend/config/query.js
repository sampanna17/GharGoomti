import db from './db.js';

let dbQueries = {};

dbQueries.register_user = (userData) => {
  const { userName, userAge, userContact, userEmail, role, password } = userData;
  const query = `
    INSERT INTO user (userName, userAge, userContact, userEmail, role, password)
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  return execute(query, [userName, userAge, userContact, userEmail, role, password]);
};

dbQueries.get_user_by_email = (userEmail) => {
  const query = `SELECT userID, userEmail FROM details WHERE userEmail = ?`;
  return execute(query, [userEmail]);
};

dbQueries.update_forgot_password_token = (userID, token) => {
  const expiresAt = new Date(Date.now() + 60 * 60 * 24 * 1000).toISOString();
  const query = `
    UPDATE users 
    SET reset_password_token = ?, reset_token_expiry = ? 
    WHERE userID = ?
  `;
  return execute(query, [token, expiresAt, userID]);
};

dbQueries.get_password_reset_token = (id) => {
  const query = `
    SELECT reset_password_token, reset_token_expiry 
    FROM users 
    WHERE userID = ? 
    ORDER BY created_at DESC 
    LIMIT 1
  `;
  return execute(query, [id]);
};

dbQueries.update_password_reset_token = (id) => {
  const query = `
    UPDATE details 
    SET reset_password_token = NULL, reset_token_expiry = NULL 
    WHERE userID = ?
  `;
  return execute(query, [id]);
};

dbQueries.update_user_password = (userID, password) => {
  const query = `
    UPDATE details 
    SET password = ? 
    WHERE userID = ?
  `;
  return execute(query, [password, userID]);
};

export default dbQueries;
