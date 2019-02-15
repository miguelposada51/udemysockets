


export class GraficaData  {
	
  private meses: string[] = ['enero','febrero','marzo','abril'];
  private valores : number[] = [0,0,0,0];

	constructor() {
		// code...
	}

	getDataGrafica(){
		return [
         {data: this.valores, label : 'ventas'}
		];
	}

    incrementarValor(mes: string, valor:number){
     mes = mes.toLowerCase().trim();
      console.log('el mes es: '+mes); 
     for( let i in this.meses){
     	
       if( this.meses[i] === mes ){
          	this.valores[i] += valor;
       }
     
     }

     return this.getDataGrafica();


    }

}