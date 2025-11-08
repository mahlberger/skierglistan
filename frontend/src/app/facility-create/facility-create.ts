import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { forkJoin } from 'rxjs';
import { FacilityService, CreateFacilityInput } from '../services/facility.service';
import { ChainService, Chain } from '../services/chain.service';
import { ErgBrandService, ErgBrand } from '../services/erg-brand.service';
import { FacilityFormComponent } from '../shared/components/facility-form/facility-form.component';

@Component({
  selector: 'app-facility-create',
  imports: [CommonModule, RouterModule, FacilityFormComponent],
  templateUrl: './facility-create.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FacilityCreateComponent implements OnInit {
  private formBuilder = inject(FormBuilder);
  private facilityService = inject(FacilityService);
  private chainService = inject(ChainService);
  private ergBrandService = inject(ErgBrandService);
  private router = inject(Router);

  chains: Chain[] = [];
  ergBrands: ErgBrand[] = [];
  loading = true;
  submitting = false;
  submissionError: string | null = null;

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

  ngOnInit(): void {
    forkJoin({
      chains: this.chainService.getAll(),
      ergBrands: this.ergBrandService.getAll()
    }).subscribe({
      next: ({ chains, ergBrands }) => {
        this.chains = chains;
        this.ergBrands = ergBrands;
        this.loading = false;
      },
      error: (error) => {
        console.error('Failed to load dropdown data', error);
        this.submissionError = 'Failed to load chain or erg brand data';
        this.loading = false;
      }
    });
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const raw = this.form.getRawValue();
    const spamValue = raw.spamGuard?.toString().trim();
    if (spamValue) {
      this.submissionError = 'Unable to submit form';
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
    this.submissionError = null;

    this.facilityService.create(payload).subscribe({
      next: () => {
        this.submitting = false;
        this.router.navigate(['/list']);
      },
      error: (error) => {
        console.error('Failed to create facility', error);
        this.submissionError = 'Failed to create facility';
        this.submitting = false;
      }
    });
  }
}


