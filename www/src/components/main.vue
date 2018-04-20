<template>
  <div class="mt-3">
    <h3>DVAX Open Interest</h3>
    <div class="form-inline my-5">
      <label for="expiration">Expiration</label>
      <select class="ml-2 form-control" name="expiration">
        <option
          v-for="exp in expirations"
          :value="exp"
          :selected="exp.expiration_date === selected"
        >
          {{exp}}
        </option>
      </select>
    </div>

    <div class="d-flex justify-content-around">
      <div>
        <h4>Calls</h4>
        <table class="table table-striped mt-3">
          <thead>
            <tr>
              <th>Strike</th>
              <th>Current OI</th>
              <th>Change (1d, 5d, 20d)</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="call of calls">
              <td>{{call.strike}}</td>
              <td>{{call.open_interest}}</td>
              <td></td>
            </tr>
          </tbody>
        </table>
      </div>

      <div>
        <h4>Puts</h4>
        <table class="table table-striped mt-3">
          <thead>
            <tr>
              <th>Strike</th>
              <th>Current OI</th>
              <th>Change (1d, 5d, 20d)</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="put of puts">
              <td>{{put.strike}}</td>
              <td>{{put.open_interest}}</td>
              <td></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
const baseUrl = 'http://localhost:3000/';

function sortByStrike( options ) {
  return [ ...options ].sort( ( a, b ) => a.strike - b.strike );
}

function groupByStrike( options ) {
  // { strike: <string>, options: <array> }
  let grouped = [];

  options.forEach( option => {
    const exists = grouped.find( g => g.strike === option.strike );

    if ( exists ) {
      exists.options.push( option );
    } else {
      grouped.push({ strike: option.strike, options: [ option ] });
    }
  });

  return grouped;
}

function appendLatestOpenInterest( groupedByStrike ) {
  return groupedByStrike.map( obj => {
    return Object.assign( obj, {
      open_interest: obj.options[ 0 ].open_interest
    });
  });
}

function mutateForTable( options ) {
  const mutations = [
    groupByStrike,
    appendLatestOpenInterest,
    sortByStrike
  ];

  return mutations.reduce( ( arr, fn ) => fn( arr ), options);
}

export default {

  data() {
    return {
      expirations: [],
      selected: '',
      calls: [],
      puts: []
    }
  },

  watch: {

    async selected( newValue ) {
      const queryString = `?data.expiration_date=${newValue}`;
      const response = await fetch(`${baseUrl}options${queryString}`);
      const options = await response.json();
      let calls = [];
      let puts = [];

      options.forEach( option => {
        option.data.option_type === 'call'
          ? calls.push( option.data )
          : puts.push( option.data );
      });

      this.calls = mutateForTable( calls );
      this.puts = mutateForTable( puts );
    }

  },

  async created() {
    const response = await fetch(`${baseUrl}expirations`);
    this.expirations = await response.json();
    this.selected = this.expirations[ 0 ];
  }

}
</script>
