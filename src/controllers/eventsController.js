const getEvents = (req, res) => {
    const events = req.app.locals.events;
    return res.status(200).json(events)
}

const createEvents = async(req, res) =>{
    const client = req.app.locals.redisClient;
    const email = req.verifiedToken.email;
    try{
        const eventId = await client.incr("event:lastId");
        const newEvent = {eventId, organizer: email, ...req.body};
        await client.set(`event:${eventId}`, JSON.stringify(newEvent));
        await client.rPush("events:list", String(eventId));
        return res.status(200).json({message: "New event created!", eventId: eventId});
    }catch(err){
        console.log(err);
        return res.status(500).json({error: "Internal Server Error"});
    }
}

const updateEvents = async(req, res) =>{
    const client = req.app.locals.redisClient;
    let {eventId, name, date, time, participants} = req.body;
    const email = req.verifiedToken.email;

    try{
        const checkExistingEvent = await client.get(`event:${eventId}`);
        if(!checkExistingEvent){
            return res.status(404).json({error: "Event not found!"});
        }
        existingEvent = JSON.parse(checkExistingEvent);
        if(existingEvent.organizer !== email){
            return res.status(403).json({ message: "Forbidden: Access denied for your role" });
        }
        const updatedEvent = {
            ...existingEvent,
            name: name || existingEvent.name,
            date: date || existingEvent.date,
            time: time || existingEvent.time,
            participants: participants || existingEvent.participants,
          };
        await client.set(`event:${eventId}`, JSON.stringify(updatedEvent));
        return res.status(200).json({message: "Event updated successfully!", eventDetails: updatedEvent});
    }catch(err){
        console.log(err);
        return res.status(500).json({error: "Internal Server Error"});
    } 
}

const deleteEvents = async(req, res) =>{
    const client = req.app.locals.redisClient;
    const eventId = req.params.id;
    const email = req.verifiedToken.email;

    try{
        const checkExistingEvent = await client.get(`event:${eventId}`);
        if(!checkExistingEvent){
            return res.status(404).json({error: "Event not found!"});
        }

        existingEvent = JSON.parse(checkExistingEvent);
        if(existingEvent.organizer !== email){
            return res.status(403).json({ message: "Forbidden: Access denied for your role" });
        }

        await client.del(`event:${eventId}`);
        await client.lRem("events:list", 0, String(eventId));
        return res.status(200).json({message: "Event deleted successfully!"});
    }catch(err){    
        console.log(err);
        return res.status(500).json({error: "Internal Server Error"});
    }
}

module.exports = {getEvents, createEvents, updateEvents, deleteEvents};