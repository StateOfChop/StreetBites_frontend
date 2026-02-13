import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './components/navbar/navbar.component';
import { SpinnerComponent } from './components/spinner/spinner.component';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';
import { CurrencyFormatPipe } from './pipes/currency-format.pipe';

@NgModule({
  imports: [CommonModule, NavbarComponent, SpinnerComponent, ConfirmDialogComponent, CurrencyFormatPipe],
  exports: [NavbarComponent, SpinnerComponent, ConfirmDialogComponent, CurrencyFormatPipe]
})
export class SharedModule {}
