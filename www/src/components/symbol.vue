<template>
  <div>
    <h3>{{symbol}}</h3>
  </div>
</template>

<script>
const baseUrl = 'http://localhost:3000/';

export default {

  data() {
    return {
      symbol: '',
      options: []
    }
  },

  async created() {
    const { symbol } = this.$route.params;
    this.symbol = symbol;
    const response = await fetch( `${baseUrl}options/by-symbol/${symbol}` );
    this.options = await response.json();
  }
}
</script>
