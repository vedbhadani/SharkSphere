import { verifyToken } from '../utils/jwt.js';
import prisma from '../config/db.js';

export const authenticate = async (req, res, next) => {
  try {
    // Step 1: Get token from header (format: "Bearer token123")
    const authHeader = req.headers.authorization;

    // Step 2: Check if token exists
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'No token provided'
      });
    }

    const token = authHeader.split(' ')[1]; // Extract token after "Bearer "

    // Step 3: Verify token using verifyToken()
    const { valid, decoded } = verifyToken(token);

    // Step 4: If invalid, return 401
    if (!valid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired token'
      });
    }

    // Step 5: Find user by ID from token
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { // Exclude password!
        id: true,
        email: true,
        name: true,
        emailVerified: true,
        role: true,
        createdAt: true,
        updatedAt: true
      }
    });

    // Step 6: If user doesn't exist, return 401
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found'
      });
    }

    // Step 7: Attach user to req.user (exclude password!)
    req.user = user;

    // Step 8: Call next() to continue to the controller
    next();

  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(401).json({
      success: false,
      message: 'Authentication failed'
    });
  }
};