import express from 'express';
import { getAllUsers, getUsersInCompany, addUser, updateUser, deleteUser } from '../Controllers/Users.js';
import { catchErrors } from '../Helpers/catchErrors.js';

const router = express.Router();

/**
 * @swagger
 * /users/all:
 *   get:
 *     security:
 *       - Bearer: []
 *     description: Get All Users
 *     tags:
 *       - Tests
 *     responses:
 *       200:
 *         description: Json all users
 */
router.get('/all', catchErrors(getAllUsers));

/**
 * @swagger
 * /users:
 *   get:
 *     security:
 *       - Bearer: []
 *     summary: Récupérer tous les utilisateurs d'une entreprise (Desktop)
 *     description: Récupérer tous les utilisateurs d'une entreprise pour la page "Comptes" de l'application Desktop. Ces résultats peuvent aussi être utilisés pour la searchbar. 
 *     tags:
 *       - Users
 *     responses:
 *       200:
 *         description: Tous les utilisateurs d'une entreprise récupérés.
 *         schema:
 *           type: array
 *           items:
 *             properties:
 *               _id:
 *                 type: string
 *               firstname:
 *                 type: string
 *               lastname:
 *                 type: string
 *               email:
 *                 type: string
 *               phone: 
 *                 type: string
 *               status:
 *                 type: boolean
 */
router.get('/', catchErrors(getUsersInCompany));


/**
 * @swagger
 * /users:
 *   post:
 *     security:
 *       - Bearer: []
 *     summary: Ajouter un nouvel utilisateur dans l'entreprise (Desktop)
 *     description: Ajouter un nouvel utilisateur depuis la page Comptes de l'application Desktop.
 *     tags:
 *       - Users
 *     consumes:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: body
 *         schema:
 *           type: object
 *           required:
 *             - lastname
 *             - firstname
 *             - email
 *             - phone
 *             - password
 *           properties:
 *             lastname:
 *               type: string
 *             firstname:
 *               type: string
 *             email:
 *               type: string
 *             phone:
 *               type: string
 *             password:
 *               type: string
 *     responses:
 *       201:
 *         description: Compte utilisateur créé.
 *       400:
 *         description: Requête invalide.
 *       409:
 *         description: Cette adresse email est déjà utilisée.
 */
router.post('/', catchErrors(addUser));


/**
 * @swagger
 * /users/{id}:
 *   put:
 *     security:
 *       - Bearer: []
 *     summary: Mettre à jour les informations d'un utilisateur de la même entreprise (Desktop)
 *     description: Mettre à jour les informations d'un utilisateur depuis la page Comptes de l'application Desktop. Dans cette page, seuls les comptes non-admins peuvent être modifiés.
 *     tags:
 *       - Users
 *     consumes:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: id
 *         type: string
 *         required: true
 *         description: _id string MongoDB de l'utilisateur à modifier
 *       - in: body
 *         name: body
 *         schema:
 *           type: object
 *           properties:
 *             lastname:
 *               type: string
 *             firstname:
 *               type: string
 *             email:
 *               type: string
 *             phone:
 *               type: string
 *             password:
 *               type: string
 *             status:
 *               type: boolean
 *     responses:
 *       200:
 *         description: Compte utilisateur modifié.
 *       400:
 *         description: Requête invalide.
 *       402:
 *         description: Un compte admin ne peut pas être modifié depuis l'application Desktop par un non-admin.
 *       403:
 *         description: Cet utilisateur ne fait pas partie de votre entreprise.
 *       404:
 *         description: Cet utilisateur n'existe pas.
 */
router.put('/:id', catchErrors(updateUser));


/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     security:
 *       - Bearer: []
 *     summary: Supprimer un compte utilisateur dans la même entreprise (Desktop)
 *     description: Supprimer un compte utilisateur depuis la page Comptes de l'application Desktop. Dans cette page, seuls les comptes non-admins peuvent être supprimés.
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: id
 *         type: string
 *         required: true
 *         description: _id string MongoDB de l'utilisateur à supprimer
 *     responses:
 *       200:
 *         description: Compte utilisateur supprimé.
 *       402:
 *         description: Un compte admin ne peut pas être supprimé depuis l'application Desktop par un non-admin.
 *       403:
 *         description: Cet utilisateur ne fait pas partie de votre entreprise.
 *       404:
 *         description: Cet utilisateur n'existe pas.
 */
router.delete('/:id', catchErrors(deleteUser));

export default router;