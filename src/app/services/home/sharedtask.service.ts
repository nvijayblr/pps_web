import { Observable } from 'rxjs';
import { Subject } from 'rxjs/Subject';
import { Injectable } from '@angular/core';

@Injectable()
export class SharedtaskService {

  constructor() { }

  private initialGammeToBeAssigned = new Subject<any>();
  initialGammeToBeAssigned$ = this.initialGammeToBeAssigned.asObservable();
  sendInitialGammeToBeAssigned(data: any) {
    this.initialGammeToBeAssigned.next(data);
  }

  private gammeToBeAssigned = new Subject<any>();
  gammeToBeAssigned$ = this.gammeToBeAssigned.asObservable();
  sendGammeToBeAssigned(data: any) {
    this.gammeToBeAssigned.next(data);
  }

  private prodDataToBeAssigned = new Subject<any>();
  prodDataToBeAssigned$ = this.prodDataToBeAssigned.asObservable();
  sendProdDataToBeAssigned(data: any) {
    this.prodDataToBeAssigned.next(data);
  }

  private prodOldQuantityToBeAssigned = new Subject<any>();
  prodOldQuantityToBeAssigned$ = this.prodOldQuantityToBeAssigned.asObservable();
  sendProdOldQuantityToBeAssigned(data: any) {
    this.prodOldQuantityToBeAssigned.next(data);
  }

  private prodSummaryToBeAssigned = new Subject<any>();
  prodSummaryToBeAssigned$ = this.prodSummaryToBeAssigned.asObservable();
  sendProdSummaryToBeAssigned(data: any) {
    this.prodSummaryToBeAssigned.next(data);
  }

  private packBeginDateToBeAssigned = new Subject<any>();
  packBeginDateToBeAssigned$ = this.packBeginDateToBeAssigned.asObservable();
  sendPackBeginDateToBeAssigned(data: any) {
    this.packBeginDateToBeAssigned.next(data);
  }

  private keepQuantityToBeAssigned = new Subject<any>();
  keepQuantityToBeAssigned$ = this.keepQuantityToBeAssigned.asObservable();
  sendKeepQuantityToBeAssigned(data: any) {
    this.keepQuantityToBeAssigned.next(data);
  }

  private adjustProdToBeAssigned = new Subject<any>();
  adjustProdToBeAssigned$ = this.adjustProdToBeAssigned.asObservable();
  sendAdjustProdToBeAssigned(data: any) {
    this.adjustProdToBeAssigned.next(data);
  }

  private prodOldMaxQuantityToBeAssigned = new Subject<any>();
  prodOldMaxQuantityToBeAssigned$ = this.prodOldMaxQuantityToBeAssigned.asObservable();
  sendProdOldMaxQuantityToBeAssigned(data: any) {
    this.prodOldMaxQuantityToBeAssigned.next(data);
  }

  private prodAndPackDetailsToBeAssigned = new Subject<any>();
  prodAndPackDetailsToBeAssigned$ = this.prodAndPackDetailsToBeAssigned.asObservable();
  sendProdAndPackDetailsToBeAssigned(data: any) {
    this.prodAndPackDetailsToBeAssigned.next(data);
  }
  
  private selectedLineToBeAssigned = new Subject<any>();
  selectedLineToBeAssigned$ = this.selectedLineToBeAssigned.asObservable();
  sendSelectedLineToBeAssigned(data: any) {
    this.selectedLineToBeAssigned.next(data);
  }

  private specialGammeToBeAssigned = new Subject<any>();
  specialGammeToBeAssigned$ = this.specialGammeToBeAssigned.asObservable();
  sendSpecialGammeToBeAssigned(data: any) {
    this.specialGammeToBeAssigned.next(data);
  }

  private initialProdDataToBeAssigned = new Subject<any>();
  initialProdDataToBeAssigned$ = this.initialProdDataToBeAssigned.asObservable();
  sendInitialProdDataToBeAssigned(data: any) {
    this.initialProdDataToBeAssigned.next(data);
  }

  /*Create Task Shared Object*/
  private itemNumberToGetGamme = new Subject<any>();
  itemNumberToGetGamme$ = this.itemNumberToGetGamme.asObservable();
  sendItemNumberToGetGamme(data: any) {
    this.itemNumberToGetGamme.next(data);
  }
}
