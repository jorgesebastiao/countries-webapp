import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SpinnerService } from './spinner.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-spinner',
  standalone: true,
  templateUrl: './spinner.component.html',
  styleUrl: './spinner.component.scss',
  imports: [CommonModule, MatProgressBarModule, MatProgressSpinnerModule],
})
export class SpinnerComponent implements OnInit {
  showSpinner = false;

  constructor(private spinnerService: SpinnerService,
    private cdRef: ChangeDetectorRef) { }

  ngOnInit() {
    this.init();
  }

  init() {
    this.spinnerService.getSpinnerObserver().subscribe(status => {
      this.showSpinner = status === 'start';
      this.cdRef.detectChanges();
    })
  }
}

