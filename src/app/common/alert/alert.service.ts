import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

@Injectable({ providedIn: 'root' })
export class AlertService {
    public errorMessage: Subject<string> = new Subject<string>();

    /**
   * エラーメッセージの表示
   */
    public showError(message: string): void {
        this.errorMessage.next(message);
    }

    /**
     * エラーメッセージの非表示
     */
    public hideError(): void {
        this.errorMessage.next('');
    }
}