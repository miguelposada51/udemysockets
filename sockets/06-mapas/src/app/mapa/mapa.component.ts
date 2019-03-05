import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Lugar } from '../interfaces/lugar';
import { HttpClient } from '@angular/common/http';
import { WebsocketService } from '../services/websocket.service';

@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.component.html',
  styleUrls: ['./mapa.component.css']
})
export class MapaComponent implements OnInit {

 @ViewChild('map') mapaElement : ElementRef;
 map: google.maps.Map;

 marcadores: google.maps.Marker[] = [];
 infoWindows: google.maps.InfoWindow[] = [];

 lugares: Lugar[] = [];

  constructor( private http: HttpClient,
  	public WsService: WebsocketService ) { }

  ngOnInit() {

  	this.http.get('http://localhost:5000/mapa')
  	  .subscribe( (lugares: Lugar[]) =>{
  	  	this.lugares = lugares;
  	  	console.log(lugares);
  		this.cargarMapa();
  	  })


  	this.escucharSockets();

  }

  escucharSockets(){
  		// marcador- nuevo
  		this.WsService.listen('marcador-nuevo')
  		 .subscribe( ( marcador: Lugar ) =>{
  		 	this.agregarMarcador( marcador );
  		 });
  		// marcador-mover

  		//marcaodor-borrar

  	}


  cargarMapa(){

  	const latLng = new google.maps.LatLng( 5.0688900, -75.5173800 );

  	const mapaOpciones: google.maps.MapOptions = {
  	 center: latLng,
  	 zoom: 13,
  	 mapTypeId: google.maps.MapTypeId.ROADMAP	
  	};

  this.map = new google.maps.Map( this.mapaElement.nativeElement, mapaOpciones );
  
  this.map.addListener( 'click', ( coors ) => {

  	const nuevoMarcador: Lugar = {
  	 nombre: 'Nuevo Lugar',
  	 lat: coors.latLng.lat(),
  	 lng : coors.latLng.lng(),
  	 id: new Date().toISOString()

  	};

  	this.agregarMarcador( nuevoMarcador );

  	this.WsService.emit('marcador-nuevo', nuevoMarcador );

  });

  for ( const lugar of this.lugares){
   this.agregarMarcador( lugar );	
  }

  }

  agregarMarcador( marcador: Lugar ){
   const latLng = new google.maps.LatLng( marcador.lat, marcador.lng );

   const marker = new google.maps.Marker({  
 	map: this.map,
 	animation: google.maps.Animation.DROP,
 	position: latLng,
 	draggable: true,
 	title: marcador.id 

   });

   this.marcadores.push( marker );

   const contenido = `<b>${ marcador.nombre }</b>`;
   const infoWindow = new google.maps.InfoWindow({
    content: contenido
   });

   this.infoWindows.push( infoWindow );

   google.maps.event.addDomListener( marker, 'click', () =>{

   	this.infoWindows.forEach( infoW => infoW.close() );
    infoWindow.open( this.map, marker );
   
   } );

   google.maps.event.addDomListener( marker, 'dblclick', (coors) =>{
   	marker.setMap( null );
   	// disparar el evento de socket para borrar el marcador
   } );

   google.maps.event.addDomListener( marker, 'drag', (coors) =>{

   	const nuevoMarcador = {
   	  lat: coors.latLng.lat(),
   	  lng: coors.latLng.lng(),
   	  nombre: marcador.nombre,	
   	  id: marker.getTitle()
   	};

   	console.log( nuevoMarcador );
   	//disparar un evento de socket para mover el marcador
   } )

  }

}
