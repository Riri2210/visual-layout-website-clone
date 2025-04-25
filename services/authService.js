const fs = require('fs').promises;
const path = require('path');
const crypto = require('crypto');
const { generateTemporaryPassword, sendRegistrationEmail } = require('./emailService');

// Path to users data file
const dataDirectory = path.join(__dirname, '..', 'src', 'data');
const usersFilePath = path.join(dataDirectory, 'users.json');

/**
 * Ensures the users file exists
 */
async function ensureUsersFile() {
  try {
    // Ensure data directory exists
    try {
      await fs.access(dataDirectory);
    } catch (error) {
      await fs.mkdir(dataDirectory, { recursive: true });
    }
    
    // Check if users file exists, create if not
    try {
      await fs.access(usersFilePath);
    } catch (error) {
      await fs.writeFile(usersFilePath, '[]');
    }
  } catch (error) {
    console.error('Error ensuring users file:', error);
    throw error;
  }
}

/**
 * Hashes a password with a salt
 * @param {string} password - The password to hash
 * @returns {Object} The salt and hashed password
 */
function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto
    .pbkdf2Sync(password, salt, 1000, 64, 'sha512')
    .toString('hex');
  return { salt, hash };
}

/**
 * Verifies a password against a hash
 * @param {string} password - The password to verify
 * @param {string} hash - The stored hash
 * @param {string} salt - The stored salt
 * @returns {boolean} Whether the password is valid
 */
function verifyPassword(password, hash, salt) {
  const candidateHash = crypto
    .pbkdf2Sync(password, salt, 1000, 64, 'sha512')
    .toString('hex');
  return candidateHash === hash;
}

/**
 * Creates a new user and sends registration email
 * @param {Object} userData - User data
 * @returns {Promise<Object>} The created user (without sensitive fields)
 */
async function registerUser(userData) {
  try {
    await ensureUsersFile();
    
    const { email, name, role = 'user' } = userData;
    
    // Read existing users
    const data = await fs.readFile(usersFilePath, 'utf8');
    const users = JSON.parse(data);
    
    // Check if user already exists
    const existingUser = users.find(user => user.email === email);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }
    
    // Generate temporary password
    const tempPassword = generateTemporaryPassword();
    const { salt, hash } = hashPassword(tempPassword);
    
    // Create new user
    const newUser = {
      id: crypto.randomUUID(),
      email,
      name,
      role,
      passwordHash: hash,
      passwordSalt: salt,
      passwordTemporary: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    // Save user
    users.push(newUser);
    await fs.writeFile(usersFilePath, JSON.stringify(users, null, 2));
    
    // Send registration email
    await sendRegistrationEmail({ email, name }, tempPassword);
    
    // Return user without sensitive fields
    const { passwordHash, passwordSalt, ...userWithoutSensitiveData } = newUser;
    return userWithoutSensitiveData;
  } catch (error) {
    console.error('Error registering user:', error);
    throw error;
  }
}

/**
 * Changes a user's password
 * @param {string} userId - The user's ID
 * @param {string} newPassword - The new password
 * @returns {Promise<Object>} The updated user (without sensitive fields)
 */
async function changePassword(userId, newPassword) {
  try {
    await ensureUsersFile();
    
    // Read existing users
    const data = await fs.readFile(usersFilePath, 'utf8');
    const users = JSON.parse(data);
    
    // Find user
    const userIndex = users.findIndex(user => user.id === userId);
    if (userIndex === -1) {
      throw new Error('User not found');
    }
    
    // Update password
    const { salt, hash } = hashPassword(newPassword);
    users[userIndex].passwordHash = hash;
    users[userIndex].passwordSalt = salt;
    users[userIndex].passwordTemporary = false;
    users[userIndex].updatedAt = new Date().toISOString();
    
    // Save users
    await fs.writeFile(usersFilePath, JSON.stringify(users, null, 2));
    
    // Return updated user without sensitive fields
    const { passwordHash, passwordSalt, ...userWithoutSensitiveData } = users[userIndex];
    return userWithoutSensitiveData;
  } catch (error) {
    console.error('Error changing password:', error);
    throw error;
  }
}

/**
 * Authenticates a user by email and password
 * @param {string} email - The user's email
 * @param {string} password - The user's password
 * @returns {Promise<Object>} The authenticated user (without sensitive fields)
 */
async function authenticateUser(email, password) {
  try {
    await ensureUsersFile();
    
    // Read existing users
    const data = await fs.readFile(usersFilePath, 'utf8');
    const users = JSON.parse(data);
    
    // Find user
    const user = users.find(user => user.email === email);
    if (!user) {
      throw new Error('Invalid email or password');
    }
    
    // Verify password
    const isValid = verifyPassword(password, user.passwordHash, user.passwordSalt);
    if (!isValid) {
      throw new Error('Invalid email or password');
    }
    
    // Return user without sensitive fields
    const { passwordHash, passwordSalt, ...userWithoutSensitiveData } = user;
    return userWithoutSensitiveData;
  } catch (error) {
    console.error('Error authenticating user:', error);
    throw error;
  }
}

module.exports = {
  registerUser,
  changePassword,
  authenticateUser
};
