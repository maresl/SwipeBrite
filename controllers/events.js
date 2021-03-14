const db = require('../config/database')
// require the Ticketmaster API call service functions 

const newEvents = async ( req, res ) => {

    try {

      // req.body should have the location data of the users (Lat and Long)
      // call services / Ticketmaster API to get a list of events back based on the user location
      const newTMEventsData = await getAllEvents(req.body.location)['_embedded'][events] // an array of TM event objects

      const newEvents = [];

      newTMEventsData.forEach( (newTMEvent) => {

        newEvents.push({
          eventID: newTMEvent.id,
          priceRange: 0, // PLACEHOLDER - do we need to make another API call to get this?
          dates: newTMEvent.dates.start.localDate,
          eventURL: newTMEvent.url,
          description: '', // PLACEHOLDER - do we need to make another API call to get this?
          classifications: newTMEvent.classifications[0].segment.name,
          venue: {
            location: newTMEvent['_embedded'].venues[0].location, // do we need this attribute? it's a latitude & longitude object
            name: newTMEvent['_embedded'].venues[0].name,
            address: newTMEvent['_embedded'].venues[0].address
          }
          // can we add image url to Events schema?
        })

      })

      const addedEvents = await db.Events.insertMany(newEvents)

      res.status(200).json({
        status: 200,
        addedEvents, // send all events found to front end. Front end can render 3 at a time, and call back end service again when the list runs out.
        requestAt: new Date().toLocaleString()
      });
  
    } catch (error) {
      res.status(500).json({
        status: 500,
        message: "Something went wrong!",
        requestAt: new Date().toLocaleString()
      });
    };
  };

const showLikedEvents = async ( req, res ) => {

  try {
    const foundUser = await db.User.findById (req.user._id)

    const likedEvents = []

    foundUser.likedEvents.forEach( (event) => {

      const foundEvent = await db.Events.findById(event)
      likedEvents.push(foundEvent)

    })

    return res.status(200).json({
      status: 200, 
      likedEvents,
      requestedAt: new Date().toLocaleString(),
    })

  } catch (error) {
    
    res.status(500).json({
      status: 500,
      error,
      requestedAt: new Date().toLocaleDateString()
    });
  };
}

const eventsCtrl = {
  newEvents,
  showLikedEvents,
}

module.exports = eventsCtrl;