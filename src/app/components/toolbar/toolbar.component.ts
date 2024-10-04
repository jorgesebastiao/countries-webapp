import { Component, EventEmitter, Input, Output, output } from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatToolbarModule} from '@angular/material/toolbar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-toolbar',
  standalone: true,
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.scss',
  imports: [MatToolbarModule, MatButtonModule, MatIconModule],

})
export class ToolbarComponent {
  @Output() onToggleChange: EventEmitter<void> = new EventEmitter();

  constructor(private router: Router){

  }
  
  handleToggleTheme(): void {
    this.onToggleChange.emit();
  }

  handleGoToHome(){
    this.router.navigate(['/']);
  }
}
