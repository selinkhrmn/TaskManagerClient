import { Injectable } from '@angular/core';
import { Chat } from '../interfaces/chat';
import { ResponseModel } from '../interfaces/responseModel';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import * as signalR from '@microsoft/signalr';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  baseUrl = `${environment.baseUrl}/business/Chat`;
  private hubConnection: signalR.HubConnection;

  constructor(private http: HttpClient) { }

  public startConnection = () => {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl('ws://localhost:5011/chathub', {
        skipNegotiation: true,
        transport: signalR.HttpTransportType.WebSockets,
      })
      .withAutomaticReconnect([0, 2000, 10000, 30000, null])
      .build();

    try {
      this.hubConnection
        .start()
        .then(() => {
          setTimeout(() => {
            console.log('SignalR connection started');
            console.log('Connection ID:', this.hubConnection.connectionId);
            console.log('Connection State:', this.hubConnection.state);
          }, 1000);
        })
        .catch((startError) => {
          console.error(
            'Error while starting SignalR connection: ' + startError
          );
        });
    } catch (startError) {
      console.error(
        'Error while starting SignalR connection (outside start): ' + startError
      );
    }
  };

  SaveChat(chat: Chat) {
    return this.http.post<ResponseModel<Chat>>(`${this.baseUrl}/SaveChat`, chat);
  }

  public sendMessage = (userMessage: Chat) => {
    this.hubConnection.invoke('SendMessage', userMessage );
  };

  addMessageReceivedHandler(callback: (userMessage: Chat) => void) {
    this.hubConnection.on('ReceiveMessage', callback);
  }
}
