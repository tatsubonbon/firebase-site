import { Component, OnDestroy, OnInit } from '@angular/core';

import { AlertService } from './alert.service';
@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css']
})
export class AlertComponent implements OnInit, OnDestroy {
  message = '';

  constructor(private alertService: AlertService) { }

  ngOnInit(): void {
    this.alertService.errorMessage.subscribe(message => {
      this.message = message;
    }
    )
  }

  ngOnDestroy(): void {
    this.alertService.errorMessage.unsubscribe();
  }
}
