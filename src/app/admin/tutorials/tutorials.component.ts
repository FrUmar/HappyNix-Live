import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-tutorials',
  imports: [CommonModule, FormsModule],
  templateUrl: './tutorials.component.html',
  styleUrl: './tutorials.component.scss'
})
export class TutorialsComponent {
  constructor(private sanitizer: DomSanitizer) { }

  languages = ['English', 'Urdu', 'Hindi'];
  selectedLanguage = 'English';

  tutorials = [
    {
      title: 'Getting Started with AllExploid',
      videoUrl: 'https://www.youtube.com/embed/wBU-I6Ej-08?si=X3BYAV-Z_XxNU0n0',
      language: 'Hindi'
    },
    {
      title: 'AllExploid Basic Setup (Urdu)',
      videoUrl: 'https://www.youtube.com/embed/tgbNymZ7vqY',
      language: 'Urdu'
    },
    {
      title: 'How to Add Tools in Hindi',
      videoUrl: 'https://www.youtube.com/embed/kJQP7kiw5Fk',
      language: 'Hindi'
    },
    {
      title: 'Advanced Dashboard Tutorial',
      videoUrl: 'https://www.youtube.com/embed/jNQXAC9IVRw',
      language: 'English'
    }
  ];

  filteredTutorials = this.tutorials;

  getSafeUrl(url: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  filterTutorials() {
    this.filteredTutorials = this.tutorials.filter(
      (t) => t.language === this.selectedLanguage
    );
  }
}
