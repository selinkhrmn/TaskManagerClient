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
    debugger;
    
    try {
      this.hubConnection = new signalR.HubConnectionBuilder()
        .withUrl('ws://localhost:5013/business/ws/commenthub', {
          skipNegotiation: true,
          transport: signalR.HttpTransportType.WebSockets,
        })
        .build();

      // Log to indicate that build was successful
      console.log('HubConnection build successful');
    } catch (buildError) {
      console.error('Error while building HubConnection:', buildError);
      // Handle the build error here, if needed
    }

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
}
