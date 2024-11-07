import { HttpStatusCode } from '@angular/common/http';
import { Component, ViewEncapsulation } from '@angular/core';
import { FilterTable, ProductionCalculate, ProductionDataTable, Quality, VarietyWithQualities } from 'src/interfaces/production/productionDataTable';
import { UserLoginResponse } from 'src/interfaces/user/userLoginResponse';
import { AuthService } from 'src/service/auth.service';
import { ExcelExportService } from 'src/service/excel-export.service';
import { ProductorsService } from 'src/service/productors.service';
import { SpinnerService } from 'src/service/spinner.service';
import { ToastService } from 'src/service/toast.service';

interface DifferencesData {
  size: string;
  [varietyName: string]: number | string | null;
}

@Component({
  selector: 'app-home-visualizador',
  templateUrl: './home-visualizador.component.html',
  styleUrl: './home-visualizador.component.css',
  encapsulation: ViewEncapsulation.None,
})
export class HomeVisualizadorComponent {
  headers: string[] = ['Centro', 'Linea', 'Especie', 'Variedad', 'Variedad Et', 'Lote proceso', 'Lote', 'UM', 'Material', 'Cod Productor', 'Prod.Etiquetado', 'Nombre', 'Tipificación', 'Calidad', 'Kilos Procesados', 'Proyeccion de cajas Calidad', 'Tipificación', 'Calidad', '% Exp', 'L', 'XL', 'J', 'XJ', 'XXJ', 'XXXJ', 'XXXXJ', '% Exp', 'L', 'XL', 'J', 'XJ', 'XXJ', 'XXXJ', 'XXXXJ', '% Exp', 'L', 'XL', 'J', 'XJ', 'XXJ', 'XXXJ', 'XXXXJ', 'L', 'XL', 'J', 'XJ', 'XXJ', 'XXXJ', 'XXXXJ', 'L', 'XL', 'J', 'XJ', 'XXJ', 'XXXJ', 'XXXXJ']
  sizes: (keyof Quality)[] = ['exp', 'l', 'xl', 'j', 'xj', 'xxj', 'xxxj', 'xxxxj'];
  percentageData: DifferencesData[] = [];
  boxData: DifferencesData[] = [];
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
  isAdmin: boolean = false;
  varietyWithQualities: VarietyWithQualities[] = [];

  constructor(
    private productorsService: ProductorsService,
    private authService: AuthService,
    private spinnerService: SpinnerService,
    private excelExportService: ExcelExportService,
    private toastService: ToastService
  ) {
    this.user = {
      permissions: JSON.parse(localStorage.getItem('permissions')!) || [],
      rol: localStorage.getItem('role')!,
      token: localStorage.getItem('token')!,
      nombre: localStorage.getItem('nombre')!
    }
  }

  ngOnInit() {
    this.isAdmin = this.user.permissions.some(permission => permission.name === 'Lectura-Home');
    if (!this.isAdmin)
      this.canSeeHome = this.user.permissions.some(permission => permission.name === 'Lectura-Home');
    else
      this.canSeeHome = true;

    this.productorsService.getProductorsData().subscribe({
      next: (res) => {
        if (res.codigo == HttpStatusCode.Ok){          
          this.data = this.dataPersisted = Array.isArray(res.data) ? res.data.map(item => {            
            item.productionCalculate = convertKeysToCamelCase(JSON.parse(item.productionCalculate)) as ProductionCalculate[];
            item.notificationDifference = convertKeysToCamelCase(JSON.parse(item.notificationDifference)) as Quality[];
            item.difference = convertKeysToCamelCase(JSON.parse(item.difference)) as Quality[];
            item.unitec = convertKeysToCamelCase(JSON.parse(item.unitec)) as Quality[];
            item.reception = convertKeysToCamelCase(JSON.parse(item.reception)) as Quality[];
            item.notification = convertKeysToCamelCase(JSON.parse(item.notification)) as Quality[];
            return item;
          }) : [];
          this.getFilters();
        } else if (res.codigo == HttpStatusCode.Unauthorized){
          this.toastService.showToast('error', 'Token no válido', 'Su token de seguridad expiró, por favor vuelva a ingresar.');
          this.logOut();
        }else{
          this.toastService.showToast('error', 'Ocurrió un error', res.mensaje);
        }
      },
      error: (res) => {
        if (res.codigo == HttpStatusCode.Unauthorized){
          this.toastService.showToast('error', 'Token no válido', 'Su token de seguridad expiró, por favor vuelva a ingresar.');
          this.logOut();
        }else{
          this.toastService.showToast('error', 'Ocurrió un error', undefined);
        }
        
        this.data = this.dataPersisted = [];
      }
    });
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
    this.generateProyection();
    this.generateDifferenceData();    
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

  exportData(){
    if (this.data.length > 0){
      let fileName = `VisualizadorProduccion_${Date.now()}`
      this.spinnerService.showSpinner();
      this.excelExportService.exportToExcel(this.data, `${fileName}`, this.headers)
      setTimeout(() => {
        this.spinnerService.hideSpinner();
        this.toastService.showToast(undefined, 'Descarga exitosa', `Archivo excel ${fileName} descargado correctamente.`);
      }, 1000);
    }else{
      this.toastService.showToast('info', 'No hay datos para exportar', undefined);
    }
  }

  private getFilters(){
    this.productorsService.getFilters(this.data).then((res: FilterTable[]) => {
      if (res){
        this.filters = res;
        this.centers = [...new Set(res.map(item => item.center))];     
      }
    });

    this.generateProyection();
    this.generateDifferenceData();
  }

  private generateProyection() {
    const varietyMap = new Map<string, VarietyWithQualities>();
    this.data.forEach(item => {
      if (!item.variety) return;

      if (!varietyMap.has(item.variety)) {
        varietyMap.set(item.variety, {
          variety: item.variety,
          difference: [],
          notification: [],
          notificationDifference: [],
          reception: [],
          unitec: [],
          productionCalculate: [],
          color: getRandomColor()
        });
      }

      const varietyData = varietyMap.get(item.variety)!;
      if (item.reception) varietyData.reception.push(item.reception[0]);
      if (item.unitec) varietyData.unitec.push(item.unitec[0]);
      if (item.notification) varietyData.notification.push(item.notification[0]);
      if (item.difference) varietyData.difference.push(item.difference[0]);
      if (item.notificationDifference) varietyData.notificationDifference.push(item.notificationDifference[0]);
      if (item.productionCalculate) varietyData.productionCalculate.push(item.productionCalculate[0]);
    });

    this.varietyWithQualities = Array.from(varietyMap.values());
  }

  private generateDifferenceData() {
    this.percentageData = this.sizes.map(size => {
      const row: DifferencesData = { size: this.formatSize(size) };

      this.varietyWithQualities.forEach(variety => {        
        row[variety.variety] = this.getQualityValue(variety.variety, size, 'difference') ?? '0';
      });

      return row;
    });

    this.boxData = this.sizes.filter(size => size != 'exp').map(size => {
      const row: DifferencesData = { size: this.formatSize(size) };
      
      this.varietyWithQualities.forEach(variety => {
        row[variety.variety] = this.getQualityValue(variety.variety, size, 'notificationDifference') ?? '0';
      });

      return row;
    });    
  }
  
  private formatSize(size: string): string {
    return size.toUpperCase().replace('EXP', '% Exp');
  }

  private getQualityValue(
    variety: string, 
    size: keyof Quality, 
    property: 'difference' | 'unitec' | 'notification' | 'notificationDifference' | 'reception'
  ): number | null {
    const varietyData = this.varietyWithQualities.find(v => v.variety === variety);
    if (varietyData && varietyData[property]) {
      for (const quality of varietyData[property]!) {
        if (quality[size] !== undefined) {
          return quality[size]!;
        }
      }
    }
    return null;
  }
}

function getRandomColor(): string {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
} 

function toCamelCase(key: string): string {
  return key.charAt(0).toLowerCase() + key.slice(1);
}

function convertKeysToCamelCase(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map(item => convertKeysToCamelCase(item));
  } else if (obj !== null && obj.constructor === Object) {
    return Object.keys(obj).reduce((acc, key) => {
      const camelKey = toCamelCase(key);
      acc[camelKey] = convertKeysToCamelCase(obj[key]);
      return acc;
    }, {} as any);
  }
  return obj;
}