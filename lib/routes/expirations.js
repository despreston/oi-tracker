const db = require('../db');

module.exports = async( get ) => {

  const Options = ( await db() ).collection('options');

  get( '/api/expirations', async( request, reply ) => {
    try {
      const expirations = await Options.distinct('data.expiration_date');
      reply.send( expirations );
    } catch ( err ) {
      console.log( err );
      reply.send( err );
    }
  });

};
