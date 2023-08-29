import Companys from '../Models/Companys.js';
import Users from '../Models/Users.js';
import bcrypt from 'bcrypt';


// à supprimer (utilisé uniquement pour les tests : récupère toutes les companys)
export const getAllCompanys = async (req, res) => {
    const companys = await Companys.find();
    return res.status(200).json(companys);
}
// à supprimer (utilisé uniquement pour les tests : récupère toutes les companys)


// Récupérer les informations de l'entreprise pour les afficher dans le formulaire de la page Profil depuis l'application web
export const getProfileCompany = async (req, res) => {

    if(!req.user.isAdmin) {
        return res.status(403).json({response: "Un non-admin n'a pas accès au profil de l'entreprise."});
    }

    const company = await Companys.findById(req.user.companyId);

    const user = await Users.findOne({ $and: [{ companyId: req.user.companyId }, { isAdmin: true }] });

    let profile = {
        user: {
            lastname: user.lastname,
            firstname: user.firstname,
            phone: user.phone,
            email: user.email
        },
        company: {
            name: company.name,
            siret: company.siret,
            way: company.way,
            city: company.city,
            zip: company.zip,
            country: company.country
        }
    };

    return res.status(200).json(profile);
}

// Mettre à jour le profil de l'entreprise
export const updateProfileCompany = async (req, res) => {

    const companyId = req.user.companyId;

    if(!req.user.isAdmin) {
        return res.status(403).json({ response: "Accès refusé aux non-admins."});
    }

    const checkRequest = Object.keys(req.body);
    const requestBody = req.body;

    if(checkRequest.length !== 2) {
        return res.status(400).json({response: "Requête invalide."});
    }

    if(checkRequest[0] !== "user" || checkRequest[1] !== "company") {
        return res.status(400).json({response: "Requête invalide."});
    }

    const checkKeysCompany = Object.keys(requestBody["company"]);
    const checkKeysUser = Object.keys(requestBody["user"]);

    if(checkKeysCompany.length === 0 || checkKeysCompany.length === 0) {
        return res.status(400).json({response: "Requête invalide."});
    }

    checkKeysCompany.forEach(key => {
        if(key == "name" || key == "siret" || key == "way" || key == "city" || key == "zip" || key == "country") { 
            // Ces données peuvent être modifiées par l'utilisateur donc je ne fais rien
        } else if(key == "") {
            return res.status(400).json({response: "Requête invalide."});
        } else {
            return res.status(400).json({response: "Requête invalide."});
        } 
    });

    for await (const key of checkKeysUser) {

        if(key == "lastname" || key == "firstname" || key == "email" || key == "phone" || key == "password") { 
            // Ces données peuvent être modifiées par l'utilisateur
        } else if(key == "") {
            return res.status(400).json({response: "Requête invalide."});
        } else {
            return res.status(403).json({response: "Vous ne pouvez pas modifier ce champs."});
        } 

        if(key == "password") {
            const hash = await bcrypt.hash(requestBody["user"].password, 10);
            requestBody["user"].password = hash;
        }
    }
    
    const company = await Companys.findByIdAndUpdate(companyId, requestBody["company"]);

    const user = await Users.findByIdAndUpdate(req.user._id, requestBody["user"]);
    
    // à supprimer "const profile" et json "profile" utilisé que pour les tests
    const profile = [company, user];
    return res.status(200).json(profile);
   
}