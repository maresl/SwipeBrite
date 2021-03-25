const User = require("../models/User.js");
const Event = require("../models/Event.js");
const getNewEvents = require("../services/tmQueryService/tmEventQueries.js");
// require the Ticketmaster API call service functions

const newEvents = async (req, res) => {
  try {

    let response = []
    let isLoggedIn = false

    if (req.user) { // check to see if the user is logged in

      isLoggedIn = true

      const foundUser = await User.findById(req.user.id);

      const newLocation = `${req.body.lat.toFixed(2)} ${req.body.lng.toFixed(2)}`; // formatting the Location data to match User model

      if (foundUser.currentLatLng !== newLocation) { // if we're doing this because the user is at a new location
        foundUser.currentLatLng = newLocation // update their location
        foundUser.visitedPage = 0 // reset pagination
        foundUser.eventQueue = [] // empty their queue
        await foundUser.save()
      }

      if (foundUser.currentLatLng !== newLocation || foundUser.eventQueue.length < 5) {

        // Only need to proceed if the Location has changed or the queue is too short:

        const loggedInGetEventsFromTicketMaster = async () => {
          const preRunQueueLength = foundUser.eventQueue.length
          const newTMEventsData = await getNewEvents(
            { ...req.body },
            foundUser.visitedPage
          );

          const eventsForQueue = newTMEventsData.data._embedded.events;

          for (let i = 0; i < eventsForQueue.length; i++) {
            let existingEvent = await Event.findOne({
              eventID: eventsForQueue[i].id,
            }); // see if the event already exists

            let inHistory = -1;
            if (existingEvent) {
              inHistory = foundUser.eventHistory.indexOf(existingEvent._id); // if the event already exists, see if the user already has already seen it
              if (inHistory === -1) {
                let userWithHistory = await User.findOne(foundUser._id).populate(
                  "eventHistory"
                );
                let eventNameInHistory = userWithHistory.eventHistory.some((eventInHistory) => { // first pull the user's history with all the names
                  return eventInHistory.name === existingEvent.name
                })
                if (!eventNameInHistory) {
                  //console.log(`adding existing event ${existingEvent.eventID} to ${foundUser.email}'s queue`)
                  foundUser.eventHistory.push(existingEvent._id);
                  foundUser.eventQueue.push(existingEvent._id);
                  await foundUser.save();
                }
              } else {
                // otherwise it has already been in their queue at some point, skip it
                //console.log(`skippping ${existingEvent.eventID} as the user has it in their history`)
              }
            } else {
              // if the event doesn't exist, get ready to create it and add it to the queue
              let userWithHistory = await User.findOne(foundUser._id).populate(
                "eventHistory"
              );
              let eventNameInHistory = userWithHistory.eventHistory.some((eventInHistory) => { // first pull the user's history with all the names
                // console.log("eventInHistory.name:", eventInHistory.name)
                // console.log("eventsForQueue[i].name:", eventsForQueue[i].name)
                // console.log("therefore (eventInHistory.name === eventsForQueue[i].name):", (eventInHistory.name === eventsForQueue[i].name))
                return eventInHistory.name === eventsForQueue[i].name
              })
              if (!eventNameInHistory) { // only proceed if the user has not seen an event with that name
                let receivedImages = [];
                eventsForQueue[i].images.map((url) => { 
                  receivedImages.push(url.url);
                });
                const priceRangeConditional = (eventsForQueue[i].priceRanges) ? eventsForQueue[i].priceRanges[0].min : 0
                const newEvent = await Event.create({
                  eventID: eventsForQueue[i].id,
                  priceRange: priceRangeConditional,
                  dates: eventsForQueue[i].dates.start.localDate,
                  name: eventsForQueue[i].name,
                  images: receivedImages,
                  eventURL: eventsForQueue[i].url,
                  description: eventsForQueue[i].info,
                  classifications: eventsForQueue[i].classifications[0].segment.name,
                  venue: {
                    name: eventsForQueue[i]["_embedded"].venues[0].name,
                  },
                });
                // console.log("Created new event:", newEvent.eventID);
                foundUser.eventHistory.push(newEvent._id);
                foundUser.eventQueue.push(newEvent._id);
                await foundUser.save();
              }
            }
          }
          if (preRunQueueLength === foundUser.eventQueue.length || foundUser.eventQueue.length < 5) { // if the queue didn't get any longer, or isn't long enough
            foundUser.visitedPage++ // go to the next page
            await foundUser.save()
            await loggedInGetEventsFromTicketMaster() // try ticketmaster again
          }
        }
         await loggedInGetEventsFromTicketMaster()
      }
      // Uncomment to see what eventIDs a user has in their history after this whole thing runs:
      //let userWithEventHistory = await User.findOne(foundUser._id).populate('eventHistory')
      // let eventIds = []
      // userWithEventHistory.eventHistory.forEach((populatedEvent) => {
      //   eventIds.push(populatedEvent.eventID)
      // })
      // console.log("eventIds:", eventIds)

      let userWithQueue = await User.findOne(foundUser._id).populate(
        "eventQueue"
      );

      for (let i = 0; i < 5; i++) {
        response.push(userWithQueue.eventQueue[i]);
      }

    } else { // if the user is not logged in
      
      const newTMEventsData = await getNewEvents(
        { ...req.body },
        0
      );

      const eventsForQueue = newTMEventsData.data._embedded.events;

      for (let i = 0; i < eventsForQueue.length; i++) {
          let receivedImages = [];
          eventsForQueue[i].images.map((url) => {
            receivedImages.push(url.url);
          });
          response.push({
            eventID: eventsForQueue[i].id,
            priceRange: eventsForQueue[i].priceRanges[0].min,
            dates: eventsForQueue[i].dates.start.localDate,
            name: eventsForQueue[i].name,
            images: receivedImages,
            eventURL: eventsForQueue[i].url,
            description: eventsForQueue[i].info,
            classifications: eventsForQueue[i].classifications[0].segment.name,
            venue: {
              name: eventsForQueue[i]["_embedded"].venues[0].name,
            },
          })
      }
    }
    res.status(200).json({
      status: 200,
      response,
      requestAt: new Date().toLocaleString(),
      isLoggedIn
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
