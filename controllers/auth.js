const db = require('../config/database')

const create = async ( req, res ) => {
    try {
      //const events = await dbCall;

      res.status(200).json({
        status: 200,
        message: "..creating a new user... please wait",
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

const authCtrl = {
  create,
}

module.exports = authCtrl;