import bcrypt from 'bcryptjs';

const users = [
  {
    name: 'Admin User',
    email: 'admin@lumora.com',
    password: 'password123', // Will be hashed in seeder
    phone: '1234567890',
    isAdmin: true,
  },
  {
    name: 'John Doe',
    email: 'john@example.com',
    password: 'password123',
    phone: '0987654321',
    isAdmin: false,
  },
  {
    name: 'Jane Doe',
    email: 'jane@example.com',
    password: 'password123',
    phone: '5555555555',
    isAdmin: false,
  },
];

export default users;
