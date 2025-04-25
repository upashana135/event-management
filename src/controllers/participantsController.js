const participantsRegistration = async(req, res) => {
    const client = req.app.locals.redisClient;
    const eventId = req.params.id;
    const email = req.verifiedToken.email;

    try{
        const checkExistingEvent = await client.get(`event:${eventId}`);
        if(!checkExistingEvent){
            return res.status(404).json({error: "Event not found!"});
        }
        const event = JSON.parse(checkExistingEvent);

        const alreadyRegistered = await client.sIsMember(`participants:event:${eventId}`, email);
        if (alreadyRegistered) {
            return res.status(409).json({ error: "Already registered for the event" });
        }

        if (event.participantsCount <= 0) {
            return res.status(403).json({ error: "No seats available!" });
        }

        await client.sAdd(`participants:event:${eventId}`, email);
        event.participantsCount -= 1;
        await client.set(`event:${eventId}`, JSON.stringify(event));
        return res.status(200).json({message: "Participant registered for an event successfully!"});
    }catch(err){
        console.log(err);
        return res.status(500).json({error: "Internal Server Error"});
    }
}

const viewPartipantsRegistration = async(req, res) =>{
    const client = req.app.locals.redisClient;
    const email = req.verifiedToken.email;
    const keys = await client.keys('participants:event:*');
    const registeredEvents = [];
    for (const key of keys) {
        const isMember = await client.sIsMember(key, email);
        if (isMember) {
            const eventId = key.split(':')[2];
            const eventData = await client.get(`event:${eventId}`);
            if (eventData) {
                registeredEvents.push(JSON.parse(eventData));
            }
        }
    }
    return res.status(200).json({ events: registeredEvents });
}

const participantsDeRegistration = async(req, res) =>{
    const client = req.app.locals.redisClient;
    const eventId = req.params.id;
    const email = req.verifiedToken.email;
    
    const checkExistingEvent = await client.get(`event:${eventId}`);
    if(!checkExistingEvent){
        return res.status(404).json({error: "Event not found!"});
    }
    const event = JSON.parse(checkExistingEvent);

    const isParticipant = await client.sIsMember(`participants:event:${eventId}`, email);
    if(!isParticipant){
        return res.status(409).json({error: "No registration found for the event"});
    }
    await client.sRem(`participants:event:${eventId}`, email);
    return res.status(200).json({message: "Participant deleted the Registration!"});
}

module.exports = {participantsRegistration, viewPartipantsRegistration, participantsDeRegistration};