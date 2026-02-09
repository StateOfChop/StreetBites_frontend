import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LoadingService {
  private _loading = new BehaviorSubject<boolean>(false);
  private requestCount = 0;

  loading$ = this._loading.asObservable();

  /**
   * Incrementa contador de peticiones y muestra spinner
   */
  show(): void {
    this.requestCount++;
    if (this.requestCount === 1) {
      this._loading.next(true);
    }
  }

  /**
   * Decrementa contador y oculta spinner cuando no hay más peticiones
   */
  hide(): void {
    this.requestCount--;
    if (this.requestCount <= 0) {
      this.requestCount = 0;
      this._loading.next(false);
    }
  }

  /**
   * Fuerza ocultar el spinner (para casos de error)
   */
  forceHide(): void {
    this.requestCount = 0;
    this._loading.next(false);
  }
}
