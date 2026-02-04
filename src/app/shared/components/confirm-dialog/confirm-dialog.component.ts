import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html'
})
export class ConfirmDialogComponent {
  @Input() message = '¿Estás seguro?';
}
