import Users from '../Models/Users.js';
import bcrypt from 'bcrypt';

// à supprimer (utilisé uniquement pour les tests : récupère tous les users)
export const getAllUsers = async (req, res) => {

    const users = await Users.find();

    return res.status(200).json(users);
}
// à supprimer (utilisé uniquement pour les tests : récupère tous les users)


// Récupère tous les utilisateurs d'une entreprise pour la page "Comptes" de l'application Desktop 
// Sauf l'admin dont le profil ne peut être modifié que par lui-même
// Ces résultats peuvent aussi être utilisés pour la searchbar
export const getUsersInCompany = async (req, res) => {

    const users = await Users.find({$and : [{companyId: req.user.companyId}, {isAdmin: false}]});

    let constructAllUsers = [];
    users.forEach(user => {

        let json = {
            _id: user._id,
            firstname: user.firstname,
            lastname: user.lastname,
            email: user.email,
            phone: user.phone,
            status: user.status
        }

        constructAllUsers.push(json);
    });

    return res.status(200).json(constructAllUsers);
}

// Ajoute un nouvel utilisateur depuis la page Comptes de l'application Desktop
export const addUser = async (req, res) => {
    
    const emailExist = await Users.find({ email: req.body.email });

    if(emailExist.length > 0) {
        res.status(409).json({response: "Cette adresse email est déjà utilisée."});
    }

    const checkKeys = Object.keys(req.body);

    checkKeys.forEach(key => {
        if(key == "lastname" || key == "firstname" || key == "email" || key == "phone" || key == "password") { 
            // Ces données peuvent être modifiées par l'utilisateur donc je ne fais rien
        } else if (key == "") {
            return res.status(400).json({response: "Requête invalide."})   
        } else {
            return res.status(400).json({response: "Requête invalide."});
        } 
    });

    const user = new Users(req.body);
    user.companyId = req.user.companyId;
    user.isAdmin = false;

    await user.save();
    
    // à supprimer : json "user" utilisé que pour les tests
    return res.status(201).json(user);
}

// Met à jour les informations d'un utilisateur de la page "Comptes" dans l'application Desktop
// dans cette page, seuls les comptes non-admins peuvent être modifiés
export const updateUser = async (req, res) => {
    
    const userId = req.params.id; // le compte utilisateur à modifier
    const whichUser = await Users.findById(userId);
    const companyId = req.user.companyId;
    
    if(!whichUser) {
        return res.status(404).json({response: "Cet utilisateur n'existe pas."});
    } 

    if(whichUser.companyId != companyId){
        return res.status(403).json({response: "Cet utilisateur ne fait pas partie de votre entreprise."});
    }

    if(whichUser.isAdmin) {
        return res.status(402).json({response: "Un compte admin ne peut pas être modifié depuis l'application Desktop par un non-admin."});
    }

    const checkKeys = Object.keys(req.body);

    checkKeys.forEach(key => {
        if(key == "lastname" || key == "firstname" || key == "email" || key == "phone" || key == "password" || key == "status") { 
            // Ces données peuvent être modifiées par l'utilisateur donc je ne fais rien
        } else if (key == "") {
            return res.status(400).json({response: "Requête invalide."})   
        } else {
            return res.status(400).json({response: "Requête invalide."});
        } 
    });

    // Clés dans req.body, si c'est un password il faut le hasher
    const keysBodyArray = Object.keys(req.body);

    for await (const keys of keysBodyArray) {
        if(keys == "password") {
            const hash = await bcrypt.hash(req.body.password, 10);
            req.body.password = hash;
        }
    }

    const user = await Users.findByIdAndUpdate(userId, req.body);
            
    // à supprimer : json "user" utilisé que pour les tests
    return res.status(200).json(user);

}

// Supprime un compte utilisateur depuis la page Comptes de l'application Desktop
// dans cette page, seuls les comptes non-admins peuvent être modifiés
export const deleteUser = async (req, res) => {

    const userId = req.params.id; // Compte utilisateur à supprimer
    const whichUser = await Users.findById(userId);
    const companyId = req.user.companyId;

    if(!whichUser) {
        return res.status(404).json({response: "Cet utilisateur n'existe pas."});
    }

    if(whichUser.companyId != companyId){
        return res.status(403).json({response: "Cet utilisateur ne fait pas partie de votre entreprise."});
    }

    if(whichUser.isAdmin) {
        return res.status(402).json({response: "Un compte admin ne peut pas être supprimé depuis l'application Desktop par un non-admin."});
    } 

    await Users.findByIdAndDelete(userId);

    return res.status(200).json({response: "Compte utilisateur supprimé."});
}

/*

    # Code à supprimer mais à conserver temporairement car on peut se reservir de sa structure
    pour nous aider à construire le système de recherche de la page Comptes (app desktop)

export const searchUsersInCompany = async (req, res) => {
 
// Récupère les utilisateurs d'une entreprise par rapport à la recherche pour la page "Comptes" de l'application Desktop 
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

    

    // Plusieurs mots clés avec espace peuvent être entrés dans la recherche 
    // donc je crée un tableau pour gérer tous les cas
    const keywordsExplode = keywords.split(' ');

    let constructResults = [];
    let lengthkeywordsExplode = keywordsExplode.length;
    let countforEach = 0;

    keywordsExplode.forEach(async word => {
        const regex = new RegExp("^" + word + "$", 'i');

        Améliorations possibles de la recherche :
        
            1) Renvoyer tous les users de l'entreprise côté front et filtrer côté front
            2) Supprimer les (rares) doublons dans les résultats 
            3) Effectuer une recherche plus souple que strictement égale : ^ $
            4) Comme c'est strictement égal, un accent manquant ne renvoie aucun résultat donc c'est améliorable

        const users = await Users.find(
            {
                $and : [{companyId: req.user.companyId}, {isAdmin: false}, { $or: [{lastname: regex}, {firstname: regex}] }]
            }
        );

        if(users[0] != undefined) {
            constructResults.push(users[0]);
        }
        
        countforEach += 1;

        // Quand tout le tableau a fini ses boucles, je lance ce code ci-dessous
        // Cette vérification est nécessaire à cause des async/await qui exécute le code en asynchrone

        if(countforEach == lengthkeywordsExplode) {
            return res.status(200).json(constructResults);
        }
        
    });

}
*/