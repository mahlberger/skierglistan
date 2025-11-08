import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { NgIf, NgSwitch, NgSwitchCase, NgSwitchDefault } from '@angular/common';

@Component({
  selector: 'app-page-header',
  standalone: true,
  imports: [NgIf, NgSwitch, NgSwitchCase, NgSwitchDefault],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header class="page-header">
      <div class="page-header__text">
        <ng-container [ngSwitch]="headingLevel">
          <h1 *ngSwitchCase="1" class="page-header__title">{{ title }}</h1>
          <h2 *ngSwitchCase="2" class="page-header__title">{{ title }}</h2>
          <h3 *ngSwitchCase="3" class="page-header__title">{{ title }}</h3>
          <h4 *ngSwitchCase="4" class="page-header__title">{{ title }}</h4>
          <h5 *ngSwitchCase="5" class="page-header__title">{{ title }}</h5>
          <h6 *ngSwitchDefault class="page-header__title">{{ title }}</h6>
        </ng-container>
        <p *ngIf="description" class="page-header__description">{{ description }}</p>
      </div>
      <div class="page-header__actions">
        <ng-content select="[pageHeaderActions]"></ng-content>
      </div>
    </header>
  `,
  styles: [`
    .page-header {
      display: flex;
      flex-direction: column;
      gap: 0.875rem;
    }

    .page-header__text {
      display: flex;
      flex-direction: column;
      gap: 0.375rem;
    }

    .page-header__title {
      margin: 0;
      font-weight: 600;
      color: var(--app-text);
    }

    .page-header__description {
      margin: 0;
      color: var(--app-muted);
      font-size: 0.95rem;
    }

    .page-header__actions {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    @media (min-width: 768px) {
      .page-header {
        flex-direction: row;
        align-items: flex-end;
        justify-content: space-between;
      }

      .page-header__actions {
        justify-content: flex-end;
      }
    }
  `]
})
export class PageHeaderComponent {
  @Input({ required: true }) title = '';
  @Input() description = '';
  @Input() headingLevel: 1 | 2 | 3 | 4 | 5 | 6 = 2;
}

