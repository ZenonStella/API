import jwt from 'jsonwebtoken';
import passport from 'passport';
import dotenv from 'dotenv';
import crypto from "crypto";
import Companys from '../../Models/Companys.js';
import Users from '../../Models/Users.js';
import '../../Auth/Web.js';

dotenv.config();

export const loginWeb = async (req, res, next) => {

    const API_KEY_WEB_JWT = process.env.API_KEY_WEB_JWT;

    passport.authenticate('loginWeb', async (err, user) => {

        try {
            if (err || !user) {
                return res.status(404).json({response: "Mot de passe erroné ou compte inexistant."});
            }

            req.login(user, { session: false}, async error => {

                if(error) return res.status(400).json({response: error});

                if(!user.isAdmin) {
                    return res.status(402).json({response : "Un non-admin ne peut pas se connecter à l'application web."})
                }
                
                /* TODO : ce code ne concerne que l'application mobile et desktop, donc à enlever d'ici (enlever aussi de la doc swagger)
                et à mettre dans les routes /login/mobile et /login/desktop

                // Quand le statut des non-admins est false ils ne peuvent pas se connecter
                if(!user.status) {
                    return res.status(402).json({response: "Votre compte n'est pas activé."});
                }

                const company = await Companys.findById(user.companyId);

                let licenceActivated = false;

                company.licence.forEach(licence => {

                    // Parcourt toutes les licences de l'entreprise jusqu'à en trouver une activée
                    if(licence.isActivated) {
                        licenceActivated = true;
                    }

                });

                // les non-admins ne peuvent pas se connecter quand la licence n'est pas activée.
                if(!user.isAdmin && !licenceActivated) {
                    return res.status(403).json({response: "Veuillez activer votre licence pour vous connecter."});
                }

                */

                // On met une partie de l'objet user dans le token pour récupérer ses informations dans les routes de l'API
                let jsonUser = { 
                    _id: user._id,
                    status: true,
                    isAdmin: true,
                    companyId: user.companyId
                }

                const accessToken = jwt.sign({ user: jsonUser }, API_KEY_WEB_JWT, { expiresIn: '1h' });
                const refreshToken = jwt.sign({ user: { _id: user._id } }, API_KEY_WEB_JWT, { expiresIn: '15h' });
                
                let sessionWeb = crypto.randomBytes(32);
                sessionWeb = sessionWeb.toString('hex');

                await Users.findByIdAndUpdate(user._id, {
                    refreshTokenAuthorized: true, 
                    sessions: {web: sessionWeb}
                });

                /* 
                    Si le refreshToken est envoyé dans un cookie httpOnly côté client et non pas en BDD
                    c'est parce qu'il est impossible de générer un faux refreshToken sans la clé secrète. 
                    
                    Imaginons que nous l'avions mis en BDD, si un attaquant récupère l'accessToken d'un admin
                    depuis l'application desktop ou mobile, il aurait pu l'utiliser sur l'application web
                    et récupérer le refreshToken en BDD (même si en réalité la clé d'API web bloquerait cette attaque).

                    Or, en mettant le refreshToken dans un cookie httpOnly, l'attaquant peut certes en générer un faux
                    et l'envoyer dans les requêtes, mais côté API quand il sera vérifié jsonWebToken 
                    renverra une erreur car il n'aura pas été chiffré par la clé secrète.
                */

                return res.status(200).json({ 
                    accessToken: accessToken, 
                    refreshToken: refreshToken,
                    sessionWeb: sessionWeb 
                });

            })
        } catch (error) {
            return res.status(400).json({response: error});
        }
    })(req, res, next)
}