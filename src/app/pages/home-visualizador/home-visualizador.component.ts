import { Component, ViewEncapsulation } from '@angular/core';
import { FilterTable, ProductionDataTable } from 'src/domain/productionDataTable';
import { UserLoginResponse } from 'src/interfaces/user/userLoginResponse';
import { AuthService } from 'src/service/auth.service';
import { ProductorsService } from 'src/service/productors.service';
import { SpinnerService } from 'src/service/spinner.service';

interface TableData {
  size: string;
  santina: number;
  lapins: number;
}

@Component({
  selector: 'app-home-visualizador',
  templateUrl: './home-visualizador.component.html',
  styleUrl: './home-visualizador.component.css',
  encapsulation: ViewEncapsulation.None,
})
export class HomeVisualizadorComponent {
  percentageData: TableData[] = [
    { size: '% Exp', santina: 40, lapins: 20 },
    { size: 'L', santina: 19, lapins: 40 },
    { size: 'XL', santina: 50, lapins: 60 },
    { size: 'J', santina: 40, lapins: 10 },
    { size: 'XJ', santina: 50, lapins: 70 },
    { size: 'XXJ', santina: 70, lapins: 10 },
    { size: 'XXXJ', santina: 50, lapins: 60 },
    { size: 'XXXXJ', santina: 10, lapins: 80 }
  ];

  boxData: TableData[] = [
    { size: 'L', santina: -100, lapins: -1000 },
    { size: 'XL', santina: -90, lapins: -1330 },
    { size: 'J', santina: -357, lapins: -4000 },
    { size: 'XJ', santina: -700, lapins: -1000 },
    { size: 'XXJ', santina: -5543, lapins: -5786 },
    { size: 'XXXJ', santina: -1564, lapins: -1350 },
    { size: 'XXXXJ', santina: -350, lapins: -1540 }
  ];

  selectedRow: ProductionDataTable | null = null;
  first = 0;
  rows = 30;

  data: ProductionDataTable[] = [];
  dataPersisted: ProductionDataTable[] = [];
  filters: FilterTable[] = [];
  
  centers: string[] = [];
  centerFiltered: string = "";

  batchs: string[] = [];
  batchFiltered: string = "";

  productors: string[] = [];
  productorFiltered: string = "";
  
  user: UserLoginResponse;
  canSeeHome: boolean = false;

  constructor(
    private productorsService: ProductorsService,
    private authService: AuthService,
    private spinnerService: SpinnerService
  ) {
    this.user = {
      permissions: JSON.parse(localStorage.getItem('permissions')!) || [],
      rol: localStorage.getItem('role')!,
      token: localStorage.getItem('token')!,
      nombre: localStorage.getItem('nombre')!
    }
  }

  ngOnInit() {
    this.canSeeHome = this.user.permissions.some(permission => permission.name === 'Lectura-Home');

    this.productorsService.getProductors().then((res) => {
      this.data = this.dataPersisted = res;
    });

    this.getFilters();
  }

  get centerSelected() {
    return this.centerFiltered;
  }

  set centerSelected(value) {
    this.centerFiltered = value;
    this.filters = this.filters.filter(item => item.center === this.centerSelected);
  }

  get batchSelected() {
    return this.batchFiltered;
  }

  set batchSelected(value) {
    this.batchFiltered = value;
    this.filters = this.filters.filter(item => item.batchProcess === this.batchSelected);
  }

  get productorSelected() {
    return this.productorFiltered;
  }

  set productorSelected(value) {
    this.productorFiltered = value;
    this.filters = this.filters.filter(item => item.producerCode === this.productorSelected);
  }

  filterData() {
    this.spinnerService.showSpinner();    
    this.data = this.data.filter(item => 
      (this.centerSelected === '' || item.center === this.centerSelected) &&
      (this.productorSelected === '' || item.producerCode === this.productorSelected) &&
      (this.batchSelected === '' || item.batchProcess === this.batchSelected)
    );
    setTimeout(() => {
      this.spinnerService.hideSpinner();
    }, 1500);        
  }

  resetFilter(){
    this.spinnerService.showSpinner();
    this.data = this.dataPersisted;
    this.centerFiltered = this.batchFiltered = this.productorFiltered = '';
    this.getFilters();
    setTimeout(() => {
      this.spinnerService.hideSpinner();
    }, 1500);    
  }

  logOut() {
    this.spinnerService.showSpinner();
    this.authService.logout();
    setTimeout(() => {
      this.spinnerService.hideSpinner();
    }, 1500);
  }

  private getFilters(){
    this.productorsService.getFilters().then((res: FilterTable[]) => {
      this.filters = res;
      this.centers = [...new Set(res.map(item => item.center))];
    });    
  }
}
