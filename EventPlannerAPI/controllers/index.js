const index = ( req, res ) => {
  res.send('Hello World') 
};

const indexCtrl = {
  index,
}

module.exports = indexCtrl;