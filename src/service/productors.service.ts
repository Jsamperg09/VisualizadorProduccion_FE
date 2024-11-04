import { Injectable } from '@angular/core';
import { FilterTable, ProductionDataTable } from 'src/domain/productionDataTable';
    
@Injectable({ providedIn: 'root' })
export class ProductorsService {
    getProductorsData() {
      return [
         {
            center: "DC05",
            line: "UNITEC",
            variety: "SANTINA",
            varietyEt: "SANTINA",
            producerCode: "S322",
            name: "AGRICOLA DAVID DEL CURTO SPA(COP 1)",
            species: "CEREZAS",
            typification: "ESTANDAR 1",
            batchProcess: "DC05007468",
            reception: {
               exp: 0.85,
               l: 0.05,
               xl: 0.05,
               j: 0.3,
               xj: 0.2,
               xxj: 0.2,
               xxxj: 0.1,
               xxxjx: 0.1
            },
            unitec: {
               exp: 0.8176,
               l: 0.028,
               xl: 0.0207,
               j: 0.156,
               xj: 0.5099,
               xxj: 0.1237,
               xxxj: 0.1599,
               xxxjx: 0.0
            },
            notification: {
               exp: -0.0324,
               l: -0.022,
               xl: -0.0293,
               j: -0.144,
               xj: 0.3099,
               xxj: -0.0763,
               xxxj: 0.0599,
               xxxjx: -0.1
            }
         },
         {
            um: "8600486864",
            material: "CE011",
            producerCode: "S322",
            labeledProducer: "S322",
            typification: "ESTANDAR 1",
            batch: "1216110",
         },
         {
            um: "8600486863",
            material: "CE011",
            producerCode: "S322",
            labeledProducer: "S322",
            typification: "ESTANDAR 1",
            batch: "1216111",
         },
         {
            um: "8600487094",
            material: "CE011",
            producerCode: "S322",
            labeledProducer: "S322",
            typification: "ESTANDAR 1",
            batch: "1216112",
         },
         {
            um: "8600487095",
            material: "CE011",
            producerCode: "S322",
            labeledProducer: "S322",
            typification: "ESTANDAR 1",
            batch: "1216113",
         },
         {
            um: "8600487096",
            material: "CE011",
            producerCode: "S322",
            labeledProducer: "S322",
            typification: "ESTANDAR 1",
            batch: "1216115",
         },
         {
            um: "8600486869",
            material: "CE011",
            producerCode: "S322",
            labeledProducer: "S322",
            typification: "ESTANDAR 1",
            batch: "1216116",
         },
         {
            um: "8600486868",
            material: "CE011",
            producerCode: "S322",
            labeledProducer: "S322",
            typification: "ESTANDAR 1",
            batch: "1216120",
         },
         {
            um: "8600486853",
            material: "CE049",
            producerCode: "S322",
            labeledProducer: "S322",
            typification: "ESTANDAR 1",
            batch: "1216123",
            notification: {
               xl: -0.0293
            }
         },
         {
            um: "8600486552",
            material: "CE049",
            producerCode: "S322",
            labeledProducer: "S322",
            typification: "ESTANDAR 1",
            batch: "1216129",
         },
         {
            um: "8600486858",
            material: "CE052",
            producerCode: "S322",
            labeledProducer: "S322",
            typification: "ESTANDAR 1",
            batch: "1216106",
         },
         {
            um: "8600486857",
            material: "CE052",
            producerCode: "S322",
            labeledProducer: "S322",
            typification: "ESTANDAR 1",
            batch: "1216108",
         },
         {
            um: "8600486866",
            material: "CE052",
            producerCode: "S322",
            labeledProducer: "S322",
            typification: "ESTANDAR 1",
            batch: "1216118",
         },
         {
            um: "8600486856",
            material: "CE052",
            producerCode: "S322",
            labeledProducer: "S322",
            typification: "ESTANDAR 1",
            batch: "1216127",
         },
         {
            um: "8600486855",
            material: "CE052",
            producerCode: "S322",
            labeledProducer: "S322",
            typification: "ESTANDAR 1",
            batch: "1216128",
         },
         {
            um: "8600486858",
            material: "CE052",
            producerCode: "S322",
            labeledProducer: "S322",
            typification: "ESTANDAR 1",
            batch: "1216341",
         },
         {
            um: "8600486859",
            material: "CE062",
            producerCode: "S322",
            labeledProducer: "S322",
            typification: "ESTANDAR 1",
            batch: "1216109",
         },
         {
            um: "8600486867",
            material: "CE062",
            producerCode: "S322",
            labeledProducer: "S322",
            typification: "ESTANDAR 1",
            batch: "1216117",
         },
         {
            um: "8600486861",
            material: "CE062",
            producerCode: "S322",
            labeledProducer: "S322",
            typification: "ESTANDAR 1",
            batch: "1216122",
         },
         {
            um: "8600486860",
            material: "CE062",
            producerCode: "S322",
            labeledProducer: "S322",
            typification: "ESTANDAR 1",
            batch: "1216124",
         },
         {
            um: "8600486852",
            material: "CE062",
            producerCode: "S322",
            labeledProducer: "S322",
            typification: "ESTANDAR 1",
            batch: "1216126",
         },
         {
            um: "8600486851",
            material: "CE062",
            producerCode: "S322",
            labeledProducer: "S322",
            typification: "ESTANDAR 1",
            batch: "1216347",
         },
         {
            um: "8600486851",
            material: "CE062",
            producerCode: "S322",
            labeledProducer: "S322",
            typification: "ESTANDAR 1",
            batch: "1216349",
         },
         {
            um: "8600486889",
            material: "CE062",
            producerCode: "S322",
            labeledProducer: "S322",
            typification: "ESTANDAR 1",
            batch: "1216368",
         },
         {
            um: "8600486931",
            material: "CE090",
            producerCode: "S322",
            labeledProducer: "S322",
            typification: "ESTANDAR 1",
            batch: "1216119",
         },
         {
            center: "DC07",
            line: "UNITEC",
            variety: "LAPINS",
            varietyEt: "LAPINS",
            producerCode: "A081",
            labeledProducer: "A081",
            name: "PRUEBA ",
            species: "CEREZAS",
            typification: "PREMIUM",
            batchProcess: "DC05007470",
            reception: {
               exp: 0.8,
               l: 0.05,
               xl: 0.05,
               j: 0.3,
               xj: 0.2,
               xxj: 0.2,
               xxxj: 0.1,
               xxxjx: 0.1
            },
            unitec: {
               exp: 0.9,
               l: 0.06,
               xl: 0.06,
               j: 0.25,
               xj: 0.2,
               xxj: 0.2,
               xxxj: 0.13,
               xxxjx: 0.1
            },
            notification: {
               exp: 0.1,
               l: 0.01,
               xl: 0.01,
               j: -0.05,
               xj: 0.0,
               xxj: 0.0,
               xxxj: 0.03,
               xxxjx: 0.0
            }
         },
         {
            um: "8600487096",
            material: "CE011",
            producerCode: "A081",
            labeledProducer: "A081",
            typification: "PREMIUM",
            batch: "1216114",
         },
         {
            um: "8600486869",
            material: "CE011",
            producerCode: "A081",
            labeledProducer: "A081",
            typification: "PREMIUM",
            batch: "1216137",
         },
         {
            material: "CE011",
            producerCode: "A081",
            labeledProducer: "A081",
            typification: "PREMIUM",
            batch: "1216147",
         },
         {
            um: "8600486868",
            material: "CE011",
            producerCode: "A081",
            labeledProducer: "A081",
            typification: "PREMIUM",
            batch: "1216158",
         },
         {
            um: "8600486886",
            material: "CE011",
            producerCode: "A081",
            labeledProducer: "A081",
            typification: "PREMIUM",
            batch: "1216191",
         },
         {
            um: "8600486885",
            material: "CE011",
            producerCode: "A081",
            labeledProducer: "A081",
            batch: "1216193",
         }               
      ];      
    }

    getProductors() {
        return Promise.resolve(this.getProductorsData());
    }

    getFilters(): any {
      return Promise.resolve(
         this.getProductorsData().map(
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