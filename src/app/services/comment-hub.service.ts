import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';

@Injectable({
  providedIn: 'root'
})
export class CommentHubService {
  private hubConnection: signalR.HubConnection;

  constructor() {
    
   }
  
   public startConnection = () => {

      this.hubConnection = new signalR.HubConnectionBuilder()
        .withUrl('ws://localhost:5011/comment-hub', {
          skipNegotiation: true,
          transport: signalR.HttpTransportType.WebSockets,
        })
        .withAutomaticReconnect([0, 2000, 10000, 30000, null])
        .build();

        this.hubConnection.onreconnected(connectionId => {
          console.log('SignalR reconnected');
          console.log('Connection ID:', connectionId);
          console.log('Connection State:', this.hubConnection.state);
        });

    try {
      this.hubConnection
        .start()
        .then(() => {
          setTimeout(() => {
            console.log('SignalR connection started');
            console.log('Connection ID:', this.hubConnection.connectionId);
            console.log('Connection State:', this.hubConnection.state);
          }, 1000); // Add a delay of 1 second (adjust as needed)
        })
        .catch(startError => {
          console.error('Error while starting SignalR connection: ' + startError);
          // Handle the start error here, if needed
        });
    } catch (startError) {
      console.error('Error while starting SignalR connection (outside start): ' + startError);
      // Handle the start error here, if needed
    }

  }
  
  // Rest of your code...
  
  public sendMessage = (message: string) => {
    this.hubConnection.invoke('SendMessage', message)
  }

  addMessageReceivedHandler(callback: (message: string) => void) {
    this.hubConnection.on('ReceiveMessage', callback);
  }

  userJoined() {

    this.hubConnection.on('userJoined', connectionId => {
    })
    
  }
}
