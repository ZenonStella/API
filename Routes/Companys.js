import express from 'express';
import { getAllCompanys, getProfileCompany, updateProfileCompany} from '../Controllers/Companys.js';
import { catchErrors } from '../Helpers/catchErrors.js';

const router = express.Router();

/**
 * @swagger
 * /companys/all:
 *   get:
 *     security:
 *       - Bearer: []
 *     description: Get All Companys
 *     tags:
 *       - Tests
 *     responses:
 *       200:
 *         description: Json all companys
 */
router.get('/all', catchErrors(getAllCompanys));


/**
 * @swagger
 * /companys:
 *   get:
 *     security:
 *       - Bearer: []
 *     summary: Récupérer le profil de l'entreprise (Web)
 *     description: Récupérer le profil de l'entreprise pour afficher les données dans le formulaire de la page Profil depuis l'application web
 *     tags:
 *       - Companys
 *     responses:
 *       200:
 *         description: Profil de l'entreprise récupéré.
 *         schema:
 *           type: object
 *           required:
 *             - user
 *             - company
 *           properties:
 *             user:
 *               type: object
 *               properties:
 *                 lastname:
 *                   type: string
 *                 firstname:
 *                   type: string
 *                 phone:
 *                   type: string
 *                 email:
 *                   type: string
 *             company:
 *               type: object
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
 *       403:
 *         description: Un non-admin n'a pas accès au profil de l'entreprise.
 */
router.get('/', catchErrors(getProfileCompany));


/**
 * @swagger
 * /companys:
 *   put:
 *     security:
 *       - Bearer: []
 *     summary: Mettre à jour le profil de l'entreprise (Web)
 *     description: Mettre à jour le profil de l'entreprise depuis l'application Web
 *     tags:
 *       - Companys
 *     consumes:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: body
 *         schema:
 *           type: object
 *           required:
 *             - user
 *             - company
 *           properties:
 *             user:
 *               type: object
 *               properties:
 *                 lastname:
 *                   type: string
 *                 firstname:
 *                   type: string
 *                 phone:
 *                   type: string
 *                 email:
 *                   type: string
 *                 password:
 *                   type: string
 *             company:
 *               type: object
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
 *     responses:
 *       200:
 *         description: Profil mis à jour.
 *       400:
 *         description: Requête invalide.
 *       403:
 *         description: Accès refusé aux non-admins.
 */
router.put('/', catchErrors(updateProfileCompany));
export default router;