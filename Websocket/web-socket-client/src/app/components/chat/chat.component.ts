import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { io, Socket } from 'socket.io-client';
import { DataStorageService } from '../../services/data-storage.service';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css',
})
export class ChatComponent {
  connected: boolean = false;
  messaggio: string = '';
  wsClient: any;
  messages: any[] = [];

  constructor(private dataStorageService: DataStorageService) {}

  onConnetti() {
    const serverUrl = 'http://localhost:3000/';
    const options = { transports: ['websocket'], upgrade: false };
    this.wsClient = io(serverUrl, options);

    this.wsClient.on('connect', () => {
      this.connected = true;
      const user: any = {};
      user._id = this.dataStorageService.selectedUser._id;
      user.username = this.dataStorageService.selectedUser.username;
      user.img = this.dataStorageService.selectedUser.img;
      user.room = this.dataStorageService.selectedRoom;
      this.wsClient.emit('join-room', JSON.stringify(user));
    });

    this.wsClient.on('join-result', (data: string) => {
      if (data === 'ok') {
        document.title = this.dataStorageService.selectedUser.username;
      }
    });

    this.wsClient.on('broadcast-message', (data: string) => {
      this.messages.push(JSON.parse(data));
      console.log(data, this.messages);
      
    });
  }
  
  onDisconnetti() {}
  invia() {
    this.wsClient.emit('message', this.messaggio);
    this.messaggio = '';
  }
}
