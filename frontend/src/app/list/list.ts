import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { FacilityService, Facility } from '../services/facility.service';
import { PageHeaderComponent } from '../shared/components/page-header.component';

@Component({
  selector: 'app-list',
  imports: [CommonModule, FormsModule, RouterModule, ButtonModule, TableModule, InputTextModule, PageHeaderComponent],
  templateUrl: './list.html',
  styleUrls: ['./list.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListComponent implements OnInit {
  private facilityService = inject(FacilityService);
  private facilities = signal<Facility[]>([]);
  loading = true;
  searchTerm = signal('');
  searchTermValue = '';
  totalCount = computed(() => this.facilities().length);
  filteredCount = computed(() => this.filtered().length);
  hasResults = computed(() => this.filteredCount() > 0);
  filtered = computed(() => {
    const rawKeywords = this.searchTerm().split(',').map((keyword) => keyword.trim().toLowerCase()).filter((keyword) => keyword.length > 0);
    if (rawKeywords.length === 0) {
      return this.facilities();
    }
    return this.facilities().filter((facility) => {
      const rowValues = [
        facility.id?.toString() ?? '',
        facility.name ?? '',
        facility.city ?? '',
        facility.postalCode ?? '',
        facility.streetAddress ?? '',
        facility.numberOfErgs?.toString() ?? '',
        facility.chainName ?? '',
        facility.ergBrandName ?? '',
        facility.extraInformation ?? '',
        facility.externalUrl ?? ''
      ].join(' ').toLowerCase();
      return rawKeywords.every((keyword) => rowValues.includes(keyword));
    });
  });

  updateSearch(value: string): void {
    this.searchTermValue = value;
    this.searchTerm.set(value);
  }

  ngOnInit(): void {
    this.facilityService.getAll().subscribe({
      next: (facilities) => {
        this.facilities.set(facilities);
        this.loading = false;
      },
      error: (error) => {
        console.error('Error fetching facilities:', error);
        this.loading = false;
      }
    });
  }
}

