import { CommonModule } from '@angular/common';
import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { SafePipe } from "../tutorials/safe.pipe";

@Component({
  selector: 'app-about',
  imports: [CommonModule, SafePipe],
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss'
})
export class AboutComponent {
  @ViewChild('aboutVideo') aboutVideo!: ElementRef;
  player: any;
  isPlaying: boolean = false;
  isMuted: boolean = false;
  videoUrl: any;

  team = [
    {
      name: 'Alex Cipher',
      role: 'Founder & Lead Developer',
      bio: 'Alex drives our vision for cutting-edge screen monitoring solutions, with over a decade of experience in cybersecurity and RAT development.',
      photo: 'https://img.freepik.com/premium-photo/portrait-anonymous-hacker-hacking-computer-system-cyber-crime-cyber-security-cybercrime_825385-827.jpg',
    },
    {
      name: 'Luna Byte',
      role: 'Security Architect',
      bio: 'Luna specializes in encryption and stealth technologies, ensuring our tools are secure and undetectable.',
      photo: 'https://img.freepik.com/premium-photo/portrait-anonymous-hacker-hacking-computer-system-cyber-crime-cyber-security-cybercrime_825385-827.jpg',
    },
    {
      name: 'Max Neon',
      role: 'UI/UX Designer',
      bio: 'Max crafts our cyberpunk-inspired interfaces, blending aesthetics with seamless functionality.',
      photo: 'https://img.freepik.com/premium-photo/portrait-anonymous-hacker-hacking-computer-system-cyber-crime-cyber-security-cybercrime_825385-827.jpg',
    },
    {
      name: 'Vera Code',
      role: 'QA Engineer',
      bio: 'Vera ensures our tools deliver flawless performance across Android and Windows platforms.',
      photo: 'https://img.freepik.com/premium-photo/portrait-anonymous-hacker-hacking-computer-system-cyber-crime-cyber-security-cybercrime_825385-827.jpg',
    },
  ];

  constructor(private sanitizer: DomSanitizer) {
    this.videoUrl =
      'https://www.youtube.com/embed/teIaFOQjpcE?si=RVkdW_6ZB_hZCxch' // Replace with actual company video ID

  }

  ngAfterViewInit(): void {
    // Load YouTube IFrame Player API
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    document.body.appendChild(tag);

    // Initialize YouTube player when API is ready
    (window as any).onYouTubeIframeAPIReady = () => {
      this.player = new (window as any).YT.Player('about-video', {
        events: {
          onReady: this.onPlayerReady.bind(this),
        },
      });
    };
  }

  onPlayerReady(event: any): void {
    this.player = event.target;
  }

  togglePlayPause(): void {
    if (this.isPlaying) {
      this.player.pauseVideo();
    } else {
      this.player.playVideo();
    }
    this.isPlaying = !this.isPlaying;
  }

  toggleMute(): void {
    if (this.isMuted) {
      this.player.unMute();
    } else {
      this.player.mute();
    }
    this.isMuted = !this.isMuted;
  }
}
