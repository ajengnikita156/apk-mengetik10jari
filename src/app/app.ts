import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

// Import newly created components
import { Sidebar } from './components/sidebar/sidebar';
import { Dashboard } from './components/dashboard/dashboard';
import { Learning } from './components/learning/learning';
import { TypingTest } from './components/typing-test/typing-test';
import { Race } from './components/race/race';
import { Stats } from './components/stats/stats';

type AppScreen = 'home' | 'learning' | 'typing-test' | 'race' | 'stats';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet, 
    CommonModule,
    Sidebar,
    Dashboard,
    Learning,
    TypingTest,
    Race,
    Stats
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class AppComponent {
  currentScreen: AppScreen = 'home';

  setScreen(screen: AppScreen) {
    this.currentScreen = screen;
  }
}
