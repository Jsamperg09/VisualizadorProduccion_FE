export interface FilterTable {
  center: string
  batchProcess: string
  producerCode: string
}

export interface ProductionDataTable {
  id? : number;
  idProductionHistory? : number;  
  center?: string;
  line?: string;
  variety?: string;
  varietyEt?: string;
  um?: string;
  material?: string;
  producerCode?: string;
  labeledProducer?: string;
  name?: string;
  quality?: string;    
  species?: string;
  typification?: string;
  batchProcess?: string;
  batch?: string;
  reception?: Quality;
  unitec?: Quality;
  notification?: Quality;
}

interface Quality {
  exp?: number;
  l?: number;
  xl?: number;
  j?: number;
  xj?: number;
  xxj?: number;
  xxxj?: number;
  xxxxj?: number;
};