import { Component } from '@angular/core';

@Component({
  selector: 'app-share',
  templateUrl: './share.component.html',
  styleUrls: ['./share.component.scss']
})
export class ShareComponent {
  name: string = '';
  message: string = '';

  paylas() {
    // Burada paylaşım işlemlerinizi gerçekleştirebilirsiniz.
    console.log("Ad:", this.name);
    console.log("Mesaj:", this.message);
  }
}
