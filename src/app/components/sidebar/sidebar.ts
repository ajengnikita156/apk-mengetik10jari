import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar {
  @Output() screenChange = new EventEmitter<string>();
  activeScreen = 'home';

  navigateTo(screen: string) {
    this.activeScreen = screen;
    this.screenChange.emit(screen);
  }
}
