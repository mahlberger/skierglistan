import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Chain {
  id: number;
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class ChainService {
  private http = inject(HttpClient);
  private apiUrl = '/api/chains';

  getAll(): Observable<Chain[]> {
    return this.http.get<Chain[]>(this.apiUrl);
  }
}


