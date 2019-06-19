import { Component, OnInit } from '@angular/core';
import { WebsocketService } from '../../services/websocket.service';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

 nombre = '';
 erroLogin= false;

  constructor(
     public wsService: WebsocketService,
     private router: Router
  	) { }

  ngOnInit() {
  }
 
 ingresar(){

  this.wsService.LoginyAmigoSecreto({"UserAmigoSec": ""+ this.nombre +"" }).subscribe(data => {
    if (data){  
     
      console.log("el usuario " + data.msg + " - del grupo  "+ data.grupo+" tiene a "+data.elAmigoEs);
      if(data.msg === "Error no se encontro usuario"){
        this.router.navigateByUrl('/');
        this.erroLogin = true;
      }else{ 
        this.wsService.loginWS( data.msg,data.elAmigoEs )
        .then(() => {
        this.router.navigateByUrl('/mensajes');
    });
      }

    }
    },
    (err: HttpErrorResponse) => {
      
      console.log('Error al intentar ingresar: ' + err.name + ' ' + err.message);
  });

  
  // this.wsService.loginWS( this.nombre )
  //   .then(() => {
  //     this.router.navigateByUrl('/mensajes');
  //   });
  //this.nombre = '';	
 }

}
