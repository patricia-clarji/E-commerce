//Root component of the application
//Serves as the main entry point for the application
//contains the router outlet for rendering different views based on the current route.
import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})

export class App {
  protected readonly title = signal('Nexora');
}
