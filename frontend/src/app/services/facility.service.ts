import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Facility {
  id: number;
  name: string;
  city: string;
  postalCode: string;
  streetAddress: string;
  numberOfErgs: number;
  chainName: string | null;
  chainId?: number | null;
  ergBrandName: string | null;
  ergBrandId?: number | null;
  extraInformation: string | null;
  externalUrl: string | null;
}

export interface CreateFacilityInput {
  name: string;
  city: string;
  postalCode: string;
  streetAddress: string;
  numberOfErgs: number;
  chainId: number | null;
  ergBrandId: number | null;
  extraInformation: string | null;
  externalUrl: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class FacilityService {
  private http = inject(HttpClient);
  private apiUrl = '/api/facilities';

  getAll(): Observable<Facility[]> {
    return this.http.get<Facility[]>(this.apiUrl);
  }

  getById(id: number): Observable<Facility> {
    return this.http.get<Facility>(`${this.apiUrl}/${id}`);
  }

  create(input: CreateFacilityInput): Observable<Facility> {
    return this.http.post<Facility>(this.apiUrl, input);
  }

  update(id: number, input: CreateFacilityInput): Observable<Facility> {
    return this.http.put<Facility>(`${this.apiUrl}/${id}`, input);
  }
}

