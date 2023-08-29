import passport from "passport";
import { Strategy } from 'passport-local';
import Users from '../Models/Users.js';
import JWT from 'passport-jwt';
import dotenv from 'dotenv';

/* 
    Afin d'améliorer la sécurité et éviter qu'un attaquant utilise ses identifiants de connexion 
    pour se connecter à l'API depuis une autre route que celle normalement appelée depuis 
    l'application d'où il provient (web, desktop ou mobile) une API_KEY_JWT différente 
    est générée pour chaque application. 

    Ainsi, chaque application vérifiera les jwt avec sa propre API_KEY_JWT.
    Si un token "mobile" ou "desktop" est utilisé sur l'application web, la fonction verify 
    de jsonwebtoken renverra une erreur.

    L'API_KEY étant chiffrée avec le jwt, cela permet de transférer une clé d'API entre le client et le 
    serveur sans qu'elle ne soit visible dans les requêtes http.
*/

export const Authentication = (app) => {

    const { Strategy: JWTstrategy, ExtractJwt} = JWT;
    dotenv.config();


    let API_KEY_JWT;
    let loginAppStrategy;

    if(app === "web") {
        API_KEY_JWT = process.env.API_KEY_WEB_JWT;
        loginAppStrategy = "loginWeb";

    } else if(app === "desktop") {

        // TODO api_key_desktop_jwt
        // loginAppStrategy = "loginDesktop"

    } else if(app === "mobile") {

        // TODO api_key_mobile_jwt
        // loginAppStrategy = "loginMobile"

    }

    passport.use(
        loginAppStrategy, 
            new Strategy(
            {
                usernameField: 'email',
                passwordField: 'password',
            }, 
            async (email, password, done) => {
                try {
                    const user = await Users.findOne({ email });

                    if(!user) {
                        return done(null, false, { message: "Utilisateur non-trouvé." })
                    }
                    
                    const validate = await user.isValidPassword(password);

                    if(!validate) {
                        return done(null, false, { message: "Erreur de connexion." })
                    }

                    return done(null, user, { message: "Connexion réussie."})
                    
                } catch (error) {
                    return done(error);
                }
            }
        )
    );

    passport.use(
        new JWTstrategy(
        {
            secretOrKey: API_KEY_JWT,
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken('token')
        },
            async (token, done) => {
                try {
                    return done(null, token.user);
                } catch (error) {
                    return done(error);
                }
            }
        )
    );
        
}

export default passport