const celda = {
    props: ['objetoCelda'],
    template: "#celda-template",
};
const tablero = {
    template: "#tablero-template",
    data: function () {
        return {
            ganar:false,
            perder:false,
            tablero: [],
            dificultad: {
                fil: '',
                col: '',
                bom: '',
                band: '',
            }
        }
    },
    methods: {
        colocarBandera(objetoCelda) {
            if (this.dificultad.band>0) {
                if (objetoCelda.revelado==false) {
                    objetoCelda.bandera = !objetoCelda.bandera;
                    if (objetoCelda.bandera==true) {
                        objetoCelda.norevelado='⛳';
                    }else {
                        objetoCelda.norevelado='';
                    }    
                    this.contarBanderas(objetoCelda);
                }
            }else {
                if (objetoCelda.bandera==true) {
                    objetoCelda.bandera = !objetoCelda.bandera;
                    objetoCelda.norevelado='';
                    this.dificultad.band++
                }
            }
        },
        revelarCelda(objetoCelda) {
            if (!objetoCelda.revelado) {
                objetoCelda.revelado=true;
                this.ganarJuego();
            }
            if (objetoCelda.numero==0) {
                this.revelarVacios(objetoCelda);
            }
            if (objetoCelda.bomba==true) {
                this.revelarTodos();
                this.perder=true;
            }
            this.verificarBanderas();
        },
        verificarBanderas() {
            var b=0;
            for (let i=0; i<this.dificultad.fil; i++) {
                for (let j=0; j<this.dificultad.col; j++) {
                    if (this.tablero[i][j].revelado==true && this.tablero[i][j].bandera==true) {
                        this.tablero[i][j].bandera=false;
                        b=this.dificultad.band++
                    }
                }
            }
        },
        contarBanderas(objetoCelda) {
            if (objetoCelda.bandera==true) {
                this.dificultad.band--
            }
            if (objetoCelda.bandera==false) {
                this.dificultad.band++
            }
        },
        ganarJuego() {
            var casillas=this.dificultad.fil*this.dificultad.col;
            var casillasTotales=casillas-this.dificultad.bom;
            var casillasDescubiertas=0;
            for (let i=0; i<this.dificultad.fil; i++) {
                for (let j=0; j<this.dificultad.col; j++) {
                    if (this.tablero[i][j].revelado==true) {
                        casillasDescubiertas++
                    }
                    if (casillasDescubiertas==casillasTotales) {
                        this.ganar=true;
                    }
                }
            }
        },
        revelarTodos() {
            for (let i=0; i<this.dificultad.fil; i++) {
                for (let j=0; j<this.dificultad.col; j++) {
                    if (this.tablero[i][j].revelado==false) {
                        this.tablero[i][j].revelado=true;
                    }
                }
            }
        },
        revelarVacios(objetoCelda) {
            var i=objetoCelda.x;
            var j=objetoCelda.y;
            for (let x=-1; x<=1; x++) {
                for (let y=-1; y<=1; y++) {
                    if (x==0 && y==0) {
                        continue
                    }
                    try {
                        if (this.tablero[i+x][j+y].revelado==false) {
                            if (this.tablero[i+x][j+y].bomba==false) {
                                this.tablero[i+x][j+y].revelado=true;
                                if (this.tablero[i+x][j+y].numero==0) {
                                    objetoCelda.x=i+x;
                                    objetoCelda.y=j+y;
                                    this.revelarVacios(objetoCelda);
                                }
                            }
                        }
                    } catch (e) {}
                }
            }
        },
        colocarNumeros() {
            for (let i=0; i<this.dificultad.fil; i++) {
                for (let j=0; j<this.dificultad.col; j++) {
                    if (!this.tablero[i][j].bomba) {
                        var total=0;
                        for (let x=-1; x<=1; x++) {
                            for (let y=-1; y<=1; y++) {
                                if (x==0 && y==0) {
                                    continue
                                }
                                try {
                                    if (this.tablero[i+x][j+y].bomba==true) {
                                        total++
                                    }
                                } catch (e) {}
                            }
                        }
                        this.tablero[i][j].numero=total;
                    }
                }
            }
        },
        colocarBombas() {
            var bombasColocadas=0;
            while (this.dificultad.bom > bombasColocadas) {
                var celi = Math.floor(Math.random()*this.dificultad.fil);
                var celj = Math.floor(Math.random()*this.dificultad.col);
                if (!this.tablero[celi][celj].bomba) {
                    this.tablero[celi][celj].bomba=true;
                    this.tablero[celi][celj].numero='💣';
                }else {
                    bombasColocadas--
                }
                bombasColocadas++
            }
            this.colocarNumeros();
        },
        llenarGrilla() {
            class celda {
                norevelado=''
                revelado=false
                bandera=false
                bomba=false
                numero=0
                x=0
                y=0
            }
            this.tablero=[]
            for (let i=0; i<this.dificultad.fil; i++) {
                var cuadro=[];
                for (let j=0; j<this.dificultad.col; j++) {
                    objetoCelda = new celda
                    objetoCelda.x=i
                    objetoCelda.y=j
                    cuadro.push(objetoCelda);
                }
                this.tablero.push(cuadro);
            }
            this.colocarBombas();
        },
        dificultadPrincipiante() {
            this.ganar=false;
            this.perder=false;
            this.dificultad = {
                fil: 5,
                col: 5,
                bom: 10,
                band: 10,
            },
            this.llenarGrilla();
        },
        dificultadIntermedio() {
            this.ganar=false;
            this.perder=false;
            this.dificultad = {
                fil: 10,
                col: 10,
                bom: 20,
                band: 20,
            },
            this.llenarGrilla();
        },
        dificultadAvanzado() {
            this.ganar=false;
            this.perder=false;
            this.dificultad = {
                fil: 15,
                col: 15,
                bom: 30,
                band: 30,
            },
            this.llenarGrilla();
        }
    },
    components: {
        celda,
    }
};
const vm = new Vue({
    el: "#app",
    data: {
        tablero: [],
        dificultad: {
            fil: '',
            col: '',
            bom: '',
            band: '',
        }
    },
    components: {
        tablero,
    }
});