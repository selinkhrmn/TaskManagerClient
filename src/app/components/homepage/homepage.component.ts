import { Component, OnInit } from '@angular/core';
import { Project } from 'src/app/interfaces';
import { ProjectService } from 'src/app/services';
import { TranslocoService} from '@ngneat/transloco';
import { CommentHubService } from 'src/app/services/comment-hub.service';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent implements OnInit {
  projects : Project[];
  constructor(
    private projectService : ProjectService,
    public translocoService : TranslocoService,
    private commentHubService: CommentHubService,

  ){

  }

   ngOnInit(): void {
    this.commentHubService.startConnection();
  }
}
