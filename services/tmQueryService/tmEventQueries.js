/**
 *
 * Get All Events
 * @requires API_TOKEN  from .env
 * @requires axios
 * @see TicketMaster_API:
 * https://developer.ticketmaster.com/products-and-docs/apis/getting-started/
 *
 * @returns JSON response of all events
 */

/**
 * Location: Lat/Long
 * 20 miles,
 */
const axios = require("axios");
let today = new Date();
let twomonths = new Date(today.setDate(today.getDate() + 60)).toISOString();
const eventConfig = {
  RADIUS: 20,

  /*
    Placeholder for default time frame the user is looking for.
    startDateTime: Today's date in ISO format
    endDateTime: Today's date + 60 days
    */
  TIMEFRAME: {
    startDateTime: today.toISOString().slice(0, 10),
    endDateTime: twomonths.slice(0, 10),
  },
};
/**
 *
 * @param {} latLong
 * I'm expecting latLong to be an object with fields lat, long.
 */
const getAllEvents = async (latLong) => {
  try {
    console.log(latLong.lat, latLong.lng);
    return await axios.get(
      `https://app.ticketmaster.com/discovery/v2/events?apikey=${process.env.TICKETMASTER_API_KEY}&latlong=${latLong.lat},${latLong.lng}&radius=25&locale=*`
    );
  } catch (error) {
    console.log(error);
  }
};

module.exports = getAllEvents;
