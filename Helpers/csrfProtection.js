import jwt from 'jsonwebtoken';
import dotenv from "dotenv";
import Users from '../Models/Users.js';
dotenv.config();

/* 
    Protège contre la faille CSRF (Cross-Site Request Forgery)
    Traduis en "attaque de requête falsifiée entre sites", 
    est une vulnérabilité de sécurité dans laquelle un attaquant peut forcer un utilisateur 
    à exécuter des actions non intentionnelles sur un site web ou une application web sans son consentement.

    Ce code permet ainsi de s'assurer que toutes les requêtes effectuées par un utilisateur à l'API
    sont intentionnelles et qu'il est bel et bien connecté à l'application web. 

    Si le token et le cookie CSRF ne correspondent pas, l'utilisateur devra se reconnecter donc 
    on passe refreshTokenAuthorized à false (cf. /Controllers/isLoggedin pour plus d'informations)
*/

export const csrfProtection = (req, res, next) => {

    const API_KEY_WEB_JWT = process.env.API_KEY_WEB_JWT;
    
    const csrfToken = req.headers['x-csrf-token'];
    const csrfCookie = req.cookies.csrfToken; // récupéré grâce à cookie-parser

    const accessTokenInHeaders = req.headers.authorization; // Bearer xxxxxxxxxxxx

    if(typeof accessTokenInHeaders === "undefined" || accessTokenInHeaders === "") {
        return res.status(499).json({response: "CSRF Token invalide."});
    }

    const accessToken = accessTokenInHeaders.substring(7); // supprime "Bearer "

    if(csrfToken === csrfCookie) {
        next();
    } else {

        jwt.verify(accessToken, API_KEY_WEB_JWT, async function(err, decoded) {
            
            if(err) {
                // le token n'est pas valide, il s'agit peut-être d'un faux donc on ne peut pas modifier refreshTokenAuthorized
            } else {
                const userId = decoded.user._id;

                const data = {
                    refreshTokenAuthorized: false
                };

                await Users.findByIdAndUpdate(userId, data);
            }

        });

        return res.status(499).json({response: "CSRF Token invalide."});
    } 

} 