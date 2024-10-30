export interface FilterTable {
  center: string
  batchProcess: string
  producerCode: string
}

export interface ProductionDataTable {
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
  reception?: Reception;
  unitec?: Unitec;
  notification?: Notification;
  productions?: ProductionDataTable[]
}

interface Reception {
  exp?: number;
  l?: number;
  xl?: number;
  j?: number;
  xj?: number;
  xxj?: number;
  xxxj?: number;
  xxxjx?: number;
};

interface Unitec {
  exp?: number;
  l?: number;
  xl?: number;
  j?: number;
  xj?: number;
  xxj?: number;
  xxxj?: number;
  xxxjx?: number;
};

interface Notification {
  exp?: number;
  l?: number;
  xl?: number;
  j?: number;
  xj?: number;
  xxj?: number;
  xxxj?: number;
  xxxjx?: number;
};