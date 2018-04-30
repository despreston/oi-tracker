'use strict';

const db = require('../db');

module.exports = async( get ) => {

  const Options = ( await db() ).collection('options');

  get( '/api/options', async( request, reply ) => {
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

      if ( filter['data.expiration_date'] ) {
        const date = new Date( filter['data.expiration_date'] );
        filter['data.expiration_date'] = date;
      }

      const query = await Options.find( filter );
      const result = await query.toArray();
      reply.send( result );
    } catch ( err ) {
      console.log( err );
      reply.sendStatus( 500 );
    }
  });

  get( '/api/options/by-symbol/:symbol', async( request, reply ) => {
    try {
      const { symbol } = request.params;
      const query = await Options.find({ 'data.symbol': symbol });
      const result = await query.toArray();
      reply.send( result );
    } catch ( err ) {
      console.log( err );
      reply.sendStatus( 500 );
    }
  });

};
