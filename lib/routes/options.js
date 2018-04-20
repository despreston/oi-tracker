const db = require('../db');

module.exports = async( get ) => {

  const Options = ( await db() ).collection('options');

  get( '/options', async( request, reply ) => {
    try {
      const { after, before, ...filter } = request.query;

      if ( after ) {
        filter.created_at = { $gte: new Date( after ) };
      }

      if ( before ) {
        let lt = { $lte: new Date( before ) };

        filter.created_at = filter.created_at
          ? { ...filter.created_at, ...lt }
          : lt;
      }

      const query = await Options.find( filter )
      const result = await query.toArray();
      reply.send( result );
    } catch ( err ) {
      console.log( err );
      reply.send( 500 );
    }
  });

};
