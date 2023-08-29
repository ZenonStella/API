import Companys from '../Models/Companys.js';
import Users from '../Models/Users.js';

export const addAdminUserAndCompanyAccount = async (req, res) => {

    const emailExist = await Users.find({ email: req.body.user.email });

    if(emailExist.length > 0) {
        return res.status(409).json({response: "Cette adresse email est déjà utilisée."});
    }

    const checkKeys = Object.keys(req.body);

    checkKeys.forEach(key => {
        if(key == "company" || key == "user") { 
            // Ces données peuvent être modifiées par l'utilisateur donc je ne fais rien
        } else if (key == "") {
            return res.status(400).json({response: "Requête invalide."})   
        } else {
            return res.status(400).json({response: "Requête invalide."});
        } 
    });

    const checkKeysCompany = Object.keys(req.body.company);

    checkKeysCompany.forEach(key => {
        if(key == "name" || key == "siret" || key == "way" || key == "city" || key == "zip" || key == "country") { 
            // Ces données peuvent être modifiées par l'utilisateur donc je ne fais rien
        } else if (key == "") {
            return res.status(400).json({response: "Requête invalide."})   
        } else {
            return res.status(400).json({response: "Requête invalide."});
        } 
    });

    const checkKeysUser = Object.keys(req.body.user);

    checkKeysUser.forEach(key => {
        if(key == "lastname" || key == "firstname" || key == "email" || key == "phone" || key == "password") { 
            // Ces données peuvent être modifiées par l'utilisateur donc je ne fais rien
        } else if (key == "") {
            return res.status(400).json({response: "Requête invalide."})   
        } else {
            return res.status(400).json({response: "Requête invalide."});
        } 
    });

    /* 
        Optimisations possibles dans ce controller : 
            - vérifier le format des données et renvoyer des erreurs
            - ex : champ vide, email invalide, format du mot de passe incorrect, etc.
    */

    const company = new Companys(req.body.company);

    const listRandom = [0,1,2,3,4,5,6,7,8,9];
    let emailCode = "";

    for (let x = 0; x < 5; x++){
        const item = listRandom[Math.floor(Math.random() * listRandom.length)];
        emailCode += item;
    }

    company.emailCode = emailCode;

    const lastCompanyCreated = await company.save();

    const user = new Users(req.body.user);
    user.status = true;
    user.isAdmin = true;
    user.companyId = lastCompanyCreated._id;

    await user.save();

    // à supprimer : json "user" utilisé que pour les tests
    return res.status(201).json(user);
}
