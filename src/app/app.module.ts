import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './pages/login/login.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS, MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HomeVisualizadorComponent } from './pages/home-visualizador/home-visualizador.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSelectModule } from '@angular/material/select';
import { FooterComponent } from './pages/shared/footer/footer.component';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { InputSwitchModule } from 'primeng/inputswitch';
import { ProductorsService } from 'src/service/productors.service';
import { RecoverAccessComponent } from './pages/recover-access/recover-access.component';
import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule } from '@angular/common/http';
import { NgxSpinnerModule } from 'ngx-spinner';
import { LoadingInterceptorService } from './pages/shared/loading/loading.interceptor';
import { UnauthorizedComponent } from './pages/shared/unauthorized/unauthorized.component';


@NgModule({
  schemas: [CUSTOM_ELEMENTS_SCHEMA],  
  declarations: [
    AppComponent,
    LoginComponent,
    HomeVisualizadorComponent,
    RecoverAccessComponent,
    FooterComponent,
    UnauthorizedComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatCardModule,
    MatIconModule,
    NgbModule,
    MatSidenavModule,
    TableModule, 
    InputSwitchModule, 
    FormsModule, 
    CommonModule,
    HttpClientModule,
    NgxSpinnerModule
  ],
  providers: [
    {provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: {appearance: 'outline'}},
    { provide: HTTP_INTERCEPTORS, useClass: LoadingInterceptorService, multi: true },
    ProductorsService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
