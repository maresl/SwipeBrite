const db = require('../config/database')

const index = async ( req, res ) => {
    try {
      //const events = await dbCall;

      res.status(200).json({
        status: 200,
        message: "Hello World",
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

const indexCtrl = {
  index,
}

module.exports = indexCtrl;