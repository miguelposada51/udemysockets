


export class GraficaEncuestaData  {
	
  private opciones: string[] = ['0','1','2','3'];
  private unidades : number[] = [0,0,0,0];

	constructor() {
		// code...
	}

	getDataGraficaEncuesta(){
		return [
         {data: this.unidades, label : 'Encuestas'}
		];
	}

    incrementarValor(opcion: string, valor:number){
     opcion = opcion.toLowerCase().trim();
      console.log('La pregunta es: '+opcion+ "y el valor" +valor); 

     if( this.opciones.indexOf(opcion) ){
       for( let i in this.opciones){
       
        if( this.opciones[i] === opcion ){
            this.unidades[i] += valor;            
        }
     
       }
     }
     

     return this.getDataGraficaEncuesta();


    }

}