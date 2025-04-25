const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
const { registerUser, changePassword, authenticateUser } = require('./services/authService');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Path ke direktori data
const dataDirectory = path.join(__dirname, 'src', 'data');
const invoicesFilePath = path.join(dataDirectory, 'invoices.json');
const settingsFilePath = path.join(dataDirectory, 'settings.json');
const transactionsFilePath = path.join(dataDirectory, 'transactions.json');

// Memastikan direktori data ada
async function ensureDataDirectory() {
  try {
    await fs.access(dataDirectory);
  } catch (error) {
    await fs.mkdir(dataDirectory, { recursive: true });
  }
}

// Memastikan file data ada
async function ensureDataFiles() {
  await ensureDataDirectory();
  
  try {
    await fs.access(invoicesFilePath);
  } catch (error) {
    await fs.writeFile(invoicesFilePath, '[]');
  }

  try {
    await fs.access(settingsFilePath);
  } catch (error) {
    await fs.writeFile(settingsFilePath, '{}');
  }

  try {
    await fs.access(transactionsFilePath);
  } catch (error) {
    await fs.writeFile(transactionsFilePath, '{}');
  }
}

// Router untuk faktur
app.get('/api/invoices', async (req, res) => {
  try {
    await ensureDataFiles();
    const data = await fs.readFile(invoicesFilePath, 'utf8');
    res.json(JSON.parse(data));
  } catch (error) {
    console.error('Error reading invoices:', error);
    res.status(500).json({ error: 'Failed to read invoices' });
  }
});

app.post('/api/invoices', async (req, res) => {
  try {
    await ensureDataFiles();
    const invoiceData = req.body;
    
    const data = await fs.readFile(invoicesFilePath, 'utf8');
    const invoices = JSON.parse(data);
    
    const existingIndex = invoices.findIndex(item => item.no_faktur === invoiceData.no_faktur);
    
    if (existingIndex >= 0) {
      invoices[existingIndex] = invoiceData;
    } else {
      invoices.push(invoiceData);
    }
    
    await fs.writeFile(invoicesFilePath, JSON.stringify(invoices, null, 2));
    res.status(201).json({ message: 'Invoice saved successfully', invoice: invoiceData });
  } catch (error) {
    console.error('Error saving invoice:', error);
    res.status(500).json({ error: 'Failed to save invoice' });
  }
});

app.delete('/api/invoices/:id', async (req, res) => {
  try {
    await ensureDataFiles();
    const invoiceId = req.params.id;
    
    const data = await fs.readFile(invoicesFilePath, 'utf8');
    let invoices = JSON.parse(data);
    
    invoices = invoices.filter(invoice => invoice.no_faktur !== invoiceId);
    
    await fs.writeFile(invoicesFilePath, JSON.stringify(invoices, null, 2));
    res.json({ message: 'Invoice deleted successfully' });
  } catch (error) {
    console.error('Error deleting invoice:', error);
    res.status(500).json({ error: 'Failed to delete invoice' });
  }
});

// Router untuk pengaturan
app.get('/api/settings', async (req, res) => {
  try {
    await ensureDataFiles();
    const data = await fs.readFile(settingsFilePath, 'utf8');
    res.json(JSON.parse(data));
  } catch (error) {
    console.error('Error reading settings:', error);
    res.status(500).json({ error: 'Failed to read settings' });
  }
});

app.post('/api/settings', async (req, res) => {
  try {
    await ensureDataFiles();
    const settingsData = req.body;
    await fs.writeFile(settingsFilePath, JSON.stringify(settingsData, null, 2));
    res.status(201).json({ message: 'Settings saved successfully' });
  } catch (error) {
    console.error('Error saving settings:', error);
    res.status(500).json({ error: 'Failed to save settings' });
  }
});

// Router untuk nomor transaksi
app.get('/api/transactions/:type', async (req, res) => {
  try {
    await ensureDataFiles();
    const type = req.params.type; // 'bos' or 'bop'
    const data = await fs.readFile(transactionsFilePath, 'utf8');
    const transactions = JSON.parse(data);
    
    const key = type === 'bos' ? 'lastBOSTransactionNumber' : 'lastBOPTransactionNumber';
    let nextNumber = '001';
    
    if (transactions[key]) {
      nextNumber = (parseInt(transactions[key]) + 1).toString().padStart(3, '0');
    }
    
    transactions[key] = nextNumber;
    await fs.writeFile(transactionsFilePath, JSON.stringify(transactions, null, 2));
    
    res.json({ nextNumber });
  } catch (error) {
    console.error('Error getting transaction number:', error);
    res.status(500).json({ error: 'Failed to get transaction number' });
  }
});

// User Authentication Routes
app.post('/api/auth/register', async (req, res) => {
  try {
    const userData = req.body;
    
    // Validate required fields
    if (!userData.email || !userData.name) {
      return res.status(400).json({ error: 'Email and name are required' });
    }
    
    // Register user and send email with temporary password
    const newUser = await registerUser(userData);
    res.status(201).json({ 
      message: 'User registered successfully. Check email for temporary password.', 
      user: newUser 
    });
  } catch (error) {
    console.error('Error registering user:', error);
    if (error.message === 'User with this email already exists') {
      return res.status(409).json({ error: error.message });
    }
    res.status(500).json({ error: 'Failed to register user' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
    
    // Authenticate user
    const user = await authenticateUser(email, password);
    res.json({ 
      message: 'Login successful', 
      user, 
      requirePasswordChange: user.passwordTemporary 
    });
  } catch (error) {
    console.error('Error authenticating user:', error);
    res.status(401).json({ error: 'Invalid email or password' });
  }
});

app.post('/api/auth/change-password', async (req, res) => {
  try {
    const { userId, newPassword } = req.body;
    
    // Validate required fields
    if (!userId || !newPassword) {
      return res.status(400).json({ error: 'User ID and new password are required' });
    }
    
    // Change password
    const updatedUser = await changePassword(userId, newPassword);
    res.json({ 
      message: 'Password changed successfully', 
      user: updatedUser 
    });
  } catch (error) {
    console.error('Error changing password:', error);
    res.status(500).json({ error: 'Failed to change password' });
  }
});

// Endpoint untuk sinkronisasi localStorage ke file
app.post('/api/sync/local-to-file', async (req, res) => {
  try {
    await ensureDataFiles();
    const invoicesData = req.body;
    
    if (Array.isArray(invoicesData)) {
      await fs.writeFile(invoicesFilePath, JSON.stringify(invoicesData, null, 2));
      res.json({ message: 'Data synchronized successfully from localStorage to file' });
    } else {
      res.status(400).json({ error: 'Invalid data format, expected array' });
    }
  } catch (error) {
    console.error('Error syncing localStorage to file:', error);
    res.status(500).json({ error: 'Failed to sync localStorage to file' });
  }
});

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'dist')));

// The "catchall" handler: for any request not handled above,
// serve the React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Mulai server
app.listen(PORT, () => {
  console.log(`Server berjalan di port ${PORT}`);
});
