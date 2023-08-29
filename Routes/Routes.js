import express from 'express';
import passport from 'passport';
import users from './Users.js';
import companys from './Companys.js';
import login from './Login.js';
import isLoggedIn from './isLoggedIn.js';
import licences from './Licences.js';
import articles from './Articles.js';
import signup from './Signup.js'
import locations from './Locations.js';
import orders from './Orders.js';
import dotenv from "dotenv";
dotenv.config();

const router = express.Router();

/**
 * @swagger
 * 
 * /:
 *   get:
 *     summary: Bienvenue sur l'API d'Inventory
 *     description: Bienvenue sur l'API d'Inventory
 *     tags:
 *       - Home
 *     responses:
 *       200:
 *         description: Bienvenue sur l'API d'Inventory
 */
router.get('/', (req, res) => res.status(200).json({message : 'Welcome to Inventory API'}));


// PUBLICS ROUTES
router.use('/login', login);
router.use('/signup', signup);

// PRIVATES ROUTES
router.use('/isloggedin', isLoggedIn);
router.use('/users', passport.authenticate('jwt', { session: false }), users);
router.use('/companys', passport.authenticate('jwt', { session: false }), companys);
router.use('/licences', passport.authenticate('jwt', { session: false }), licences);
router.use('/articles', passport.authenticate('jwt', { session: false }), articles);
router.use('/locations', passport.authenticate('jwt', { session: false }), locations);
router.use('/orders', passport.authenticate('jwt', { session: false }), orders);

export default router;