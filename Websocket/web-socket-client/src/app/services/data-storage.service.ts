import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DataStorageService {
  private REST_API_SERVER = 'http://localhost:3000/api';

  constructor(private httpClient: HttpClient) {}

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

  /* ********************************************************************************** */
  users: any[] = [];
  selectedRoom: any = null;
  selectedUser: any = null;

  getUsers() {
    this.inviaRichiesta('get', '/users', { occupato: false })?.subscribe({
      next: (data: any) => {
        this.users = data;
      },
      error: (error) => {
        console.error('Error fetching users:', error);
      },
    });
  }
  patchUser(id: any) {
    this.inviaRichiesta('patch', '/users/' + id, { occupato: true })?.subscribe(
      {
        next: (response: any) => {
          console.log(response);
        },
        error: (error) => {
          console.error('Error updating users:', error);
        },
      }
    );
  }
}
