import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';

interface CharState {
  char: string;
  status: 'pending' | 'correct' | 'incorrect';
}

@Component({
  selector: 'app-learning',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './learning.html',
  styleUrl: './learning.css',
})
export class Learning {
  currentLevel = 1;
  currentStep = 1;
  
  // Pelajaran 1: Baris Dasar (Home Row)
  targetChars: CharState[] = [];
  
  currentIndex = 0;
  errorCount = 0;
  startTime: number | null = null;
  wpm = 0;
  accuracy = 100;
  totalTyped = 0;

  constructor() {
    this.generateLesson1();
  }

  generateLesson1() {
    const sequence = "aa ss dd ff jj kk ll ;;";
    this.targetChars = sequence.split('').map(char => ({
      char: char,
      status: 'pending'
    }));
  }

  get progress(): number {
    return (this.currentIndex / this.targetChars.length) * 100;
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyPress(event: KeyboardEvent) {
    if (event.key.length !== 1 && event.key !== ' ') return;
    
    // Prevent default for space to avoid scrolling
    if (event.key === ' ') event.preventDefault();

    if (this.startTime === null) this.startTime = Date.now();

    const pressedKey = event.key;
    const currentTarget = this.targetChars[this.currentIndex];

    // Jika spasi, pastikan kita menangani karakter spasi di sequence
    if (this.currentIndex >= this.targetChars.length) return;

    this.totalTyped++;

    if (pressedKey === currentTarget.char) {
      currentTarget.status = 'correct';
      this.currentIndex++;
      
      if (this.currentIndex === this.targetChars.length) {
        this.calculateFinalStats();
      }
    } else {
      currentTarget.status = 'incorrect';
      this.errorCount++;
    }

    this.updateLiveStats();
  }

  updateLiveStats() {
    if (this.totalTyped > 0) {
      this.accuracy = Math.round(((this.totalTyped - this.errorCount) / this.totalTyped) * 100);
    }
  }

  calculateFinalStats() {
    const endTime = Date.now();
    const durationMinutes = (endTime - (this.startTime || endTime)) / 60000;
    this.wpm = Math.round((this.targetChars.length / 5) / (durationMinutes || 1));
    // Alert dihapus agar statistik hanya terlihat di panel bawah UI
    // this.reset(); // Jangan langsung reset agar user bisa melihat statistik akhirnya dulu
  }

  reset() {
    this.currentIndex = 0;
    this.errorCount = 0;
    this.startTime = null;
    this.totalTyped = 0;
    this.generateLesson1();
  }

  getCurrentChar(): string {
    if (this.currentIndex < this.targetChars.length) {
      return this.targetChars[this.currentIndex].char;
    }
    return '';
  }

  getActiveHand(): 'left' | 'right' | 'none' {
    const char = this.getCurrentChar().toLowerCase();
    if (['a', 's', 'd', 'f'].includes(char)) return 'left';
    if (['j', 'k', 'l', ';'].includes(char)) return 'right';
    return 'none';
  }

  getActiveFinger(): number {
    const char = this.getCurrentChar().toLowerCase();
    const map: { [key: string]: number } = {
      'a': 0, ';': 0, // Pinky
      's': 1, 'l': 1, // Ring
      'd': 2, 'k': 2, // Middle
      'f': 3, 'j': 3, // Index
      ' ': 4          // Thumb
    };
    return map[char] ?? -1;
  }
}
