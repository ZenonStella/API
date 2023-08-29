import express from 'express';
import { getLicencesByCompany, getCurrentLicenceByCompany, payLicenceByCompany } from '../Controllers/Licences.js';
import { catchErrors } from '../Helpers/catchErrors.js';

const router = express.Router();

/**
 * @swagger
 * /licences:
 *   get:
 *     security:
 *       - Bearer: []
 *     summary: Récupérer toutes les licences dans l'entreprise de l'utilisateur (Web)
 *     description: Récupérer toutes les licences dans l'entreprise de l'utilisateur. Elles seront affichées dans le tableau de bord de l'application web avec d'un côté la licence actuelle et de l'autre les licences expirées.
 *     tags:
 *       - Licences
 *     responses:
 *       200:
 *         description: Toutes les licences de l'entreprise de l'utilisateur récupérées.
 *         schema:
 *           type: array
 *           items:
 *             properties:
 *               _id:
 *                 type: string
 *               isActivated:
 *                 type: boolean
 *               key:
 *                 type: string
 *               activationDate:
 *                 type: string
 *               expirationDate:
 *                 type: string
 *               duration:
 *                 type: number
 *               package:
 *                 type: string
 *               monthCounter:
 *                 type: number
 *               monthlyPayment:
 *                 type: number
 *               invoice:
 *                 type: string
 *       403:
 *         description: Un non-admin n'a pas accès aux licences.
 */
router.get('/', catchErrors(getLicencesByCompany));


/**
 * @swagger
 * /licences:
 *   post:
 *     security:
 *       - Bearer: []
 *     summary: Acheter une nouvelle licence pour l'entreprise (Web)
 *     description: Acheter une nouvelle licence. Choisir un forfait (package) "monthly" ou "annually".
 *     tags:
 *       - Licences
 *     consumes:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: body
 *         schema:
 *           type: object
 *           required:
 *             - package
 *           properties:
 *             package:
 *               type: string
 *     responses:
 *       201:
 *         description: Licence payée et ajoutée au compte de l'entreprise.
 *       400:
 *         description: Veuillez choisir votre forfait (annuel ou mensuel)
 *       402:
 *         description: Le paiement a été refusé par votre banque.
 *       403:
 *         description: Un non-admin n'a pas accès aux licences.
 *       
 */
router.post('/', catchErrors(payLicenceByCompany));


/**
 * @swagger
 * /licences/current:
 *   get:
 *     security:
 *       - Bearer: []
 *     summary: Récupérer la licence actuelle de l'entreprise (Web)
 *     description: Récupérer la licence actuelle de l'entreprise
 *     tags:
 *       - Licences
 *     responses:
 *       200:
 *         description: La licence est active.
 *       402:
 *         description: Renouveler la licence.
 *       403:
 *         description: Un non-admin n'a pas accès aux licences.
 *       404:
 *         description: Aucune licence achetée.
 */
router.get('/current', catchErrors(getCurrentLicenceByCompany));

export default router;