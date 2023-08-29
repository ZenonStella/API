import Orders from '../Models/Orders.js';
import Articles from '../Models/Articles.js';

/*

    Infos : 

    Statuts d'une commande 
        • 0 = À commander
        • 1 = En attente
        • 2 = Réceptionné

*/

// à supprimer (utilisé uniquement pour les tests : récupère tous les users)
export const getAllOrders = async (req, res) => {
    const orders = await Orders.find();

    return res.status(200).json(orders);
}
// à supprimer (utilisé uniquement pour les tests : récupère tous les users)


// Passer une quantité d'un article en commande depuis l'application Desktop
export const addOrderToCompany = async (req, res) => {

    const articleId = req.params.id;
    const article = await Articles.find({$and: [{_id: articleId}, {companyId: req.user.companyId}, {isArchive: false}]});

    // Si l'article n'existe pas ou si plus de deux articles avec le même id ont été trouvés = situation anormale
    if(article.length === 0 || article.length > 1) {
        return res.status(404).json({response: "Cet article n'existe pas."});
    }

    const checkKeys = Object.keys(req.body);

    if(checkKeys.length === 0) {
        return res.status(400).json({response: "Requête invalide."});
    }

    checkKeys.forEach(key => {
        if(key == "quantity") { 
            // Ces données peuvent être envoyées par l'utilisateur donc je ne fais rien
        } else if(key == "") {
            return res.status(400).json({response: "Requête invalide."});
        } else {
            return res.status(400).json({response: "Requête invalide."});
        } 
    });

    const order = new Orders(req.body);

    order.companyId = req.user.companyId;
    order.articleId = articleId;

    await order.save();

    // à supprimer : json "order" utilisé que pour les tests
    return res.status(201).json(order);
}


// Récupérer toutes les commandes de l'entreprise depuis l'application desktop de la page Commandes
// Ces résultats pourront être utilisés pour filtrer par "status" de manière dynamique grâce à React
export const getOrdersByCompany = async (req, res) => {

    const allOrders = await Orders.find({companyId: req.user.companyId});

    if(allOrders.length === 0) {
        return res.status(404).json({response: "Il n'existe aucune commande."});
    }

    let constructResults = [];
    
    for await (const order of allOrders) {

        const article = await Articles.findById(order.articleId);

        let json = {
            name: article.name,
            reference: article.reference,
            unitPrice: article.unitPrice, 
            quantity: order.quantity,
            status: order.status,
            orderId: order._id
        }

        constructResults.push(json);
    }
    
    return res.status(200).json(constructResults);
}

// Mettre à jour le statut de la commande
export const updateOrderStatus = async (req, res) => {

    const companyId = req.user.companyId;
    const orderId = req.params.id;
    const nbrStatus = req.body.status; // 0, 1 ou 2 (cf. info au début de ce fichier)

    const order = await Orders.findById(orderId);
    
    if(!order) {
        return res.status(404).json({response: "Cette commande n'existe pas."});
    } 

    if(order.companyId != companyId){
        return res.status(403).json({response: "Cette commande ne fait pas partie de votre entreprise."});
    }

    const checkKeys = Object.keys(req.body);

    if(checkKeys.length === 0) {
        return res.status(400).json({response: "Requête invalide."});
    }

    checkKeys.forEach(key => {
        if(key == "status") { 
            // Ces données peuvent être modifiées par l'utilisateur donc je ne fais rien
        } else if(key == "") {
            return res.status(400).json({response: "Requête invalide."});
        } else {
            return res.status(400).json({response: "Requête invalide."});
        } 
    });

    if(!Number.isInteger(nbrStatus)) {
        return res.status(400).json({response: "Requête invalide."});
    }

    if(nbrStatus === 0 || nbrStatus === 1 || nbrStatus === 2) {
        // requête valide, je ne fais rien
    } else {
        return res.status(400).json({response: "Requête invalide."});
    } 

    let newStatus = {
        status: nbrStatus
    };

    const orderStatusUpdated = await Orders.findByIdAndUpdate(orderId, newStatus);
    
    // à supprimer : json "orderStatusUpdated" utilisé que pour les tests
    return res.status(200).json(orderStatusUpdated);
    
}