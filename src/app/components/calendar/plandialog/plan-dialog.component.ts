import { Component, EventEmitter, Output } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-plan-dialog',
  templateUrl: './plan-dialog.component.html',
  styleUrls: ['./plan-dialog.component.scss']
})
export class PlanDialogComponent {
    @Output() closeEvent = new EventEmitter<void>();

    constructor(private dialogRef: MatDialogRef<PlanDialogComponent>) {}
    // Burada başka bir işlevsellik eklemeye ihtiyacımız yok.
   
    closeDialog(): void {
        this.closeEvent.emit();  // Çarpı butonuna tıklanınca olayı yayınlayarak ana bileşende kapatma fonksiyonunu tetikleyeceğiz.
    }
}
