import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MenuComponent } from './head/menu/menu.component';
import { PacmanComponent } from './body/pacman/pacman.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,MenuComponent,PacmanComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Pacman';
}
