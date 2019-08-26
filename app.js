new Vue({
    el:'#app',
    data() {
        return {
            currencies:{},
            show: true,
            amount:0,
            from:'EUR',
            to:'USD',
            results:0,
            loading:false,
            errored:false
        }
    },
    mounted() {
        this.getCurrencies();
    },
    computed: {
       formattedCurriencies(){
           return Object.values(this.currencies);
       },
       calculateCu(){
           if(!Number(this.amount)){
               return;
           }else{
           return (Number(this.amount) * (this.results)).toFixed(2);
           }
       },
       disabled(){
            return this.amount === 0 || this.amount ==="" || this.loading;
       },
       convert(){
           if(this.loading){
               return "Loading...";
           }else{
               return "Convert";
           }
       },
       error(){
           return this.errored;
       }
       
    },
    methods: {
        getCurrencies(){
        const currencies =localStorage.getItem('currencies');
        if(currencies){
            this.currencies =JSON.parse(currencies);
            return;
        }
        axios
        .get('https://free.currconv.com/api/v7/currencies?apiKey=bc8a7f15477e9d2aaef9')
        .then(Response =>{
            this.currencies = Response.data.results;
            console.log(Response.data.results);
            localStorage.setItem('currencies',JSON.stringify(Response.data.results));
        })
        .catch(error =>{
            console.log(error);
        })
        },
        getConvertion(){
            const key = `${this.from}_${this.to}`;
            this.loading = true;
            axios
            .get(`https://free.currconv.com/api/v7/convert?q=${key}&compact=ultra&apiKey=bc8a7f15477e9d2aaef9`)
            .then(Response =>{
                console.log(Response);
                this.results = Response.data[key];

            })
            .catch(error =>{
                console.log(error);
                this.errored = true;
            })
            .finally(()=>this.loading=false);

        }
        
    },
    watch: {
        from(){
            this.results = 0;
        },
        to(){
            this.results = 0;
        }
    },
})

//computed property will always refresh itself when there is changes