import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { UserConnection } from '../interfaces/user';
import { BehaviorSubject } from 'rxjs';
import { Chat } from '../interfaces/chat';

@Injectable({
  providedIn: 'root',
})
export class CommentHubService {
  private hubConnection: signalR.HubConnection;
  private userStatusSubject = new BehaviorSubject<string[]>([]);

  constructor() {}

  public startConnection = () => {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl('ws://localhost:5011/comment-hub', {
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
  public getUserStatusUpdates() {
    this.hubConnection.on('UserConnected', (userId: string) => {
      // Handle user connection and update UI
      // Add the userId to the connected users list
      this.userStatusSubject.next([...this.userStatusSubject.value, userId]);
    });

    this.hubConnection.on('UserDisconnected', (userId: string) => {
      // Handle user disconnection and update UI
      // Remove the userId from the connected users list
      this.userStatusSubject.next(
        this.userStatusSubject.value.filter((id) => id !== userId)
      );
    });
  }

  public getUserStatusList() {
    return this.userStatusSubject.asObservable();
  }

  // Rest of your code...

 

  userLeaved(callback: (ConnectionId: string) => void) {
    this.hubConnection.on('userLeaved', callback)
  }

   userJoined(callback: (ConnectionId: string) => void) {
    this.hubConnection.on('userJoined', callback)
  }

  AllUsers(id: string) {
    this.hubConnection.invoke('AllUsers', id);
  }

  AllUsersLeaved(connectionId: string) {
    this.hubConnection.invoke('AllUsersLeaved', connectionId);

  }

  GetAllUsers(callback: (users: UserConnection) => void) {
    this.hubConnection.on('allUsers', callback);
  }

  GetAllUsersLeaved(callback: (users: UserConnection) => void ) {
    this.hubConnection.on('allUsersLeaved', callback);
  }

  GetClientsJoined(callback: (clients : UserConnection) => void) {
    this.hubConnection.on("clients", callback)
  }

}
