import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

@Injectable({ providedIn: 'root' })
export class LoadingSpinnerService {
    isLoading: Subject<boolean> = new Subject<boolean>();

    /**
   * スピナーの表示
   */
    public show(): void {
        this.isLoading.next(true);
    }

    /**
     * スピナーの非表示
     */
    public hide(): void {
        this.isLoading.next(false);
    }
}