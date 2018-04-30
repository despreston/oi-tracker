<template>
  <div>
    <h3>{{description}}</h3>
    <canvas id="open_interest" width="300" height="100"></canvas>
  </div>
</template>

<script>
const dateFromString = string => new Date( string ).toLocaleDateString();

function createOpenInterestChart( options ) {
  new Chart( document.getElementById('open_interest'), {
    type: 'line',
    options: {
      title: {
        display: true,
        text: 'Open interest over time',
        fontSize: 18
      },
      label: {
        display: false
      }
    },
    data: {
      labels: options.map( option => dateFromString( option.created_at ) ),
      datasets: [{
        fill: false,
        label: 'Open interest',
        borderColor: 'rgb(54, 162, 235)',
        backgroundColor: 'rgb(54, 162, 235)',
        data: options.map( option => option.data.open_interest )
      }]
    }
  });
}

export default {

  data() {
    return {
      description: ''
    }
  },

  async mounted() {
    const { symbol } = this.$route.params;
    const url = `${window.baseUrl}options/by-symbol/${symbol}`;
    const response = await ( await fetch( url ) ).json();
    this.description = response.length && response[ 0 ].data.description;
    createOpenInterestChart( response );
  }

}
</script>
