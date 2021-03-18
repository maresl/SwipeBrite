const User = require("../models/User.js");
const Event = require("../models/Event.js");
const getNewEvents = require("../services/tmQueryService/tmEventQueries.js");
// require the Ticketmaster API call service functions

const newEvents = async (req, res) => {
  try {
    const foundUser = await User.findById(req.user.id)
    
    const newLocation = `${req.body.lat} ${req.body.lng}` // formatting the Location data to match User model

    if (foundUser.currentLatLng !== newLocation || foundUser.eventQueue.length < 5) { // Only need to proceed if the Location has changed or the queue is too short:
      
      console.log('calling ticketmaster')

      await User.findByIdAndUpdate(foundUser._id, {currentLatLng: newLocation}) // save the new location to the user < this is not working

      const newTMEventsData = await getNewEvents({...req.body});
      // console.log(newTMEventsData.data);


      const eventsForQueue = newTMEventsData.data._embedded.events;

      let newEvents = []



      for (let i = 0; i < eventsForQueue.length; i++) {

        let existingEvent = await Event.findOne({eventID: eventsForQueue[i].id}) // TODO : figure out how to find by the event name // see if this event already exists
        //console.log("EXISTING EVENT:", existingEvent.eventID)

        let inHistory = -1
        if (existingEvent) {
          inHistory = foundUser.eventHistory.indexOf(existingEvent._id) // if the event already exists, see if the user already reviewed it
        }
        if (inHistory === -1) { // if the user hasn't already reviewed it, put it it in the array which will be added to the queue
          
          const newEvent = await Event.create({
            eventID: eventsForQueue[i].id,
            priceRange: eventsForQueue[i].priceRanges[0].min,
            dates: eventsForQueue[i].dates.start.localDate,
            eventURL: eventsForQueue[i].url,
            description: eventsForQueue[i].info,
            classifications: eventsForQueue[i].classifications[0].segment.name,
            venue: {
              name: eventsForQueue[i]["_embedded"].venues[0].name,
            }, // image url not handled yet
          });
          console.log("new event:", newEvent.eventID)
          foundUser.eventHistory.push(newEvent._id)
          foundUser.eventQueue.push(newEvent._id)
          await foundUser.save()
        } else {
          console.log("skipping ", eventsForQueue[i].id)
        }
      };
    }
    //console.log("eventHistory:", foundUser.eventHistory)
    //console.log("eventQueue:", foundUser.eventQueue)
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
