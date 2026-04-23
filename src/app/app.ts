import { Component, ViewChild, ElementRef } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

interface CharState {
  value: string;
  status: 'pending' | 'correct' | 'incorrect';
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class AppComponent {
  @ViewChild('typeInput') typeInput!: ElementRef<HTMLInputElement>;

  title = 'typing-pro';
  gameStarted = false;
  currentIndex = 0;
  displayChars: CharState[] = [];
  
  // Stats
  wpm = 0;
  accuracy = 100;
  timeLeft = 60;
  correctChars = 0;
  totalCharsTyped = 0;
  
  timer: any;
  startTime: number = 0;

  sampleText = "Mengetik sepuluh jari adalah teknik mengetik tanpa melihat papan tombol. Teknik ini menggunakan seluruh jari tangan untuk meningkatkan kecepatan dan akurasi dalam mengetik.";

  startGame() {
    this.gameStarted = true;
    this.currentIndex = 0;
    this.wpm = 0;
    this.accuracy = 100;
    this.timeLeft = 60;
    this.correctChars = 0;
    this.totalCharsTyped = 0;
    this.displayChars = this.sampleText.split('').map(char => ({
      value: char,
      status: 'pending'
    }));

    setTimeout(() => {
      if (this.typeInput) {
        this.typeInput.nativeElement.focus();
      }
    }, 100);

    this.startTimer();
  }

  startTimer() {
    this.startTime = Date.now();
    if (this.timer) clearInterval(this.timer);
    
    this.timer = setInterval(() => {
      if (this.timeLeft > 0) {
        this.timeLeft--;
        this.calculateStats();
      } else {
        this.endGame();
      }
    }, 1000);
  }

  onInput(event: any) {
    const input = event.target.value;
    if (!input) return;

    const charTyped = input[input.length - 1];
    const targetChar = this.displayChars[this.currentIndex].value;

    this.totalCharsTyped++;

    if (charTyped === targetChar) {
      this.displayChars[this.currentIndex].status = 'correct';
      this.correctChars++;
    } else {
      this.displayChars[this.currentIndex].status = 'incorrect';
    }

    this.currentIndex++;
    event.target.value = ''; // Clear input to keep focus on flow

    if (this.currentIndex === this.displayChars.length) {
      this.endGame();
    }
    
    this.calculateStats();
  }

  calculateStats() {
    const timeElapsed = (Date.now() - this.startTime) / 1000 / 60; // in minutes
    if (timeElapsed > 0) {
      this.wpm = Math.round((this.correctChars / 5) / timeElapsed);
    }
    
    if (this.totalCharsTyped > 0) {
      this.accuracy = Math.round((this.correctChars / this.totalCharsTyped) * 100);
    }
  }

  endGame() {
    clearInterval(this.timer);
    this.gameStarted = false;
    alert(`Latihan Selesai!\nKecepatan: ${this.wpm} WPM\nAkurasi: ${this.accuracy}%`);
  }
}
