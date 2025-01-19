import db from './db.js'; 

export const registerQuery = (userData, callback) => {
  const { userName, userAge, userContact, userEmail, role, password } = userData;

  const query = `
    INSERT INTO user (userName, userAge, userContact, userEmail, role, password)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.query(query, [userName, userAge, userContact, userEmail, role, password], (err, results) => {
    if (err) {
      console.error('Error inserting user:', err);
      return callback(err, null); 
    }
    console.log('User registered successfully:', results);
    callback(null, results); 
  });
};
