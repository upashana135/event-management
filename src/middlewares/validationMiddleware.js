const validateUser = (req, res, next) => {
    const {name, email, password, role} = req.body;
    if(!name || !email || !password || !role){
        return res.status(422).json({errors: 'Required field missing' });
    }
    if((role !== 'organizer') && (role !== 'participant')){
        return res.status(403).json({message: 'Forbidden: You do not have the required role.' });
    }
    next();
}

const validateEventOrganizer = (req, res, next) => {
    const role = req.verifiedToken.role;
    if(role !== 'organizer'){
        return res.status(403).json({ message: "Forbidden: Access denied for your role" });
    }
    next();
}

const validateEvent = (req, res, next) => {
    const {name, date, time, participantsCount} = req.body;
    if(!name || !date || !time || !participantsCount){
        return res.status(422).json({errors: 'Required field missing' });
    }
    if(typeof participantsCount !== 'number'){
        return res.status(422).json({errors: 'Participants Count must be numeric' });
    }
    next();
}

const validateParticipants = (req, res, next) => {
    const role = req.verifiedToken.role;
    if(role !== 'participant'){
        return res.status(403).json({ message: "Forbidden: Access denied for your role" });
    }
    next();
}

module.exports = {validateUser, validateEventOrganizer, validateEvent, validateParticipants};