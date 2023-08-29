import Articles from '../Models/Articles.js';
import Locations from '../Models/Locations.js';

// Ajoute un nouvel article depuis l'application Desktop
export const addArticleToCompany = async (req, res) => {

    const checkKeys = Object.keys(req.body);

    if(checkKeys.length === 0) {
        return res.status(400).json({response: "Requête invalide."});
    }

    checkKeys.forEach(key => {
        if(key == "name" || key == "reference" || key == "stock" || key == "threshold" || key == "unitPrice" || key == "locationId") { 
            // Ces données peuvent être ajoutées par l'utilisateur donc je ne fais rien
        } else if(key == "") {
            return res.status(400).json({response: "Requête invalide."});
        } else {
            return res.status(400).json({response: "Requête invalide."});
        } 
    });

    const companyId = req.user.companyId;
    const location = await Locations.findById(req.body.locationId);

    if(!location){
        return res.status(404).json({response: "Cet emplacement n'existe pas."});
    }

    if(location.companyId != companyId){
        return res.status(403).json({response: "Cet emplacement ne fait pas partie de votre entreprise."});
    }

    const article = new Articles(req.body);

    article.companyId = companyId;

    await article.save();

    // à supprimer : json "article" utilisé que pour les tests
    return res.status(201).json(article);
}

// Récupère tous les articles de l'entreprise pour l'application desktop de la page Inventaire
// Triés en premier par les articles dont le stock atteint son seuil critique
export const getAllArticlesByCompany = async (req, res) => {

    const allArticles = await Articles.find({$and: [{companyId: req.user.companyId}, {isArchive: false}]});

    let constructArticles = [];
    allArticles.forEach(article => {

        // Quota correspond au % entre le stock et le seuil critique
        // Plus ce % est petit, plus le stock est critique
        // J'affiche en premier les articles ayant leur stock critique 
        // pour voir du 1er coup d'oeil les articles épuisés à commander
        let quota; 
        let threshold = article.threshold;
        let stock = article.stock;
        if(stock === 0) {

            // Si le stock est vide, j'affiche l'article en premier (-100.000 est une valeur arbitraire)
            quota = -100000;

        } else if (threshold === 0){

            // si le seuil est à 0, je le passe à 1 car sinon le calcul ci-dessous ne fonctionnerait pas
            // le passer à 1 n'impacte en rien la fiabilité du calcul
            threshold = 1;
            quota = 100 - (threshold * 100 / stock);

        } else {
            quota = 100 - (threshold * 100 / stock);
        }

        quota = Number.parseFloat(quota.toFixed(5));

        let json = {
            _id: article.id,
            name: article.name,
            reference: article.reference,
            locationId: article.locationId,
            stock: stock,
            threshold: threshold,
            quota: quota // utilisé pour trier avec sort()
        }

        constructArticles.push(json);

    });

    // Tri par stock critique en premier (% quota du plus petit au plus grand)
    constructArticles = constructArticles.sort((a, b) => {
        if (a.quota < b.quota) {
          return -1;
        }
    });
    
    return res.status(200).json(constructArticles);

}

// Mettre à jour les informations d'un article de la page "Inventaire" depuis l'application Desktop
export const updateArticle = async (req, res) => {
    
    const companyId = req.user.companyId;
    const articleId = req.params.id;
    
    const article = await Articles.findById(articleId);

    if(!article) {
        return res.status(404).json({response: "Cet article n'existe pas."});
    } 

    if(article.companyId != companyId){
        return res.status(403).json({response: "Cet article ne fait pas partie de votre entreprise."});
    }

    const checkKeys = Object.keys(req.body);

    if(checkKeys.length === 0) {
        return res.status(400).json({response: "Requête invalide."});
    }

    checkKeys.forEach(key => {
        if(key == "name" || key == "reference" || key == "stock" || key == "threshold" || key == "unitPrice" || key == "locationId") { 
            // Ces données peuvent être modifiées par l'utilisateur donc je ne fais rien
        } else if(key == "") {
            return res.status(400).json({response: "Requête invalide."});
        } else {
            return res.status(400).json({response: "Requête invalide."});
        } 
    });

    const articleUpdated = await Articles.findByIdAndUpdate(articleId, req.body);

    // à supprimer : json "articleUpdated" utilisé que pour les tests
    return res.status(200).json(articleUpdated);
}

// Supprime un article de la page "Inventaire" depuis l'application Desktop
// La suppression est factice, c'est en réalité un update qui passe en isArchive = true
export const deleteArticle = async (req, res) => {

    const companyId = req.user.companyId;
    const articleId = req.params.id;

    const article = await Articles.findById(articleId);

    if(!article || article.isArchive) {
        return res.status(404).json({response: "Cet article n'existe pas ou a déjà été supprimé."});
    } 

    if(article.companyId != companyId){
        return res.status(403).json({response: "Cet article ne fait pas partie de votre entreprise."});
    }

    let isArchived = {
        isArchive: true
    }

    const articleArchived = await Articles.findByIdAndUpdate(articleId, isArchived);
    
    // à supprimer : json "articleArchived" utilisé que pour les tests
    return res.status(200).json(articleArchived);

}


// Modifier l'emplacement de l'article depuis l'application Desktop
export const changeLocationArticle = async (req, res) => {

    const companyId = req.user.companyId;
    const articleId = req.params.id;
    const locationId = req.body.locationId;

    const location = await Locations.findById(locationId);

    if(!location){
        return res.status(404).json({response: "Cet emplacement n'existe pas."});
    }

    if(location.companyId != companyId){
        return res.status(403).json({response: "Cet emplacement ne fait pas partie de votre entreprise."});
    }

    const article = await Articles.findById(articleId);

    if(!article) {
        return res.status(404).json({response: "Cet article n'existe pas."});
    } 

    if(article.companyId != companyId){
        return res.status(403).json({response: "Cet article ne fait pas partie de votre entreprise."});
    }

    const checkKeys = Object.keys(req.body);

    if(checkKeys.length === 0) {
        return res.status(400).json({response: "Requête invalide."});
    }

    checkKeys.forEach(key => {
        if(key != "locationId") { 
            return res.status(400).json({response: "Requête invalide."});
        }
    });

    let newLocation = {
        locationId: locationId
    }

    const locationChanged = await Articles.findByIdAndUpdate(articleId, newLocation);
    
    // à supprimer : json "locationChanged" utilisé que pour les tests
    return res.status(200).json(locationChanged);

} 

// Modifier l'inventaire d'un article (stockage et déstockage) depuis l'application mobile
export const stockDestockArticle = async (req, res) => {

    const companyId = req.user.companyId;
    const articleId = req.params.id;

    const article = await Articles.findById(articleId);

    if(!article) {
        return res.status(404).json({response: "Cet article n'existe pas."});
    } 

    if(article.companyId != companyId){
        return res.status(403).json({response: "Cet article ne fait pas partie de votre entreprise."});
    }

    const checkKeys = Object.keys(req.body);

    if(checkKeys.length === 0) {
        return res.status(400).json({response: "Requête invalide."});
    }

    checkKeys.forEach(key => {
        if(key != "stock") { 
            return res.status(400).json({response: "Requête invalide."});
        }
    });

    if(!Number.isInteger(req.body.stock)) {
        return res.status(409).json({response: "La quantité envoyée n'est pas un nombre."});
    }

    let newStock = {
        stock: req.body.stock
    }

    const stockUpdated = await Articles.findByIdAndUpdate(articleId, newStock);

    // à supprimer : json "stockUpdated" utilisé que pour les tests;
    return res.status(200).json(stockUpdated);

}


/*

    # Code à supprimer mais à conserver temporairement car on peut se reservir de sa structure
    pour nous aider à construire le système de recherche de la page Inventaire (app desktop)

// Récupère les articles d'une entreprise par rapport à la recherche pour la page "Inventaire" de l'application Desktop 
export const searchArticlesInCompany = async (req, res) => {

    const keywords = req.body.keywords;
    const checkKeys = Object.keys(req.body);

    if(checkKeys.length === 0) {
        return res.status(400).json({response: "Recherche invalide."});
    }

    checkKeys.forEach(key => {
        if(key != "keywords") { 
            return res.status(402).json({response: "Recherche invalide."});
        }
    });

    const regex = new RegExp("(" + keywords + ")", 'i');

    const articles = await Articles.find(
        {
            $and : [{companyId: req.user.companyId}, { $or: [{reference: regex}, {name: regex}] }]
        }
    );

    return res.status(200).json(articles);
    
}

*/