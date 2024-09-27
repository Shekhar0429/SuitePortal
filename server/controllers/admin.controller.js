import { Low, JSONFile } from 'lowdb';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const file = new JSONFile('db.json');
const db = new Low(file);

await db.read();

// Controller funvtion to login a admin
export const login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const admin = await findAdmin(username);
    if (admin && bcrypt.compareSync(password, admin.password)) {
      const token = jwt.sign({ username: admin.username }, process.env.SECRET_KEY);
      res.status(201).json({ token });
    } else {
      res.status(403).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    next(error);
  }
};

// helper function
export const findAdmin = async (username) => {
  return db.data.admins.find((admin) => admin.username === username);
};

// Controller function to add admin.
export const addAdmin = async (req, res, next) => {
  try {
    // Validate input

    if (!req.body.username || !req.body.password) {
      return res.status(400).json({
        status: 'failed',
        message: 'Invalid input',
      });
    }

    const { username, password } = req.body;

    // Check if admin already exists
    if (db.data.admins.some((admin) => admin.username === username)) {
      return res.status(409).json({
        status: 'failed',
        message: 'Admin with this username already exists',
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new admin
    const newAdmin = {
      username,
      password: hashedPassword,
      createdAt: new Date().toISOString(),
    };

    // Add to database
    db.data.admins.push(newAdmin);
    await db.write();

    // Send response
    res.status(201).json({
      status: 'success',
      message: 'Admin registered successfully',
      data: {
        username: newAdmin.username,
        createdAt: newAdmin.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};
