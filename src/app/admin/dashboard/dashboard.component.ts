import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  user = {
    name: 'Happy',
    avatarUrl: 'https://api.dicebear.com/8.x/bottts/svg?seed=umar', // Placeholder avatar
    membership: 'Tier 2 Operator',
    lastLogin: new Date('2024-05-20T10:00:00Z'),
    stats: {
      toolsPurchased: 2,
      downloads: 4,
      tutorialsCompleted: 2
    }
  };

  tools = [
    { name: 'Tool A', version: '1.5', lastDownloaded: new Date() },
    { name: 'Tool B', version: '2.1', lastDownloaded: new Date() }
  ];

  updates = [
    { name: 'Tool X', newVersion: '2.0' }
  ];

  orders = [
    { id: 'ORD123', date: new Date('2024-05-19T11:30:00Z'), status: 'Completed', total: 49.99 },
    { id: 'ORD124', date: new Date('2024-05-20T15:00:00Z'), status: 'Pending', total: 29.99 },
    { id: 'ORD125', date: new Date('2024-05-18T14:30:00Z'), status: 'Failed', total: 99.99 }
  ];

  learning = {
    read: ['VM Setup Guide', 'Intro to Reverse Engineering'],
    badges: ['VM Setup Guide'],
    recommendations: ['Advanced Malware Analysis'],
    progress: [
      { name: 'Reverse Engineering', value: 75 },
      { name: 'Malware Analysis', value: 45 },
    ]
  };

  announcements = [
    { title: 'System Alert: Tool Safety Update v1.5', date: new Date() },
    { title: 'Best Practice: Isolate your VM', date: new Date() }
  ];

  constructor(private titleService: Title) { }

  ngOnInit(): void {
    this.titleService.setTitle(`Dashboard - ${this.user.name}`);
  }
}
