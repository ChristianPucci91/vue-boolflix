

// Avvio e dichiaro vue nel container
var app = new Vue({
  el: "#root",
  data: {
    logo:'img/logo.png', // logo boolfix
    apiKey:'da0d46e7635a0896a9556496ca9aabfb',
    search:'', // v-model per cercare i film
    movies:[],// array dei film
    series:[], // array delle serie tv
    genreMovies:[], // array generi film
    genreSeries:[], // array generi Serie Tv
    actorsMovies:[], // array attori film
    actorsSeries:[] // array attori Serie Tv
  },
  methods: {// andiamo a richiedere all'API tutti i film e li associamo al nostro array movies con un mounted, non appena si crea l'istanza di Vue
    filter () {

      axios.get('https://api.themoviedb.org/3/search/movie', {
        params: {
          api_key: this.apiKey, // apikey salvata nei parametri di data
          query: this.search // associamo a query il valore di quello che andremo ad inserire
        }
      }).then(risp =>{
        this.movies = risp.data.results;

        this.movies.forEach((item) => {

          item.overview = this.overFlow(item.overview);

          if (item.poster_path == null) {
            item.poster_path = 'img/placeholder.png';
          }else{
            item.poster_path = `https://image.tmdb.org/t/p/w342/${item.poster_path}`;
          }
        });
        //per ogni item dell'array creo il link con il codice poster_path associato al film
      });
      axios.get('https://api.themoviedb.org/3/search/tv', {
        params: {
          api_key: this.apiKey, // apikey salvata nei parametri di data
          query: this.search // associamo a query il valore di quello che andremo ad inserire
        }
      }).then(risp =>{

        this.series = risp.data.results;
        this.series.forEach((item) => {

          item.overview = this.overFlow(item.overview);

          if (item.poster_path == null) {
            item.poster_path = 'img/placeholder.png'
          }else{
            item.poster_path = `https://image.tmdb.org/t/p/w342/${item.poster_path}`;
          }
        });
      });
      this.search='';
    },
    //// Funzione per filtrare attori e generi MILESTONE 5
    filterCastGenre(id){
      this.actorsMovies=[]; // ogni volta che richiamiamo la funzione azzeriamo l'array altrimenti ogni evento di mouseenter l'array verrà popolato con i 5 attori
      this.actorsSeries=[];
      this.genreMovies=[];
      this.genreSeries=[];
      axios.get('https://api.themoviedb.org/3/movie/' + id + '?api_key=' + this.apiKey + '&append_to_response=credits').then(risp =>{
        // vogliamo solo i primi 5 attori quindi pushamo nell'array i primi 5 risultati
        for (let i = 0; i < 5; i++) {
          this.actorsMovies.push(risp.data.credits.cast[i]);
       }
       this.genreMovies.push(risp.data.genres);
      });
      axios.get('https://api.themoviedb.org/3/tv/' + id + '?api_key=' + this.apiKey + '&append_to_response=credits').then(risp =>{
        // vogliamo solo i primi 5 attori quindi pushamo nell'array i primi 5 risultati
        for (let i = 0; i < 5; i++) {
          this.actorsSeries.push(risp.data.credits.cast[i]);
       }
      });
    }, // TEST BONUS MILESTONE 5

    //Funzione per trarre un voto da una scala di 10 a 5 Milestone 2
    // Se il voto è 8 lui ritornerà 4
    getStars(vote_average) {
      return Math.ceil(vote_average / 2);
    },
    imgPlaceholder:function (e) {  // quando non si trovano bandiere andrà in errore e aggiungerà questa di default
      e.target.src = "img/world.png"
    },
    overFlow(item) {
      if (item.length > 200){
        return item = item.slice(0,200).concat('...');
      };
    }, // funzione per accorciare il testo superati i 200 caratteri
  }
});
