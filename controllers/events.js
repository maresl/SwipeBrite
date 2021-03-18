const User = require("../models/User.js");
const Event = require("../models/Event.js");
const getNewEvents = require("../services/tmQueryService/tmEventQueries.js");
// require the Ticketmaster API call service functions

const newEvents = async (req, res) => {
  try {
    console.log("made it to newEvents function");

    const foundUser = await User.findById(req.user.id)
    
    const newLocation = `${req.body.lat} ${req.body.lng}` // formatting the Location data to match User model

    if (foundUser.location !== newLocation || foundUser.eventQueue.length < 5) { // Only need to proceed if the Location has changed or the queue is too short:
      
      console.log('calling ticketmaster')

      await User.findByIdAndUpdate(req.user._id, {location: newLocation}) // save the new location to the user

      const newTMEventsData = await getNewEvents({...req.body});
      // console.log(newTMEventsData.data);


      const eventsForQueue = newTMEventsData.data._embedded.events;

      let newEvents = []

      eventsForQueue.forEach((newTMEvent) => {
        //let existingEvent = Event.findOne() // TODO : figure out how to find by the event name // see if this event already exists
        let foundReviewedEvent = null
        if (existingEvent) {
       //   foundReviewedEvent = foundUser.eventHistory.filter(existingEvent._id) // if the event already exists, see if the user already reviewed it
        }
        // if (!foundReviewedEvent) { // if the user hasn't already reviewed it, put it it in the array which will be added to the queue
        //   foundUser.eventHistory.push()
        //   const new Event = await Event.create({
        //     eventID: newTMEvent.id,
        //     priceRange: newTMEvent.priceRanges[0].min,
        //     dates: newTMEvent.dates.start.localDate,
        //     eventURL: newTMEvent.url,
        //     description: newTMEvent.info,
        //     classifications: newTMEvent.classifications[0].segment.name,
        //     venue: {
        //       name: newTMEvent["_embedded"].venues[0].name,
        //     }, // image url not handled yet
        //   });
        //}
      });
      console.log("==============ARRAY TO BE ADDED TO EVENTS DATABASE==============")
      console.log(newEvents)
      //const addedEvents = await db.Events.insertMany(newEvents);
    }
    const response = getFiveFromQueue(req.user.id)
    res.status(200).json({
      status: 200,
      response,
      requestAt: new Date().toLocaleString(),
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: 500,
      message: "Something went wrong!",
      requestAt: new Date().toLocaleString(),
    });
  }
};

const getFiveFromQueue = (userId) => {
  return userId // TODO: figure out if this has to be async or maybe even not it's own function
}

const showLikedEvents = async (req, res) => {
  try {
    const foundUser = await User.findById(req.user.id);

    const likedEvents = [];

    for (const event of foundUser.likedEvents) {
      const foundEvent = await db.Events.findById(event);
      likedEvents.push(foundEvent);
    }

    return res.status(200).json({
      status: 200,
      likedEvents,
      requestedAt: new Date().toLocaleString(),
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      error,
      requestedAt: new Date().toLocaleDateString(),
    });
  }
};

const eventsCtrl = {
  newEvents,
  showLikedEvents,
};

module.exports = eventsCtrl;
