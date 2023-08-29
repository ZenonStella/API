import Companys from '../Models/Companys.js';
import dotenv from 'dotenv';

dotenv.config();

const LICENCE_PRICE = process.env.LICENCE_PRICE;

// Récupère toutes les licences dans l'entreprise de l'utilisateur
// Elles seront affichées dans le tableau de bord de l'application web avec d'un côté la licence actuelle et de l'autre les licences expirées
export const getLicencesByCompany = async (req, res) => {

    if(!req.user.isAdmin) {
        return res.status(403).json({response: "Un non-admin n'a pas accès aux licences."});
    }

    const company = await Companys.findById(req.user.companyId);
    const allLicences = company.licence;

     // Tri par date pour afficher les licences les plus récentes en premier
     allLicences.sort((a, b) => (a.expirationDate < b.expirationDate ? 1 : -1));

    return res.status(200).json(allLicences);
}

// Récupère l'état de la licence active/actuelle
// Résultat : Aucune licence / Licence active / licence à renouveler
export const getCurrentLicenceByCompany = async (req, res) => {

    if(!req.user.isAdmin) {
        return res.status(403).json({response: "Un non-admin n'a pas accès aux licences."});
    }

    const company = await Companys.findById(req.user.companyId);
    const allLicences = company.licence;

    // Le tableau des licences est vide donc son length renvoie 0
    if(company.licence.length === 0) {
        return res.status(404).json({response: "Aucune licence achetée."});
    }

    // Compare par date et trie de la date d'expiration la plus grande à la plus petite
    allLicences.sort((a, b) => (a.expirationDate < b.expirationDate ? 1 : -1));

    // Comme la date d'expiration la plus grande est en 1ère position dans le tableau, 
    // Je récupère la licence actuelle avec [0]
    const currentLicence = allLicences[0];
    const stateLicence = currentLicence.isActivated;

    if(stateLicence) {
        return res.status(200).json({ response: "La licence est active."});
    } else if (!stateLicence) {
        return res.status(402).json({ response: "Renouveler la licence."});
    }
}

// Acheter une nouvelle licence
export const payLicenceByCompany = async (req, res) => {

    if(!req.user.isAdmin) {
        return res.status(403).json({response: "Un non-admin n'a pas accès aux licences."});
    }

    // monthly or annually
    const packageChoosed = req.body.package;

    let monthCounter;
    let monthlyPayment;
    let transactionAmount;

    if(packageChoosed == "monthly") {

        // 1 prélèvement sur 12 va être effectué donc le compteur est à 11 
        monthCounter = 11;

        // Montant en € du prélèvement mensuel
        monthlyPayment = LICENCE_PRICE / 12;

        // Montant en € qui va être prélevé sur Stripe pour la première transaction
        transactionAmount = LICENCE_PRICE / 12;

    } else if (packageChoosed == "annually") {

        // Le paiement en 1 fois va être effectué pour l'année donc le compteur est à zéro
        monthCounter = 0;

         // Le montant du prélèvement mensuel est à zéro car le forfait "annuel" a été choisi
         monthlyPayment = 0;

         // Montant en € qui va être prélevé sur Stripe
         transactionAmount = LICENCE_PRICE;

    } else {
        return res.status(400).json({response: "Veuillez choisir votre forfait : annuel ou mensuel."});
    }

    // En prod, c'est ici qu'on devrait effectuer les transactions avec Stripe
    const paymentCompleted = true;

    if(!paymentCompleted) {
        return res.status(402).json({response: "Le paiement a été refusé par votre banque."});
    }

    // Génération de clé de licence aléatoire
    const listRandom = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z",0,1,2,3,4,5,6,7,8,9];
    let licenseKey = "";

    for (let x = 0; x < 32; x++){
        const item = listRandom[Math.floor(Math.random() * listRandom.length)];
        licenseKey += item;
    }

    const currentDate = new Date();
    const nextYear = new Date(currentDate);
    nextYear.setUTCFullYear(nextYear.getUTCFullYear() + 1);

    // Ajoute une licence dans l'entreprise
    await Companys.updateOne(
        { _id: req.user.companyId },
        { $push: {
                licence: {
                    isActivated: true,
                    key: licenseKey,
                    activationDate: currentDate,
                    expirationDate: nextYear,
                    duration: 1,
                    package: packageChoosed,
                    monthCounter: monthCounter,
                    monthlyPayment: monthlyPayment,
                    invoice: "No invoice for the moment"
                } 
            }
        }
     )

    return res.status(200).json({ response: "Licence payée et ajoutée au compte de l'entreprise."});
}