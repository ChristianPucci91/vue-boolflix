

// Avvio e dichiaro vue nel container
var app = new Vue({
  el: "#root",
  data: {
    logo:'img/logo0.png', // logo boolfix
    apiKey:'f1ec21274d82859fd9fa8b0300e9a3b5',
    search:'', // v-model per cercare i film
    genreMovies:[], // array generi film
    genreSeries:[], // array generi Serie Tv
    actorsMovies:[], // array attori film
    actorsSeries:[], // array attori Serie Tv
    allFilmTv:[], //array unificato
    preferiti:[],
    showDropFilm:false,
    showDropTv:false,
    showProfile:false,
    title:'Film & Serie TV del momento'
  },
  mounted: function (){
   this.sortPopularity();
  },
  methods: {// andiamo a richiedere all'API tutti i film e li associamo al nostro array movies con un mounted, non appena si crea l'istanza di Vue
    filter () {

      axios.get('https://api.themoviedb.org/3/search/movie', {
        params: {
          api_key: this.apiKey, // apikey salvata nei parametri di data
          query: this.search // associamo a query il valore di quello che andremo ad inserire
        }
      }).then(risp =>{
        this.allFilmTv = risp.data.results;

        //per ogni item dell'array creo il link con il codice poster_path associato al film
      });
      axios.get('https://api.themoviedb.org/3/search/tv', {
        params: {
          api_key: this.apiKey, // apikey salvata nei parametri di data
          query: this.search // associamo a query il valore di quello che andremo ad inserire
        }
      }).then(risp =>{

        this.allFilmTv = [...this.allFilmTv, ...risp.data.results]
        this.allFilmTv.forEach((item) => {

          item.overview = this.overFlow(item.overview);

          if (item.poster_path == null) {
            item.poster_path = 'img/placeholder.png'
          }else{
            item.poster_path = `https://image.tmdb.org/t/p/w342/${item.poster_path}`;
          }
        });
      });
      if (this.search != '') {
        this.title = this.search;
      }
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
       this.genreMovies = risp.data.genres;
      });
      axios.get('https://api.themoviedb.org/3/tv/' + id + '?api_key=' + this.apiKey + '&append_to_response=credits').then(risp =>{
        // vogliamo solo i primi 5 attori quindi pushamo nell'array i primi 5 risultati
        for (let i = 0; i < 5; i++) {
          this.actorsSeries.push(risp.data.credits.cast[i]);
       }
       this.genreSeries = risp.data.genres;
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
    overFlow(item) { // funzione per accorciare il testo superati i 200 caratteri
      if (item.length > 200){
        return item = item.slice(0,200).concat('...');
      };
    },
    sortPopularity(){  // funzione per prendere film e serie più popolari
      axios.get('https://api.themoviedb.org/3/discover/movie?&sort_by=popularity.desc&include_adult=false&include_video=false&page=1', {
        params:{
          api_key: this.apiKey
        }
      }).then(risp =>{
        this.allFilmTv = risp.data.results;

      });
      axios.get('https://api.themoviedb.org/3/discover/tv?&sort_by=popularity.desc&include_adult=false&include_video=false&page=1', {
        params:{
          api_key: this.apiKey
        }
      }).then(risp =>{
        this.allFilmTv = [...this.allFilmTv,...risp.data.results]
        this.allFilmTv.forEach((item) => {

          item.overview = this.overFlow(item.overview);

          if (item.poster_path == null) {
            item.poster_path = 'img/placeholder.png';
          }
          else{
            item.poster_path = `https://image.tmdb.org/t/p/w342${item.poster_path}`;
          }
        });
      });
    },
    bygenreFilm(id){ //MILESTONE 6 scelta per genere a seconda se si sceglie un film o una serie tv
      axios.get('https://api.themoviedb.org/3/discover/movie?api_key='+ this.apiKey + '&with_genres=' + id).then(risp =>{
        this.allFilmTv = risp.data.results;
        this.allFilmTv.forEach((item) => {

          item.overview = this.overFlow(item.overview);

          if (item.poster_path == null) {
            item.poster_path = 'img/placeholder.png';
          }else{
            item.poster_path = `https://image.tmdb.org/t/p/w342/${item.poster_path}`;
          }
        });
      })
      switch (id) { // controllo per far visualizzare all'utente quale categoria ha scelto
       case 28: this.title = 'Film - Action'
         break;
       case 12: this.title = 'Film - Adventure'
         break;
       case 16: this.title = 'Film - Animation'
         break;
       case 35: this.title = 'Film - Comedy'
         break;
       case 80: this.title = 'Film - Crime'
         break;
       case 99: this.title = 'Film - Documentary'
         break;
       case 18: this.title = 'Film - Drama'
         break;
       case 10751: this.title = 'Film - Family'
         break;
       case 14: this.title = 'Film - Fantasy'
         break;
       case 36: this.title = 'Film - History'
         break;
       case 27: this.title = 'Film - Horror'
         break;
       case 10402: this.title = 'Film - Music'
         break;
       case 9648: this.title = 'Film - Mystery'
         break;
       case 10749: this.title = 'Film - Romance'
         break;
       case 878: this.title = 'Film - Science Fiction'
         break;
       case 10770: this.title = 'Film - Tv Movie'
         break;
       case 53: this.title = 'Film - Thriller'
         break;
       case 10752: this.title = 'Film - War & Politics'
         break;
       }
    },
    bygenreTv(id){

      axios.get('https://api.themoviedb.org/3/discover/tv?api_key='+ this.apiKey + '&with_genres=' + id).then(risp =>{
        this.allFilmTv = risp.data.results;
        this.allFilmTv.forEach((item) => {

          item.overview = this.overFlow(item.overview);

          if (item.poster_path == null) {
            item.poster_path = 'img/placeholder.png';
          }else{
            item.poster_path = `https://image.tmdb.org/t/p/w342/${item.poster_path}`;
          }
        });
      })

      switch (id) {
       case 10759: this.title = 'Serie TV - Action'
         break;
       case 16: this.title = 'Serie TV - Animation'
         break;
       case 37: this.title = 'Serie TV - Western'
         break;
       case 35: this.title = 'Serie TV - Comedy'
         break;
       case 80: this.title = 'Serie TV - Crime'
         break;
       case 99: this.title = 'Serie TV - Documentary'
         break;
       case 18: this.title = 'Serie TV - Drama'
         break;
       case 10751: this.title = 'Serie TV - Family'
         break;
       case 10762: this.title = 'Serie TV - Kids'
         break;
       case 10763: this.title = 'Serie TV - News'
         break;
       case 10764: this.title = 'Serie TV - Reality'
         break;
       case 10765: this.title = 'Serie TV - Fantasy'
         break;
       case 9648: this.title = 'Serie TV - Mystery'
         break;
       case 10766: this.title = 'Serie TV - Soap'
         break;
       case 10767: this.title = 'Serie TV - Talk'
         break;
       case 10768: this.title = 'Serie TV - War & Politics'
         break;
       }
    },
    dropFilm(){ // funzione per il dropdown
      this.showDropFilm = !this.showDropFilm;
      this.showDropTv = false;
    },
    dropTv(){
      this.showDropTv = !this.showDropTv;
      this.showDropFilm = false;
    },

  }
});
