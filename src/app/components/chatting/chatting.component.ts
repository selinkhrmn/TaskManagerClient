import { Component } from '@angular/core';
import { CommentHubService } from 'src/app/services/comment-hub.service';

@Component({
  selector: 'app-chatting',
  templateUrl: './chatting.component.html',
  styleUrls: ['./chatting.component.scss'],
})
export class ChattingComponent {
  inputMessage: string;
  messages: string[] = [];
  connectionId : any;
  constructor(private commentHubService: CommentHubService) {}

   ngOnInit() {
    this.commentHubService.startConnection();
    this.commentHubService.addMessageReceivedHandler((message) => {
      this.messages.push(`${message}`);
    });
    this.commentHubService.userJoined();
    }

    sendMessage() {
      this.commentHubService.sendMessage(this.inputMessage);
      this.inputMessage = '';
    }

}