// Interface untuk data pengguna
export interface User {
  npsn: string;
  email: string;
  password: string;
  createdAt: string;
  role?: 'admin' | 'user';  // Added role field
  name?: string;  // Added name field for display
  firstLogin?: boolean;  // Track if this is the first login
}

// Fungsi untuk memeriksa apakah pengguna sudah login
export const isAuthenticated = (): boolean => {
  const user = sessionStorage.getItem('currentUser');
  return user !== null && JSON.parse(user).isLoggedIn === true;
};

// Fungsi untuk mendapatkan data pengguna saat ini
export const getCurrentUser = (): User | null => {
  const currentUserData = sessionStorage.getItem('currentUser');
  if (!currentUserData) {
    return null;
  }
  
  const sessionUser = JSON.parse(currentUserData);
  
  // Find the full user record from localStorage
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  const userRecord = users.find((u: User) => u.email === sessionUser.email);
  
  return userRecord || null;
};

// Fungsi untuk mendapatkan role pengguna saat ini
export const getCurrentUserRole = (): string | null => {
  const currentUser = getCurrentUser();
  return currentUser?.role || null;
};

// Fungsi untuk memeriksa apakah pengguna memiliki role tertentu
export const hasRole = (requiredRole: string): boolean => {
  const role = getCurrentUserRole();
  return role === requiredRole;
};

// Fungsi untuk login
export const login = (email: string, password: string): Promise<User> => {
  return new Promise((resolve, reject) => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find((u: User) => u.email === email);
    
    if (!user) {
      reject(new Error('Email tidak terdaftar'));
      return;
    }
    
    if (user.password !== password) {
      reject(new Error('Kata sandi tidak valid'));
      return;
    }
    
    // Store user data in sessionStorage
    sessionStorage.setItem('currentUser', JSON.stringify({
      email: user.email,
      npsn: user.npsn,
      name: user.name,
      role: user.role,
      firstLogin: user.firstLogin,
      isLoggedIn: true
    }));
    
    resolve(user);
  });
};

// Fungsi untuk logout
export const logout = (): void => {
  sessionStorage.removeItem('currentUser');
};

// Fungsi untuk registrasi
export const register = (npsn: string, email: string, role: 'admin' | 'user' = 'user'): Promise<{ user: User, tempPassword: string }> => {
  return new Promise((resolve, reject) => {
    try {
      // Cek apakah email sudah terdaftar
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const existingUser = users.find((user: User) => user.email === email);
      
      if (existingUser) {
        reject(new Error('Email sudah terdaftar'));
        return;
      }
      
      // Generate temporary password
      const tempPassword = generateTempPassword();
      
      // Buat user baru
      const newUser: User = {
        npsn,
        email,
        password: tempPassword,
        createdAt: new Date().toISOString(),
        role,
        firstLogin: true
      };
      
      // Simpan ke localStorage
      users.push(newUser);
      localStorage.setItem('users', JSON.stringify(users));
      
      resolve({ user: newUser, tempPassword });
    } catch (error) {
      reject(error);
    }
  });
};

// Fungsi untuk mengganti password
export const changePassword = (email: string, oldPassword: string, newPassword: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    try {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const userIndex = users.findIndex((u: User) => u.email === email);
      
      if (userIndex === -1) {
        reject(new Error('Email tidak terdaftar'));
        return;
      }
      
      if (users[userIndex].password !== oldPassword) {
        reject(new Error('Kata sandi lama tidak valid'));
        return;
      }
      
      // Update password
      users[userIndex].password = newPassword;
      localStorage.setItem('users', JSON.stringify(users));
      
      resolve();
    } catch (error) {
      reject(error);
    }
  });
};

// Fungsi untuk update profil pengguna
export const updateUserProfile = (email: string, updates: Partial<User>): Promise<User> => {
  return new Promise((resolve, reject) => {
    try {
      // Get users from localStorage
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const userIndex = users.findIndex((u: User) => u.email === email);
      
      if (userIndex === -1) {
        reject(new Error('Pengguna tidak ditemukan'));
        return;
      }
      
      // Update user data
      const updatedUser = {
        ...users[userIndex],
        ...updates
      };
      
      users[userIndex] = updatedUser;
      localStorage.setItem('users', JSON.stringify(users));
      
      // Update session storage if this is the current user
      const currentUser = sessionStorage.getItem('currentUser');
      if (currentUser) {
        const currentUserData = JSON.parse(currentUser);
        if (currentUserData.email === email) {
          sessionStorage.setItem('currentUser', JSON.stringify({
            ...currentUserData,
            ...updates
          }));
        }
      }
      
      resolve(updatedUser);
    } catch (error) {
      reject(error);
    }
  });
};

// Generate random temporary password
const generateTempPassword = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let tempPassword = '';
  for (let i = 0; i < 8; i++) {
    tempPassword += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return tempPassword;
};

// Simulasi email service
export const sendTempPasswordEmail = (email: string, tempPassword: string): Promise<void> => {
  return new Promise((resolve) => {
    // Simulasi pengiriman email
    console.log(`Sending email to ${email} with temporary password: ${tempPassword}`);
    
    // Dalam aplikasi nyata, di sini akan memanggil API untuk mengirim email
    setTimeout(() => {
      resolve();
    }, 1000);
  });
};
