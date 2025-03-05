import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class VestitiService {
  private REST_API_SERVER = 'http://localhost:3000/api';
  vestiti: any[] = [];

  constructor(private httpClient: HttpClient) {}

  public getVestiti() {
    this.inviaRichiesta('GET', '/vestiti')?.subscribe({
      next: (data) => {
        console.log(data);
        this.vestiti = data as any[];
      },
    });
  }

  public addVestito() {
    
  }

  public inviaRichiesta(
    method: string,
    resource: string,
    params: any = {}
  ): Observable<Object> | undefined {
    resource = this.REST_API_SERVER + resource;
    switch (method.toLowerCase()) {
      case 'get':
        return this.httpClient.get(resource, { params: params });
      // break; in coda ad un return può essere omesso
      case 'delete':
        return this.httpClient.delete(resource, { body: params });
      case 'post':
        return this.httpClient.post(resource, params);
      case 'patch':
        return this.httpClient.patch(resource, params);
      case 'put':
        return this.httpClient.put(resource, params);
      default:
        return undefined;
    }
  }
}
