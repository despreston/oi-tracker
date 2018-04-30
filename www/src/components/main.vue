<template>
  <div>
    <h3 class="mb-5">DVAX Open Interest</h3>

    <div class="card">
      <h5 class="card-header">Couple things</h5>
      <div class="card-body">
        <p class="card-text">
          1. If the <strong>Change</strong> column has a zero value, it might be because theres just not enough data to compare that far back.
        </p>
        <p>
          2. Feel free to click on the <strong>Strike</strong> to check out a more detailed view.
        </p>
      </div>
    </div>

    <canvas id="chart" width="300" height="100"></canvas>

    <div class="form-inline my-5">
      <label for="expiration">Expiration</label>
      <select class="ml-2 form-control" name="expiration" v-model="selected">
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
              <td class="text-center">
                <router-link v-bind:to="'/options/by-symbol/' + call.symbol">  {{call.strike}}
                </router-link>
              </td>
              <td class="text-center">{{call.open_interest}}</td>
              <td class="text-center">
                <span v-bind:class="changeTextStyle(call.change[1])">
                  {{call.change[1]}}
                </span>,
                <span v-bind:class="changeTextStyle(call.change[5])">
                  {{call.change[5]}}
                </span>,
                <span v-bind:class="changeTextStyle(call.change[20])">
                  {{call.change[20]}}
                </span>
              </td>
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
              <td class="text-center">
                <router-link v-bind:to="'/options/by-symbol/' + put.symbol">  {{put.strike}}
                </router-link>
              </td>
              <td class="text-center">{{put.open_interest}}</td>
              <td class="text-center">
                <span v-bind:class="changeTextStyle(put.change[1])">
                  {{put.change[1]}}
                </span>,
                <span v-bind:class="changeTextStyle(put.change[5])">
                  {{put.change[5]}}
                </span>,
                <span v-bind:class="changeTextStyle(put.change[20])">
                  {{put.change[20]}}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>

/**
 * Sorts the options by strike
 * @param { Array } options - List of options that contains `strike` field.
 * @return { Array } Options objects sorted by strike in ascending order.
 */
function sortByStrike( options ) {
  return [ ...options ].sort( ( a, b ) => a.strike - b.strike );
}

/**
 * Returns object with the strike price and list of options
 * @param { Array } options - List of options
 * @return { Array } Options grouped by strike
 */
function groupByStrike( options ) {
  // { strike: <string>, options: <array> }
  let grouped = [];

  options.forEach( option => {
    const exists = grouped.find( g => g.strike === option.data.strike );

    if ( exists ) {
      exists.options.push( option );
    } else {
      grouped.push({ strike: option.data.strike, options: [ option ] });
    }
  });

  return grouped;
}

/**
 * Adds the `open_interest` field to each strike
 *
 * @param { Array } groupedByStrike - List of strikes with each option w/ that * strike.
 *
 * @return { Array }
 */
function appendLatestOpenInterest( groupedByStrike ) {
  return groupedByStrike.map( obj => {
    return Object.assign( obj, {
      open_interest: obj.options[ 0 ].data.open_interest
    });
  });
}

/**
 * Takes the list of options and mutates to be displayed in the UI
 * Order of execution matters here
 */
function mutateForTable( options ) {
  const mutations = [
    groupByStrike,
    appendLatestOpenInterest,
    sortByStrike,
    appendChanges,
    appendOptionSymbol
  ];

  return mutations.reduce( ( arr, fn ) => fn( arr ), options);
}

function todayMinusDays( days, d = new Date() ) {
  return new Date( d.setDate( d.getDate() - days ) );
}

/**
 * Adds the field `changes` to each object.
 * @param { Array }
 */
function appendChanges( optionsByStrike ) {
  const numOfDays = [ '1', '5', '20' ];

  return optionsByStrike.map( byStrike => {
    const { options } = byStrike;

    const change = numOfDays.reduce( ( obj, day ) => {
      return Object.assign( obj, {
        [ day ]: changeBetweenDays( options, +day )
      });
    }, {});

    return Object.assign( byStrike, { change } );
  });
}

function appendOptionSymbol( optionsByStrike ) {
  return optionsByStrike.map( strike => (
    Object.assign( strike, { symbol: strike.options[ 0 ].data.symbol } )
  ));
}

/**
 * Given a list of options, calculate the difference between today's OI and
 * the OI from n days ago.
 */
function changeBetweenDays( options, daysAgo ) {
  const todayMinusDaysAgo = todayMinusDays( daysAgo ).toDateString();
  const latestOI = options.slice( -1 )[ 0 ].data.open_interest;

  const findOptionForDay = day => options.find( option => {
    return new Date( option.created_at ).toDateString() === todayMinusDaysAgo;
  });

  const previousOption = findOptionForDay( daysAgo );
  return previousOption ? latestOI - previousOption.data.open_interest : 0;
}

function createOpenInterestChart( data ) {
  new Chart( document.getElementById('chart'), {
    type: 'line',
    options: {
      legend: {
        display: false
      },
      title: {
        display: true,
        text: 'Total Open Interest',
        fontSize: 18
      },
      label: {
        display: false
      }
    },
    data: {
      labels: data.map( ( { _id } ) => _id ),
      datasets: [{
        lineTension: 0,
        fill: false,
        label: 'Open interest',
        borderColor: 'rgb(54, 162, 235)',
        backgroundColor: 'rgb(54, 162, 235)',
        data: data.map( ( { open_interest } ) => open_interest )
      }]
    }
  });
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

  methods: {
    changeTextStyle: function( change ) {
      return {
        'text-danger': change < 0,
        'text-success': change > 0
      };
    }
  },

  watch: {

    async selected( newValue ) {
      const expiration = new Date( newValue );
      expiration.setUTCHours( 0, 0, 0, 0 );

      const url = [ window.baseUrl, 'options', '?', [
        `data.expiration_date=${expiration.toISOString()}`,
        `after=${todayMinusDays( 20 ).toISOString()}`
      ].join('&') ].join('');

      const response = await fetch( url );
      const options = await response.json();
      let calls = [];
      let puts = [];

      options.forEach( option => {
        option.data.option_type === 'call'
          ? calls.push( option )
          : puts.push( option );
      });

      this.calls = mutateForTable( calls );
      this.puts = mutateForTable( puts );
    }

  },

  async mounted() {
    const url = `${window.baseUrl}options/daily-open-interest`;
    const response = await ( await fetch( url ) ).json();
    createOpenInterestChart( response );
  },

  async created() {
    const response = await fetch( `${window.baseUrl}expirations` );
    const json = await response.json();

    this.expirations = json.map( expiration => {
      return new Date( expiration ).toUTCString();
    });

    this.selected = this.expirations[ 0 ];
  }

}
</script>
