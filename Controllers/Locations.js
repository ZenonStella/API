import Locations from '../Models/Locations.js';

// à supprimer (utilisé uniquement pour les tests : récupère toutes les Locations)
export const getAllLocations = async (req, res) => {
    const locations = await Locations.find();
    return res.status(200).json(locations);
}
// à supprimer (utilisé uniquement pour les tests : récupère toutes les Locations)

export const getLocationsByCompany = async (req, res) => {
    const location = await Locations.find({
        companyId: req.user.companyId,
        isArchive: false
    });

    let constructLocations = [];

        location.forEach(elem => {
            let json = {
                _id: elem.id,
                name: elem.name,
            }
        
        constructLocations.push(json);

    });

    return res.status(200).json(constructLocations);
}

export const addLocation = async (req, res) => {

    const checkKeys = Object.keys(req.body);

    if(checkKeys.length === 0) {
        return res.status(400).json({response: "Requête invalide."});
    }

    checkKeys.forEach(key => {
        if(key != "name") { 
            return res.status(400).json({response: "Requête invalide."});
        } 
    });

    const location = new Locations(req.body);
    location.companyId = req.user.companyId;

    await location.save();

    // json(location) à supprimer
    return res.status(201).json(location);
}

export const updateLocation = async (req, res) => {

    const locationId = req.params.id;
    const companyId = req.user.companyId;
    const locationIsExist = await Locations.findById(locationId);

    if(!locationIsExist) {
            return res.status(404).json({response: "Cet emplacement n'existe pas."});
    }
        
    if(locationIsExist.companyId != companyId){
        return res.status(403).json({response: "Cet emplacement ne fait pas partie de votre entreprise."});
    }

    const checkKeys = Object.keys(req.body);

    if(checkKeys.length === 0) {
        return res.status(400).json({response: "Requête invalide."});
    }

    checkKeys.forEach(key => {
        if(key != "name") { 
            return res.status(400).json({response: "Requête invalide."});
        } 
    });

    const location = await Locations.findByIdAndUpdate(locationId, req.body);

    // à supprimer json(location) utilisé que pour tests
    return res.status(200).json(location)

}
export const deleteLocation = async (req, res) => {
    const companyId = req.user.companyId;
    const locationId = req.params.id;

    const location = await Locations.findById(locationId);

    if(!location || location.isArchive) {
        return res.status(404).json({response: "Cet emplacement n'existe pas ou a déjà été supprimé."});
    } 

    if(location.companyId != companyId){
        return res.status(403).json({response: "Cet emplacement ne fait pas partie de votre entreprise."});
    }

    let isArchived = {
        isArchive: true
    }

    const locationArchived = await Locations.findByIdAndUpdate(locationId, isArchived);
    
    // à supprimer : json "locationArchived" utilisé que pour les tests
    return res.status(200).json(locationArchived);
}