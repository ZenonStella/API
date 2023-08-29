import express from 'express';
import { addAdminUserAndCompanyAccount } from '../Controllers/Signup.js';
import { catchErrors } from '../Helpers/catchErrors.js';
import { csrfProtection } from '../Helpers/csrfProtection.js';
import { corsProtection } from '../Helpers/corsProtection.js';

const router = express.Router();

/**
 * @swagger
 * /signup:
 *   post:
 *     summary: Créer un compte utilisateur admin et son entreprise (Web)
 *     description: Créer un compte utilisateur admin et son entreprise
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
 *             - company
 *             - user
 *           properties:
 *             company:
 *               type: object
 *               required:
 *                 - name
 *                 - way
 *                 - city
 *                 - zip
 *                 - country
 *               properties:
 *                 name:
 *                   type: string
 *                 siret:
 *                   type: string
 *                 way:
 *                   type: string
 *                 city:
 *                   type: string
 *                 zip:
 *                   type: string
 *                 country:
 *                   type: string
 *             user:
 *               type: object
 *               required:
 *                 - lastname
 *                 - firstname
 *                 - email
 *                 - phone
 *                 - password
 *               properties:
 *                 lastname:
 *                   type: string
 *                 firstname:
 *                   type: string
 *                 email:
 *                   type: string
 *                 phone:
 *                   type: string
 *                 password:
 *                   type: string
 *     responses:
 *       201:
 *         description: Compte d'un utilisateur admin et son entreprise créés  
 *       400:
 *         description: Requête invalide  
 *       409:
 *         description: Cette adresse email est déjà utilisée.
 *       499:
 *         description: CSRF Token invalide.
 *       500:
 *         description: Accès refusé provenant d'une url non-autorisée (CORS).
 */
router.post('/', corsProtection(), csrfProtection, catchErrors(addAdminUserAndCompanyAccount));

export default router;