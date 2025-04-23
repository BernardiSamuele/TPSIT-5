import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataStorageService {

  constructor(private httpClient: HttpClient) { }
  private REST_API_SERVER = "http://localhost:3000/api";

  public inviaRichiesta( method:string, resource:string, params:any={} )
 :Observable<any> | undefined {
	  resource = this.REST_API_SERVER + resource
	  switch(method.toLowerCase()){
      case "get":
        return this.httpClient.get(resource, {"params":params})
      case "delete":
        return this.httpClient.delete(resource, {"body":params})
      case "post":
        return this.httpClient.post(resource, params)
      case "patch":   
        return this.httpClient.patch(resource, params)
      default: return undefined;
    }
 }
}
