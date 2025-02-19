import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {
  HeaderComponent,
  FooterComponent
} from './components/index.components';


@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    HeaderComponent,
    FooterComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Pacman';
}
