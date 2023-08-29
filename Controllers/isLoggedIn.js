import passport from 'passport';
import jwt from 'jsonwebtoken';
import Users from '../Models/Users.js';
import '../Auth/Web.js';
import dotenv from "dotenv";
dotenv.config();

// Vérifie si l'utilisateur est connecté à l'application web et refraichit l'accessToken

const isLoggedIn = async (req, res, next) => {

    const API_KEY_WEB_JWT = process.env.API_KEY_WEB_JWT;

    const accessTokenInHeaders = req.headers.authorization; // Bearer xxxxxxxxxxxx
    const refreshToken = req.cookies.refreshToken; // récupéré grâce à cookie-parser
    const sessionWebCookie = req.cookies.sessionWeb;

    if(typeof accessTokenInHeaders === "undefined" || accessTokenInHeaders === "") return res.status(498).json({response: "API : AccessToken invalide."});
    if(typeof refreshToken === "undefined" || refreshToken === "") return res.status(498).json({response: "API : RefreshToken invalide."});

    const accessToken = accessTokenInHeaders.substring(7); // supprime "Bearer "
    if(typeof accessToken === "undefined" || accessToken === "") return res.status(498).json({response: "API : AccessToken invalide."});

    const updateRefreshTokenAuthorized = async () => {
        const data = { refreshTokenAuthorized: false };
        await Users.findByIdAndUpdate(userId, data);
    }

    jwt.verify(accessToken, API_KEY_WEB_JWT, async function(err, decoded) {

        const user = decoded.user;

        if(err || !user) return res.status(401).json({response: "API : Utilisateur non-connecté (accessToken invalide ou expiré)."});
        if(!user.isAdmin) return res.status(403).json({response: "API : Un non-admin ne peut pas se connecter à l'application web."});
        
        const userId = user._id;
        const userInDB = await Users.findById(userId);
        const refreshTokenAuthorized = userInDB.refreshTokenAuthorized;
        const sessionWebInDB = userInDB.sessions.web;
        
        /*
            refreshTokenAuthorized passe à true lors de la connexion et à false à la déconnexion.
            Si un attaquant vole un accessToken – valide pendant 1 heure – et qu'il essaie 
            de se connecter avec, mais que l'utilisateur s'était déconnecté auparavant
            alors l'attaquant ne pourra pas rafraichir son token et l'accès lui sera bloqué au bout d'1 heure.

            C'est aussi un moyen de protéger et contrôler la possibilité de rafraichir son token. 
            Par exemple, si une connexion à une IP ou à une machine inconnues a été détectée, 
            il est possible de bloquer le refreshToken. 

            De plus, si une erreur CSRF est détectée, cela signifie que l'utilisateur n'est pas connecté,
            et qu'il s'agit peut-être d'un attaquant, donc refreshTokenAuthorized passe à false.
        */
        
        if(!refreshTokenAuthorized) return res.status(402).json({response: "API : Vous n'êtes pas autorisé à rafraichir le token, veuillez vous reconnecter."});

        if(sessionWebInDB !== sessionWebCookie) {

            updateRefreshTokenAuthorized();
            return res.status(412).json({response: "API : La session Web transmise est incorrecte, veuillez vous reconnecter."});
        }
            
        // à ce stade du script, l'accessToken est valide et n'a pas expiré
        const tokenExpirationDate = decoded.exp; // timestamp linux
        const startingFromThirtyMinutes = tokenExpirationDate - 1800; // à partir de 30 minutes avant expiration (1800 secondes = 30 minutes)

        const timestampNow = Math.floor(Date.now() / 1000);

        // < production
        if(timestampNow < startingFromThirtyMinutes) return res.status(490).json({response: "API : La durée de l'accessToken est inférieure à 30 min donc il ne peut pas être rafraichit."});

        // à ce stade du script, la durée de l'accessToken est entre 30 min et 1h donc il peut être rafraichit si le refreshToken est valide
        jwt.verify(refreshToken, API_KEY_WEB_JWT, async function(err, decoded) {

            if(err) {
                
                updateRefreshTokenAuthorized();
                return res.status(498).json({response: "API : RefreshToken invalide."});
            } 

            const accessTokenUserID = userId;
            const refreshTokenUserID = decoded.user._id;

            if(accessTokenUserID !== refreshTokenUserID) {

                updateRefreshTokenAuthorized();
                return res.status(491).json({response: "API : L'ID de l'accessToken et du refreshToken ne correspondent pas."});
            } 
            
        });

        // Tous les contrôles ont été passés avec succès, je renvoie un nouvel accessToken
        const newAccessToken = jwt.sign({ user: user }, API_KEY_WEB_JWT, { expiresIn: '1h' });

        return res.status(200).json({accessToken: newAccessToken});
       
    });
}

export default isLoggedIn;