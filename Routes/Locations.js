import express from 'express';
import {
    getAllLocations,
    getLocationsByCompany,
    addLocation,
    updateLocation,
    deleteLocation
} from '../Controllers/Locations.js';
import {
    catchErrors
} from '../Helpers/catchErrors.js';

const router = express.Router();

/**
 * @swagger
 * /locations/all:
 *   get:
 *     security:
 *       - Bearer: []
 *     description: Get All Locations
 *     tags:
 *       - Tests
 *     responses:
 *       200:
 *         description: Json all locations
 */
router.get('/all', catchErrors(getAllLocations));


/**
 * @swagger
 * /locations:
 *   get:
 *     security:
 *       - Bearer: []
 *     summary: Récupérer tous les emplacements d'une entreprise (Desktop)
 *     description: Récupérer tous les emplacements d'une entreprise pour la page "emplacement" de l'application Desktop  
 *     tags:
 *       - Locations
 *     responses:
 *       200:
 *         description: Tous les emplacements d'une entreprise récupérés.
 *         schema:
 *           type: array
 *           items:
 *             properties:
 *               _id:
 *                 type: string
 *               name:
 *                 type: string
 */
router.get('/', catchErrors(getLocationsByCompany));


/**
 * @swagger
 * /locations:
 *   post:
 *     security:
 *       - Bearer: []
 *     summary: Ajouter un emplacement à une entreprise (Desktop)
 *     description: Ajouter un nouvel emplacement créé sur la page Emplacement de l'application Desktop
 *     tags:
 *       - Locations
 *     consumes:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: body
 *         schema: 
 *           type: object
 *           required: 
 *             - name
 *           properties:
 *             name:
 *               type: string
 *     responses:
 *       201:
 *         description: Emplacement ajouté
 *       400:
 *         description: Requête invalide
 */
router.post('/', catchErrors(addLocation));


/**
 * @swagger
 * /locations/{id}:
 *   put:
 *     security:
 *       - Bearer: []
 *     summary: Modifier le nom d'un emplacement (Desktop)
 *     description:  Modifier le nom d'un emplacement
 *     tags:
 *       - Locations
 *     consumes:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: id
 *         type: string
 *         required: true
 *         description: _id string MongoDB de la location à modifier
 *       - in: body
 *         name: body
 *         schema:
 *           type: object
 *           properties: 
 *             name:
 *               type: string
 *     responses:
 *       200:
 *         description: Emplacement modifié.
 *       400:
 *         description: Requête invalide.
 *       403:
 *         description: Cet emplacement ne fait pas partie de votre entreprise.
 *       404:
 *         description: Cet emplacement n'existe pas.
 */
// <string _id (mongoDB)>
router.put('/:id', catchErrors(updateLocation));


/**
 * @swagger
 * /locations/{id}:
 *   delete:
 *     security:
 *       - Bearer: []
 *     summary: Supprimer un emplacement (Desktop)
 *     description:  Supprimer un emplacement
 *     tags:
 *       - Locations
 *     parameters:
 *       - in: path
 *         name: id
 *         type: string
 *         required: true
 *         description: _id string MongoDB de la location à supprimer
 *     responses:
 *       200:
 *         description: Emplacement supprimé.
 *       403:
 *         description: Cet emplacement ne fait pas partie de votre entreprise.
 *       404:
 *         description: Cet emplacement n'existe pas.
 */
// <string _id (mongoDB)>
router.delete('/:id', catchErrors(deleteLocation));

export default router;