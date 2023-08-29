import express from 'express';
import { getAllOrders, addOrderToCompany, getOrdersByCompany, updateOrderStatus } from '../Controllers/Orders.js';
import { catchErrors } from '../Helpers/catchErrors.js';

const router = express.Router();

/**
 * @swagger
 * /orders/all:
 *   get:
 *     security:
 *       - Bearer: []
 *     description: Get All Orders
 *     tags:
 *       - Tests
 *     responses:
 *       200:
 *         description: Json all orders
 */
router.get('/all', catchErrors(getAllOrders));


/**
 * @swagger
 * /orders/{id}:
 *   post:
 *     security:
 *       - Bearer: []
 *     summary: Passer une quantité d'un article en commande (Desktop)
 *     description: Passer une quantité d'un article en commande depuis l'application Desktop
 *     tags:
 *       - Orders
 *     consumes:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: id
 *         type: string
 *         required: true
 *         description: _id string MongoDB de l'article
 *       - in: body
 *         name: body
 *         schema:
 *           type: object
 *           required:
 *             - quantity
 *           properties:
 *             quantity:
 *               type: number
 *     responses:
 *       201:
 *         description: Commande de l'article effectuée avec succès.
 *       400:
 *         description: Requête invalide.
 *       404:
 *         description: Cet article n'existe pas.
 */
router.post('/:id', catchErrors(addOrderToCompany));


/**
 * @swagger
 * /orders:
 *   get:
 *     security:
 *       - Bearer: []
 *     summary: Récupérer toutes les commandes de l'entreprise (Desktop)
 *     description: Récupérer toutes les commandes de l'entreprise pour l'application desktop de la page Inventaire
 *     tags:
 *       - Orders
 *     responses:
 *       200:
 *         description: Toutes les commandes d'une entreprise récupérées.
 *         schema:
 *           type: array
 *           items:
 *             properties:
 *               orderId:
 *                 type: string
 *               name:
 *                 type: string
 *               reference:
 *                 type: string
 *               unitPrice:
 *                 type: number
 *               quantity: 
 *                 type: number
 *               status:
 *                 type: integer
 */
router.get('/', catchErrors(getOrdersByCompany));


/**
 * @swagger
 * /orders/{id}:
 *   put:
 *     security:
 *       - Bearer: []
 *     summary: Mettre à jour le statut de la commande (Desktop)
 *     description: Mettre à jour le statut de la commande depuis l'application Desktop
 *     tags:
 *       - Orders
 *     consumes:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: id
 *         type: string
 *         required: true
 *         description: _id string MongoDB de la commande
 *       - in: body
 *         name: body
 *         schema:
 *           type: object
 *           properties:
 *             status:
 *               type: integer
 *     responses:
 *       200:
 *         description: Statut de la commande modifié.
 *       400:
 *         description: Requête invalide.
 *       403:
 *         description: Cette commande ne fait pas partie de votre entreprise.
 *       404:
 *         description: Cette commande n'existe pas.
 */
router.put('/:id', catchErrors(updateOrderStatus));

export default router;