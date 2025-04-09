const participantsRegistration = async(req, res) => {
    const events = req.app.locals.events;
    const participants = req.app.locals.participants;
    const eventId = req.params.id;
    const email = req.verifiedToken.email;
    console.log("em"+email);
    const isEvent = await events.find(event => event.eventId === parseInt(eventId));
    if(!isEvent){
        return res.status(409).json({error: "Event doesn't exist"});
    }
    const alreadyRegistered = participants.find(p => p.eventId === eventId && email === email);
    if(alreadyRegistered){
        return res.status(409).json({error: "Already registered for the event"});
    }
    const participant = {
        'eventId': eventId,
        'email': email
    }
    await participants.push(participant);
    isEvent.participants = isEvent.participants - 1;
    return res.status(200).json({message: "Participant registered for an event successfully!"});
}

const viewPartipantsRegistration = async(req, res) =>{
    const participants = req.app.locals.participants;
    const email = req.verifiedToken.email;
    const eventsDetail = await participants.find(p => p.email === email);
    return res.status(200).json({eventsDetail});
}

const participantsDeRegistration = async(req, res) =>{
    const events = req.app.locals.events;
    const email = req.verifiedToken.email;
    const participants = req.app.locals.participants;
    const eventId = req.params.id;
    const isEvent = await events.find(event => event.eventId === parseInt(eventId));
    if(!isEvent){
        return res.status(409).json({error: "Event doesn't exist"});
    }
    let index = -1;
    index = participants.findIndex(p => p.eventId === eventId && p.email === email);
    if(index === -1){
        return res.status(409).json({error: "No registration found for the event"});
    }
    participants.splice(index, 1);
    return res.status(200).json({message: "Participant deleted the Registration!"});
}

module.exports = {participantsRegistration, viewPartipantsRegistration, participantsDeRegistration};