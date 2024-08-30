import { Component, Input } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-loader',
  standalone: true,
  imports: [MatProgressSpinnerModule],
  template: `
    <div class="loader-container">
      <mat-progress-spinner 
        color="warn" 
        mode="indeterminate"
        diameter="40">
      </mat-progress-spinner>
    </div>
  `,
  styles: [`
    .loader-container {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
    }
  `]
})
export class LoaderComponent {
  @Input() isLoading: boolean = true;
}
