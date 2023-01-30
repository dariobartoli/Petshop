const app = Vue.createApp ({
    data(){
        return{
            allofThem: [],
            arrayJuguetes: [],
            arrayJuguetesRespaldo: [],
            arrayMedicamentos: [],
            arrayMedicamentosRespaldo: [],
            search: "",
            filtroPrecio: [],
            filtroPrecio2: [],
            carritoCompra: [],
            nombre:"",
            apellido:"",
            tel:0,
            template:false,
            alerta:false,
            formMuestra:true,
        }
    },
    created() {
        fetch("https://apipetshop.herokuapp.com/api/articulos")
            .then(response => response.json()
            .then(data => {
            this.allofThem = data.response
            this.arrayJuguetes = data.response.filter(producto => producto.tipo === "Juguete")
            this.arrayJuguetesRespaldo = this.arrayJuguetes
            this.arrayMedicamentos = data.response.filter(producto => producto.tipo === "Medicamento")
            this.arrayMedicamentosRespaldo = this.arrayMedicamentos
            console.log("Hola")
        })
        )
        .catch(err => console.error(err.message))
    },
    mounted(){
        let local = localStorage.getItem('carrito');
        if(local!=null){
            this.carritoCompra = JSON.parse(local)
        }
    },
    methods: {
        agregarCarrito(producto){
            if(producto.stock != 0){
                this.carritoCompra.push(producto)
                localStorage.setItem('carrito', JSON.stringify(this.carritoCompra))
                producto.stock--
            }
        },
        quitarCarrito(producto){
            this.carritoCompra = this.carritoCompra.filter(carrito => carrito != producto)
            producto.stock++
            localStorage.setItem('carrito', JSON.stringify(this.carritoCompra))
        },
        mensajeContacto(e){
            if(this.nombre=="" || this.apellido==""||this.tel==0){
                this.alerta=true
                e.preventDefault();
            }
            else{
                this.alerta=false
                e.preventDefault();
                this.template=true
                this.formMuestra=false
            }
        }
    },
    computed: {
        filtroDobleJuguetes(){
            let primerFiltro = this.arrayJuguetesRespaldo.filter(producto => producto.nombre.toLowerCase().includes(this.search.toLowerCase()))
            if (this.filtroPrecio.length){
                this.arrayJuguetes = primerFiltro.filter(producto => producto.precio < 600)
            }else if (this.filtroPrecio2.length){
                this.arrayJuguetes = primerFiltro.filter(producto => producto.precio > 600)
            }else{
                this.arrayJuguetes = primerFiltro
            }
        },
        filtroDobleMedicamentos(){
            let primerFiltro = this.arrayMedicamentosRespaldo.filter(producto => producto.nombre.toLowerCase().includes(this.search.toLowerCase()))
            if (this.filtroPrecio.length){
                this.arrayMedicamentos = primerFiltro.filter(producto => producto.precio < 600)
            }else if (this.filtroPrecio2.length){
                this.arrayMedicamentos = primerFiltro.filter(producto => producto.precio > 600)
            }else{
                this.arrayMedicamentos = primerFiltro
            }
        },
        totalCompra(){
            let precio = this.carritoCompra.map(producto => producto.precio)
            if(this.carritoCompra.length != 0){
                let total = precio.reduce(function (previousValue, currenteValue){
                    return previousValue + currenteValue
                })
                return total
            }
        },
    },
})
app.mount('#app')