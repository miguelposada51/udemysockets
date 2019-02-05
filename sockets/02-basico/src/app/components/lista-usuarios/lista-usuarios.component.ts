import { Component, OnInit } from '@angular/core';
import { ChatService } from '../../services/chat.service';
import { Observable } from 'rxjs';
import { WebsocketService } from '../../services/websocket.service';

@Component({
  selector: 'app-lista-usuarios',
  templateUrl: './lista-usuarios.component.html',
  styleUrls: ['./lista-usuarios.component.css']
})
export class ListaUsuariosComponent implements OnInit {

  UsuariosActivosObs: Observable<any>

  constructor(
   public chatService: ChatService,
  	
   ) { }

  ngOnInit() {
  	this.UsuariosActivosObs = this.chatService.getUsuariosActivos();

    // Emitir el ObtenerUsuarios
   
     this.chatService.emitirUsuariosActivos();

  }

}
