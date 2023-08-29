import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

/* 
    Vérifie que les requêtes à l'API sont bien effectuées depuis l'application web
    Les applications Mobile et Desktop n'ayant pas d'origine (pas de nom de domaine ni de navigateur)
    Il n'est pas utile de sécuriser leurs routes avec CORS.

    La protection CORS permet notamment de certifier que l'utilisateur provient de la couche web pour se connecter
    ainsi que générer la session web. La session web est ensuite utilisée pour récupérer le refreshToken qui n'est 
    utilisé que pour le web. Cela évite qu'un attaquant se serve d'un access Token volé depuis l'application Desktop ou Mobile 
    pour se connecter à l'application web.
*/

export const corsProtection = () => {

    const CORS_ORIGINS = process.env.CORS_ORIGINS;

    let listOrigins = CORS_ORIGINS.split("&&");
    listOrigins = listOrigins.map(item => item.trim()); // Suppression des espaces

    const Whitelist = listOrigins;

    const corsOptions = {
        origin: function (origin, callback) {
            if (Whitelist.indexOf(origin) !== -1 || !origin) {
                callback(null, true);
            } else {
                callback(new Error('Accès refusé (CORS)'));
            }
        }
    }

    return cors(corsOptions);
}
