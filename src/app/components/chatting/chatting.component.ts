import { Component, AfterViewInit } from '@angular/core';
import { Chat } from 'src/app/interfaces/chat';
import { UserConnection } from 'src/app/interfaces/user';
import { CommentHubService } from 'src/app/services/comment-hub.service';
import { TokenService } from 'src/app/services/token.service';

@Component({
  selector: 'app-chatting',
  templateUrl: './chatting.component.html',
  styleUrls: ['./chatting.component.scss'],
})
export class ChattingComponent {
  inputMessage: string;
  messageWithUser: Chat = {
    message: '',
    id: ''
  }
  messages: string[] = [];
  userList: Chat[] = [];
  connectionList: UserConnection = {
    connectionId: '',
    id: ''
  };
  connectedUsers: string[] = [];
  connectionId: any;
  userName: string;

  constructor(
    private commentHubService: CommentHubService,
    private tokenService: TokenService
  ) {}


   ngOnInit() {
    this.commentHubService.startConnection();
   
    }

    sendMessage() {
      let id = this.tokenService.tokenUserId();
      this.messageWithUser = {
        message: this.inputMessage,
        id: id
      }
      this.commentHubService.sendMessage(this.messageWithUser);

      this.commentHubService.addMessageReceivedHandler((user) => {
        console.log(user);
        if(this.userList.includes(user)){
          return
        }
        else{
          this.userList.push(user);
        }
      });

      this.inputMessage = '';
    }

}
 