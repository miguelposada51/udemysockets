import { Component, OnInit } from '@angular/core';
import { WebsocketService } from '../../services/websocket.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

 nombre = '';

  constructor(
     public wsService: WebsocketService
  	) { }

  ngOnInit() {
  }
 
 ingresar(){
  this.wsService.loginWS( this.nombre );	
 }

}
