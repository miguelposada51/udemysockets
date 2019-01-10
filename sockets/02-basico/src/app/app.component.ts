import { Component, OnInit } from '@angular/core';
import { WebsocketService } from './services/websocket.service';
import { Injectable } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

@Injectable({
  providedIn: 'root'	
})

export class AppComponent {
  title = 'basico';

  constructor( public wsServices: WebsocketService  ){

  }

 ngOnInit() {

 }

}

