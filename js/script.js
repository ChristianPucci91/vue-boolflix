

// Avvio e dichiaro vue nel container
var app = new Vue({
  el: "#root",
  data: {
    logo:'img/logo.png', // logo boolfix
    en:'img/en.png', // bandiera per nazionalità film
    it:'img/it.png', // bandiera per nazionalità film
    apiKey:'da0d46e7635a0896a9556496ca9aabfb',
    search:'', // v-model per cercare i film
    movies:[],
    series:[] // array dei film
  },
  methods: {// andiamo a richiedere all'API tutti i film e li associamo al nostro array movies con un mounted, non appena si crea l'istanza di Vue
    filter () {

      axios.get('https://api.themoviedb.org/3/search/movie', {
        params: {
          api_key: this.apiKey, // apikey salvata nei parametri di data
          query: this.search // associamo a query il valore di quello che andremo ad inserire
        }
      })
      .then(risp =>{
        this.movies = risp.data.results;
      });
      axios.get('https://api.themoviedb.org/3/search/tv', {
        params: {
          api_key: this.apiKey, // apikey salvata nei parametri di data
          query: this.search // associamo a query il valore di quello che andremo ad inserire
        }
      })
      .then(risp =>{
        this.series = risp.data.results;
      });

    },

    //Funzione per trarre un voto da una scala di 10 a 5 Milestone 2
    // Se il voto è 8 lui ritornerà 4
      getStars(vote_average) {
          return Math.ceil(vote_average / 2);
      },
      imgPlaceholder:function (e) {  // quando non si trovano bandiere andrà in errore e aggiungerà questa di default
       e.target.src = "img/world.png"
      }
  }
});
