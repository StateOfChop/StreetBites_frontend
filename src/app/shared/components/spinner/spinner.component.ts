import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingService } from '../../../core/services/loading.service';

@Component({
  selector: 'app-spinner',
  templateUrl: './spinner.component.html',
  standalone: true,
  imports: [CommonModule]
})
export class SpinnerComponent {
  private loadingService = inject(LoadingService);

  // Observable del estado de carga
  isLoading$ = this.loadingService.loading$;
}
