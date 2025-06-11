import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { HammerModule } from '@angular/platform-browser';
import { CarouselModule } from 'primeng/carousel';

@Component({
  selector: 'app-love',
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    HammerModule,
    CarouselModule,
  ],
  templateUrl: './love.component.html',
  styleUrl: './love.component.scss',
})
export class LoveComponent implements OnInit {
  images = [
    {
      url: 'https://images.unsplash.com/photo-1508780709619-79562169bc64?auto=format&fit=crop&w=800&q=60',
    },
    {
      url: 'https://images.unsplash.com/photo-1496307042754-b4aa456c4a2d?auto=format&fit=crop&w=800&q=60',
    },
    {
      url: 'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=800&q=60',
    },
  ];

  years = 0;
  months = 0;
  days = 0;
  hours = 0;

  emojis: { left: string; duration: string; delay: string }[] = [];
  isPlaying = false;

  currentIndex = 0;

  private touchStartX = 0;
  private touchEndX = 0;

  @ViewChild('audio', { static: true }) audioRef!: ElementRef<HTMLAudioElement>;
  ngOnInit(): void {
    for (let i = 0; i < 10; i++) {
      this.emojis.push({
        left: `${Math.random() * 100}%`,
        duration: `${3 + Math.random() * 3}s`,
        delay: `${Math.random() * 5}s`,
      });
    }
    setInterval(() => {
      this.nextImage();
    }, 5000);

    this.calculateLoveTime();
  }

  calculateLoveTime(): void {
    const startDate = new Date(2024, 3, 26); // Mês começa do 0 => Abril = 3
    const now = new Date();

    const diffMs = now.getTime() - startDate.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const totalHours = Math.floor(diffMs / (1000 * 60 * 60));

    const years = Math.floor(diffDays / 365);
    const months = Math.floor((diffDays % 365) / 30);
    const days = (diffDays % 365) % 30;

    this.years = years;
    this.months = months;
    this.days = days;
    this.hours = totalHours;
  }

  togglePlay() {
    const audio = this.audioRef.nativeElement;
    if (this.isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    this.isPlaying = !this.isPlaying;
  }

  onTouchStart(event: TouchEvent | MouseEvent): void {
    this.touchStartX = this.getX(event);
  }

  onTouchEnd(event: TouchEvent | MouseEvent): void {
    this.touchEndX = this.getX(event);
    this.handleSwipe();
  }

  private getX(event: TouchEvent | MouseEvent): number {
    if (event instanceof TouchEvent) {
      return event.changedTouches[0].clientX;
    } else {
      return (event as MouseEvent).clientX;
    }
  }

  private handleSwipe(): void {
    const deltaX = this.touchEndX - this.touchStartX;
    if (Math.abs(deltaX) > 50) {
      if (deltaX < 0) {
        this.nextImage();
      } else {
        this.previousImage();
      }
    }
  }

  nextImage(): void {
    this.currentIndex = (this.currentIndex + 1) % this.images.length;
  }

  previousImage(): void {
    this.currentIndex =
      (this.currentIndex - 1 + this.images.length) % this.images.length;
  }
}
