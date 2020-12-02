

// Avvio e dichiaro vue nel container
var app = new Vue({
  el: "#root",
  data: {
    logo:'img/logo.png', // logo boolfix
    apiKey:'da0d46e7635a0896a9556496ca9aabfb',
    search:'ritorno al futuro', // v-model per cercare i film
    movies:[] // array dei film
  },
  mounted: // andiamo a richiedere all'API tutti i film e li associamo al nostro array movies con un mounted, non appena si crea l'istanza di Vue
    function () {

      axios.get('https://api.themoviedb.org/3/search/movie', {
        params: {
          api_key: this.apiKey, // apikey salvata nei parametri di data
          query: this.search, // associamo a query il valore di quello che andremo ad inserire
        }
      })
      .then(risp =>{
        this.movies = risp.data.results;
      })

    },


});
