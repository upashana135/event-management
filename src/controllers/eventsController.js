const getEvents = (req, res) => {
    const events = req.app.locals.events;
    return res.status(200).json(events)
}

const createEvents = async(req, res) =>{
    const events = req.app.locals.events;
    const email = req.verifiedToken.email;
    let lastEventId = 0;
    if(events.length >0 ){
        lastEventId = events[events.length-1].eventId;
    }
    let eventId = lastEventId + 1;
    const newEvent = {eventId, organizer: email, ...req.body};
    await events.push(newEvent);
    return res.status(200).json({message: "New event created!", eventId: eventId});
}

const updateEvents = async(req, res) =>{
    const events = req.app.locals.events;
    let {eventId, name, date, time, participants} = req.body;
    const email = req.verifiedToken.email;
    let existingEvent = await events.find((event) => event.eventId == eventId);
    if(!existingEvent){
        return res.status(404).json({error: "Event not found!"});
    }
    if(existingEvent.organizer !== email){
        return res.status(403).json({ message: "Forbidden: Access denied for your role" });
    }
    Object.assign(existingEvent, {name, date, time, participants});
    return res.status(200).json({message: "Event updated successfully!", existingEvent: events});
}

const deleteEvents = async(req, res) =>{
    const events = req.app.locals.events;
    const participants = req.app.locals.participants;
    let index = -1;
    const eventId = req.params.id;
    const email = req.verifiedToken.email;
    let existingEvent = await events.find((event) => event.eventId == eventId);
    index = events.findIndex(event => event.eventId === parseInt(eventId));
    if(index === -1){
        return res.status(404).json({error: "Event not found!"});
    }
    if(existingEvent.organizer !== email){
        return res.status(403).json({ message: "Forbidden: Access denied for your role" });
    }
    const eventRegistrationCount = participants.find(p => p.eventId === eventId);
    if(eventRegistrationCount){
        return res.status(403).json({ message: "Participants already registered for the event!" });
    }
    events.splice(index, 1);
    return res.status(200).json({message: "Event deleted successfully!"});
}

module.exports = {getEvents, createEvents, updateEvents, deleteEvents};