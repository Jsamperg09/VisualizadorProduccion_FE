import { Injectable } from "@angular/core";
import { MessageService } from "primeng/api";

@Injectable({ providedIn: 'root' })
export class ToastService{
    constructor(private messageService: MessageService){}

    showToast(severity = 'success', summary = 'Proceso exitoso ', detail = '') { 
        this.messageService.add({severity: severity, summary:  summary, detail: detail });
    }        
}