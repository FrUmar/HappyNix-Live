import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { SafePipe } from './safe.pipe';
import { CommonModule } from '@angular/common';

interface Tutorial {
  title: string;
  description: string;
  longDescription: string;
  videoUrl: string;
}

@Component({
  selector: 'app-tutorials',
  standalone: true,
  imports: [SafePipe, CommonModule],
  templateUrl: './tutorials.component.html',
  styleUrl: './tutorials.component.scss'
})
export class TutorialsComponent implements AfterViewInit {
  @ViewChild('youtubePlayer') youtubePlayer!: ElementRef;
  player: any;
  tutorial: Tutorial = {
    title: 'Tutorial Video',
    description: 'Learn how to use our platform with this step-by-step video guide.',
    longDescription:
      'This tutorial covers the basics of navigating the platform, setting up your profile, and exploring key features. Follow along to get started quickly!',
    videoUrl: 'https://www.youtube.com/embed/teIaFOQjpcE?si=BbOb3E0UBWLN_m1j',
  };

  constructor() { }

  ngAfterViewInit(): void {
    // Load YouTube IFrame Player API
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    document.body.appendChild(tag);

    // Initialize YouTube player when API is ready
    (window as any).onYouTubeIframeAPIReady = () => {
      this.player = new (window as any).YT.Player(this.youtubePlayer.nativeElement, {
        events: {
          onReady: this.onPlayerReady.bind(this),
          onStateChange: this.onPlayerStateChange.bind(this),
        },
      });
    };
  }

  onPlayerReady(event: any): void {
    this.player = event.target;
  }

  onPlayerStateChange(event: any): void {
    // YT.PlayerState.PLAYING is 1
    event.data === 1;
  }
}
