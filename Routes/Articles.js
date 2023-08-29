import express from 'express';
import { addArticleToCompany, getAllArticlesByCompany, updateArticle, deleteArticle, changeLocationArticle, stockDestockArticle } from '../Controllers/Articles.js';
import { catchErrors } from '../Helpers/catchErrors.js';

const router = express.Router();


/**
 * @swagger
 * /articles:
 *   post:
 *     security:
 *       - Bearer: []
 *     summary: Ajouter un article à la base de données de l'entreprise (Desktop)
 *     description: Ajouter un article à la base de données de l'entreprise
 *     tags:
 *       - Articles
 *     consumes:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: body
 *         schema:
 *           type: object
 *           required:
 *             - name
 *             - reference
 *             - stock
 *             - threshold
 *             - locationId
 *             - unitPrice
 *           properties:
 *             name:
 *               type: string
 *             reference:
 *               type: string
 *             stock:
 *               type: number
 *             threshold:
 *               type: number
 *             locationId:
 *               type: string
 *             unitPrice:
 *               type: number
 *     responses:
 *       201:
 *         description: Article ajouté.
 *       400:
 *         description: Requête invalide.
 *       403:
 *         description: Cet emplacement ne fait pas partie de votre entreprise.
 *       404:
 *         description: Cet emplacement n'existe pas.
 */
router.post('/', catchErrors(addArticleToCompany));


/**
 * @swagger
 * /articles:
 *   get:
 *     security:
 *       - Bearer: []
 *     summary: Récupérer tous les articles de l'entreprise (Desktop)
 *     description: Récupérer tous les articles de l'entreprise pour l'application desktop de la page Inventaire. Triés en premier par les articles dont le stock atteint son seuil critique.
 *     tags:
 *       - Articles
 *     responses:
 *       200:
 *         description: Tous les articles de l'entreprise de l'utilisateur récupérés.
 *         schema:
 *           type: array
 *           items:
 *             properties:
 *               _id:
 *                 type: string
 *               name:
 *                 type: string
 *               reference:
 *                 type: string
 *               locationId:
 *                 type: string
 *               stock:
 *                 type: number
 *               threshold:
 *                 type: number
 *               quota:
 *                 type: number
 */
router.get('/', catchErrors(getAllArticlesByCompany));


/**
 * @swagger
 * /articles/{id}:
 *   put:
 *     security:
 *       - Bearer: []
 *     summary: Mettre à jour les informations d'un article (Desktop)
 *     description: Mettre à jour les informations d'un article de la page "Inventaire" depuis l'application Desktop
 *     tags:
 *       - Articles
 *     consumes:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: id
 *         type: string
 *         required: true
 *         description: _id string MongoDB de l'article à modifier
 *       - in: body
 *         name: body
 *         schema:
 *           type: object
 *           properties:
 *             name:
 *               type: string
 *             reference:
 *               type: string
 *             unitPrice:
 *               type: number
 *             stock:
 *               type: number
 *             threshold:
 *               type: number
 *             locationId:
 *               type: string
 *     responses:
 *       200:
 *         description: Article modifié.
 *       400:
 *         description: Requête invalide.
 *       403:
 *         description: Cet article ne fait pas partie de votre entreprise.
 *       404:
 *         description: Cet article n'existe pas.
 */
router.put('/:id', catchErrors(updateArticle));


/**
 * @swagger
 * /articles/location/{id}:
 *   put:
 *     security:
 *       - Bearer: []
 *     summary: Modifier l'emplacement de l'article (Desktop)
 *     description: Modifier l'emplacement de l'article depuis l'application Desktop
 *     tags:
 *       - Articles
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
 *           properties:
 *             locationId:
 *               type: string
 *     responses:
 *       200:
 *         description: Emplacement de l'article modifié.
 *       400:
 *         description: Requête invalide.
 *       403:
 *         description: Cet article ou emplacement ne fait pas partie de votre entreprise.
 *       404:
 *         description: Cet article ou emplacement n'existe pas.
 */
router.put('/location/:id', catchErrors(changeLocationArticle));


/**
 * @swagger
 * /articles/{id}:
 *   delete:
 *     security:
 *       - Bearer: []
 *     summary: Supprimer un article (Desktop)
 *     description: Supprimer un article de la page "Inventaire" depuis l'application Desktop. La suppression est factice, c'est en réalité un update qui passe en isArchive = true
 *     tags:
 *       - Articles
 *     consumes:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: id
 *         type: string
 *         required: true
 *         description: _id string MongoDB de l'article
 *     responses:
 *       200:
 *         description: Article supprimé.
 *       403:
 *         description: Cet article ne fait pas partie de votre entreprise.
 *       404:
 *         description: Cet article n'existe pas ou a déjà été supprimé.
 */
router.delete('/:id', catchErrors(deleteArticle));


/**
 * @swagger
 * /articles/stock/{id}:
 *   put:
 *     security:
 *       - Bearer: []
 *     summary: Stocker et destocker un article (Mobile)
 *     description: Modifier l'inventaire d'un article (stockage et déstockage) depuis l'application mobile
 *     tags:
 *       - Articles
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
 *           properties:
 *             stock:
 *               type: number
 *     responses:
 *       200:
 *         description: Stock de l'article mis à jour.
 *       400:
 *         description: Requête invalide.
 *       403:
 *         description: Cet article ne fait pas partie de votre entreprise.
 *       404:
 *         description: Cet article n'existe pas.
 *       409:
 *         description: La quantité envoyée n'est pas un nombre.
 */
router.put('/stock/:id', catchErrors(stockDestockArticle));

export default router;