import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ErgBrand {
  id: number;
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class ErgBrandService {
  private http = inject(HttpClient);
  private apiUrl = '/api/erg-brands';

  getAll(): Observable<ErgBrand[]> {
    return this.http.get<ErgBrand[]>(this.apiUrl);
  }
}


