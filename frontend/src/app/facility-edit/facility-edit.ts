import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { forkJoin } from 'rxjs';
import { FacilityService, CreateFacilityInput, Facility } from '../services/facility.service';
import { ChainService, Chain } from '../services/chain.service';
import { ErgBrandService, ErgBrand } from '../services/erg-brand.service';
import { FacilityFormComponent } from '../shared/components/facility-form/facility-form.component';

@Component({
  selector: 'app-facility-edit',
  standalone: true,
  imports: [CommonModule, RouterModule, FacilityFormComponent],
  template: `
    <app-facility-form
      [form]="form"
      [chains]="chains"
      [ergBrands]="ergBrands"
      [loading]="loading"
      [submitting]="submitting"
      [submissionError]="submissionError()"
      [title]="title()"
      description="Update facility information and keep the directory accurate."
      [headingLevel]="2"
      submitLabel="Save Changes"
      (submitted)="submit()">
    </app-facility-form>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FacilityEditComponent implements OnInit {
  private formBuilder = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private facilityService = inject(FacilityService);
  private chainService = inject(ChainService);
  private ergBrandService = inject(ErgBrandService);

  chains: Chain[] = [];
  ergBrands: ErgBrand[] = [];
  loading = true;
  submitting = false;
  private facilityId = 0;
  private facilityName = signal<string | null>(null);
  submissionError = signal<string | null>(null);

  form: FormGroup = this.formBuilder.group({
    name: ['', Validators.required],
    city: ['', Validators.required],
    postalCode: ['', Validators.required],
    streetAddress: ['', Validators.required],
    numberOfErgs: [0, [Validators.required, Validators.min(0)]],
    chainId: [null],
    ergBrandId: [null],
    extraInformation: [''],
    externalUrl: [''],
    spamGuard: ['']
  });

  title = signal('Edit Facility');

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    const numericId = idParam ? Number(idParam) : NaN;
    if (Number.isNaN(numericId)) {
      this.router.navigate(['/']);
      return;
    }
    this.facilityId = numericId;
    this.loadData();
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const raw = this.form.getRawValue();
    const spamValue = raw.spamGuard?.toString().trim();
    if (spamValue) {
      this.submissionError.set('Unable to submit form');
      return;
    }
    const payload: CreateFacilityInput = {
      name: raw.name?.toString().trim() ?? '',
      city: raw.city?.toString().trim() ?? '',
      postalCode: raw.postalCode?.toString().trim() ?? '',
      streetAddress: raw.streetAddress?.toString().trim() ?? '',
      numberOfErgs: Number(raw.numberOfErgs ?? 0),
      chainId: raw.chainId ?? null,
      ergBrandId: raw.ergBrandId ?? null,
      extraInformation: raw.extraInformation && raw.extraInformation.toString().trim().length > 0
        ? raw.extraInformation.toString().trim()
        : null,
      externalUrl: raw.externalUrl && raw.externalUrl.toString().trim().length > 0
        ? raw.externalUrl.toString().trim()
        : null
    };

    this.submitting = true;
    this.submissionError.set(null);
    this.facilityService.update(this.facilityId, payload).subscribe({
      next: () => {
        this.submitting = false;
        this.router.navigate(['/']);
      },
      error: (error) => {
        console.error('Failed to update facility', error);
        this.submissionError.set('Failed to update facility');
        this.submitting = false;
      }
    });
  }

  private loadData(): void {
    this.loading = true;
    forkJoin({
      facility: this.facilityService.getById(this.facilityId),
      chains: this.chainService.getAll(),
      ergBrands: this.ergBrandService.getAll()
    }).subscribe({
      next: ({ facility, chains, ergBrands }) => {
        this.chains = chains;
        this.ergBrands = ergBrands;
        this.populateForm(facility);
        this.loading = false;
      },
      error: (error) => {
        console.error('Failed to load facility', error);
        this.submissionError.set('Failed to load facility');
        this.loading = false;
      }
    });
  }

  private populateForm(facility: Facility): void {
    this.facilityName.set(facility.name ?? null);
    this.title.set(`Edit ${facility.name ?? 'Facility'}`);

    this.form.patchValue({
      name: facility.name ?? '',
      city: facility.city ?? '',
      postalCode: facility.postalCode ?? '',
      streetAddress: facility.streetAddress ?? '',
      numberOfErgs: facility.numberOfErgs ?? 0,
      chainId: facility.chainId ?? null,
      ergBrandId: facility.ergBrandId ?? null,
      extraInformation: facility.extraInformation ?? '',
      externalUrl: facility.externalUrl ?? '',
      spamGuard: ''
    });
  }
}

