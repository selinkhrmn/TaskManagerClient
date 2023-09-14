import { Component, AfterViewInit } from '@angular/core';
import { Chat } from 'src/app/interfaces/chat';
import { UserConnection } from 'src/app/interfaces/user';
import { ChatService } from 'src/app/services/chat.service';
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
    Message: '',
    Id: ''
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
    private tokenService: TokenService,
    private chatService : ChatService
  ) {}


   ngOnInit() {
    this.chatService.startConnection();
   
    }

    sendMessage() {
      let id = this.tokenService.tokenUserId();
      this.messageWithUser = {
        Message: this.inputMessage,
        Id: id
      }
      this.chatService.sendMessage(this.messageWithUser);

      this.chatService.addMessageReceivedHandler((user) => {
        
        if(this.userList.includes(user)){
          return
        }
        else{
          debugger
          this.chatService.SaveChat(user).subscribe((res) => {
           this.userList.push(...res.data);
          });
        }
      });

      this.inputMessage = '';
    }

}
 