import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ProductionDataTable } from 'src/interfaces/production/productionDataTable';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { ResponseApi } from 'src/interfaces/api/responseApi';
    
@Injectable({ providedIn: 'root' })
export class ProductorsService {

   constructor(private http: HttpClient){}

    getProductorsData(): Observable<ResponseApi> {
      let auth = new HttpHeaders().set('Authorization', `Bearer ${localStorage.getItem('token')}`);
      return this.http.get<ResponseApi>(environment.apiUrl+'/Productor', {headers: auth});
    }

    getFilters(data: ProductionDataTable[]): any {
      if (!data || data.length <= 0)
         return Promise.resolve([]);

      return Promise.all(data.map(
         item => {
            return {
               center: item.center ?? null,
               batchProcess: item.batchProcess ?? null,
               producerCode: item.producerCode ?? null,
            };
         }
      ).filter(item => item.center || item.batchProcess || item.producerCode));
    }
};