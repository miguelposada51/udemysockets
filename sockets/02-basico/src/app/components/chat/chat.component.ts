import { Component, OnInit, OnDestroy } from '@angular/core';
import { ChatService } from '../../services/chat.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, OnDestroy {

	texto = '';
  mensajesSubscription: Subscription ;


  constructor(public chatService: ChatService) { }

  ngOnInit() {
    
    this.mensajesSubscription = this.chatService.getMessages().subscribe( msg => {
      console.log( msg );
    });

  
  }

  ngOnDestroy() {
    
   this.mensajesSubscription.unsubscribe();
  
  }
   
   enviar(){
    console.log( this.texto );

    this.chatService.sendMessage( this.texto );
    this.texto = '';
}
