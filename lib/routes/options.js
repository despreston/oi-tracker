const db = require('../db');

module.exports = async( get ) => {

  const Options = ( await db() ).collection('options');

  get( '/options', async( request, reply ) => {
    try {
      const query = await Options.find( request.query )
      const result = await query.toArray();
      reply.send( result );
    } catch ( err ) {
      console.log( err );
      reply.send( 500 );
    }
  });

};
