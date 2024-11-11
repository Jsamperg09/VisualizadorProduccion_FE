import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { finalize, Observable } from 'rxjs';
import { SpinnerService } from 'src/service/spinner.service';

export const InterceptorSkipHeader = 'X-Skip-Interceptor';

@Injectable({
  providedIn: 'root'
})
export class LoadingInterceptorService implements HttpInterceptor {
  
  constructor(private spinnerService: SpinnerService){}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const skipInterceptor = req.headers.has(InterceptorSkipHeader);
    
    let modifiedReq = req;

    if (skipInterceptor) {
      const headers = req.headers.delete(InterceptorSkipHeader);
      modifiedReq = req.clone({ headers });
    } else {
      this.spinnerService.showSpinner();
    }

    return next.handle(modifiedReq).pipe(
      finalize(() => {
        if (!skipInterceptor) {
          this.spinnerService.hideSpinner();
        }
      })
    );
  }
};
 