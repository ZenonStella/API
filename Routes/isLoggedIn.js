import express from 'express';
import isLoggedIn from '../Controllers/isLoggedIn.js';
import { csrfProtection } from '../Helpers/csrfProtection.js';
import { corsProtection } from '../Helpers/corsProtection.js';

const router = express.Router();

/**
 * @swagger
 * /isloggedin:
 *   get:
 *     security:
 *       - Bearer: []
 *       - CSRFHeader: []
 *     summary: Vérifier que l'utilisateur est connecté et refraichir le token (Web)
 *     description: Vérifier que l'utilisateur est connecté à l'application web, que les tokens et la session Web sont valides puis renvoyer un nouvel accessToken.
 *     tags:
 *       - Authentication
 *     responses:
 *       200:
 *         description: Utilisateur connecté. Vérifications réussies. Envoi d'un nouvel accessToken.
 *         schema:
 *           type: object
 *           properties:
 *             accessToken:
 *               type: string
 *       401:
 *         description: Utilisateur non-connecté (accessToken invalide ou expiré)
 *       402:
 *         description: Vous n'êtes pas autorisé à rafraichir le token, veuillez vous reconnecter
 *       403:
 *         description: Un non-admin ne peut pas se connecter à l'application web
 *       412:
 *         description: La session Web transmise est incorrecte, veuillez vous reconnecter
 *       490:
 *         description: La durée de l'accessToken est inférieure à 30 min donc il ne peut pas être rafraichit
 *       491:
 *         description: L'ID de l'accessToken et du refreshToken ne correspondent pas
 *       498:
 *         description: AccessToken ou refreshToken invalide
 *       499:
 *         description: CSRF Token invalide
 *       500:
 *         description: Accès refusé provenant d'une url non-autorisée (CORS)
 */
router.get('/', corsProtection(), csrfProtection, isLoggedIn);

export default router;