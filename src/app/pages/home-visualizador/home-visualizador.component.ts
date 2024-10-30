import { Component, ViewEncapsulation } from '@angular/core';
import { FilterTable, ProductionDataTable } from 'src/domain/productionDataTable';
import { ProductorsService } from 'src/service/productorsService';

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
  filters: FilterTable[] = [];
  
  centers: string[] = [];
  centerFiltered: string = "";

  batchs: string[] = [];
  batchFiltered: string = "";

  productors: string[] = [];
  productorFiltered: string = "";
  
  constructor(private productorsService: ProductorsService) {}

  ngOnInit() {
    this.productorsService.getProductors().then((res) => {
      this.data = res;
    });

    this.productorsService.getFilters().then((res) => {
      this.filters = res;
      this.centers = [...new Set(res.map(item => item.center))];
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
    this.productorSelected = "";
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
    this.data = this.data.filter(item => 
      item.center === this.centerSelected && 
      item.producerCode === this.productorSelected && 
      item.batchProcess === this.batchSelected
    )
  }
}
