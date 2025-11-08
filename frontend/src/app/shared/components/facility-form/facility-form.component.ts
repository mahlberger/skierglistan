import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { Chain } from '../../../services/chain.service';
import { ErgBrand } from '../../../services/erg-brand.service';
import { PageHeaderComponent } from '../page-header.component';
import { FormFieldDirective } from '../../directives/form-field.directive';
import { FormFieldColumnDirective } from '../../directives/form-field-column.directive';

@Component({
  selector: 'app-facility-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    PageHeaderComponent,
    FormFieldDirective,
    FormFieldColumnDirective
  ],
  template: `
    <app-page-header
      [title]="title"
      [description]="description"
      [headingLevel]="headingLevel">
      <ng-content select="[pageHeaderActions]" pageHeaderActions></ng-content>
    </app-page-header>

    <hr class="my-4" />

    <form [formGroup]="form" (ngSubmit)="onSubmit()" class="flex flex-column gap-4">
      <div class="facility-form__guard" aria-hidden="true">
        <label for="facilitySpamGuard" class="facility-form__guard-label">Leave this field blank</label>
        <input id="facilitySpamGuard" type="text" formControlName="spamGuard" class="facility-form__guard-input" autocomplete="off" />
      </div>
      <fieldset [disabled]="loading || submitting" class="border-none p-0 m-0">
        <div class="p-fluid formgrid grid">
          <div appFormFieldColumn="6">
            <label for="name" class="font-medium mb-2 block">Name</label>
            <input id="name" type="text" formControlName="name" appFormField required />
          </div>
          <div appFormFieldColumn="6">
            <label for="city" class="font-medium mb-2 block">City</label>
            <input id="city" type="text" formControlName="city" appFormField required />
          </div>
          <div appFormFieldColumn="6">
            <label for="postalCode" class="font-medium mb-2 block">Postal Code</label>
            <input id="postalCode" type="text" formControlName="postalCode" appFormField required />
          </div>
          <div appFormFieldColumn="6">
            <label for="streetAddress" class="font-medium mb-2 block">Street Address</label>
            <input id="streetAddress" type="text" formControlName="streetAddress" appFormField required />
          </div>
          <div appFormFieldColumn="6">
            <label for="numberOfErgs" class="font-medium mb-2 block">Number of Ergs</label>
            <input id="numberOfErgs" type="number" min="0" formControlName="numberOfErgs" appFormField required />
          </div>
          <div appFormFieldColumn="6">
            <label for="chainId" class="font-medium mb-2 block">Chain</label>
            <select id="chainId" formControlName="chainId" appFormField>
              <option [ngValue]="null">None</option>
              <option *ngFor="let chain of chains" [ngValue]="chain.id">{{ chain.name }}</option>
            </select>
          </div>
          <div appFormFieldColumn="6">
            <label for="ergBrandId" class="font-medium mb-2 block">Erg Brand</label>
            <select id="ergBrandId" formControlName="ergBrandId" appFormField>
              <option [ngValue]="null">None</option>
              <option *ngFor="let brand of ergBrands" [ngValue]="brand.id">{{ brand.name }}</option>
            </select>
          </div>
          <div appFormFieldColumn="6">
            <label for="externalUrl" class="font-medium mb-2 block">External URL</label>
            <input id="externalUrl" type="url" formControlName="externalUrl" appFormField placeholder="https://example.com" />
          </div>
          <div appFormFieldColumn>
            <label for="extraInformation" class="font-medium mb-2 block">Extra Information</label>
            <textarea id="extraInformation" formControlName="extraInformation" rows="4" appFormField></textarea>
          </div>
        </div>

        <div class="flex justify-content-end gap-2 mt-3">
          <button pButton type="submit" [label]="submitLabel" [disabled]="form.invalid || submitting"></button>
        </div>

        <p *ngIf="submissionError" class="text-red-500 mt-2">{{ submissionError }}</p>
      </fieldset>
    </form>
  `,
  styles: [`
    .facility-form__guard,
    .facility-form__guard-label,
    .facility-form__guard-input {
      position: absolute;
      left: -10000px;
      top: auto;
      width: 1px;
      height: 1px;
      overflow: hidden;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FacilityFormComponent {
  @Input({ required: true }) form!: FormGroup;
  @Input() chains: Chain[] = [];
  @Input() ergBrands: ErgBrand[] = [];
  @Input() loading = false;
  @Input() submitting = false;
  @Input() submissionError: string | null = null;
  @Input() title = '';
  @Input() description = '';
  @Input() submitLabel = 'Save Facility';
  @Input() headingLevel: 1 | 2 | 3 | 4 | 5 | 6 = 2;
  @Output() submitted = new EventEmitter<void>();

  onSubmit(): void {
    this.submitted.emit();
  }
}
 

