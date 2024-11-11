import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ProductionDataTable } from 'src/interfaces/production/productionDataTable';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { ResponseApi } from 'src/interfaces/api/responseApi';
import { AesService } from './aes.service';
import { InterceptorSkipHeader } from 'src/app/pages/shared/loading/loading.interceptor';
    
@Injectable({ providedIn: 'root' })
export class ProductorsService {

   constructor(private http: HttpClient, private encryptService: AesService){}

   getProductorsData(isFromWorker: boolean = false): Observable<ResponseApi> {
      let headers = new HttpHeaders()
        .set('Authorization', `Bearer ${JSON.parse(this.encryptService.decrypt(localStorage.getItem('userData') ?? '')).token}`);
    
      if (isFromWorker) {
        headers = headers.set(InterceptorSkipHeader, '');
      }
      
      return this.http.get<ResponseApi>(environment.apiUrl + '/Productor', { headers });
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