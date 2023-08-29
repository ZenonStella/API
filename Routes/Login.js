import express from 'express';
import { loginWeb } from '../Controllers/Login/Web.js';
import { csrfProtection } from '../Helpers/csrfProtection.js';
import { corsProtection } from '../Helpers/corsProtection.js';

const router = express.Router();

/**
 * @swagger
 * /login/web:
 *   post:
 *     summary: Se connecter (Web)
 *     description: Se connecter à l'applications web. Route protégée par CORS. Renouvelle l'accessToken, le refreshToken et la session web pour l'utilisateur.
 *     tags:
 *       - Authentication
 *     consumes:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: body
 *         schema: 
 *           type: object
 *           required:
 *             - email
 *             - password
 *           properties:
 *             email:
 *               type: string
 *             password:
 *               type: string
 *     responses:
 *       200:
 *         description: Connexion réussie    
 *         schema:
 *           type: object
 *           properties:
 *             token:
 *               type: string
 *       400:
 *         description: Détail de l'erreur retournée
 *       402:
 *         description: Un non-admin ne peut pas se connecter à l'application web
 *       404:
 *         description: Mot de passe erroné ou compte inexistant
 *       499:
 *         description: CSRF Token invalide
 *       500:
 *         description: Accès refusé provenant d'une url non-autorisée (CORS)
 */
router.post('/web', corsProtection(), csrfProtection, loginWeb);

export default router;