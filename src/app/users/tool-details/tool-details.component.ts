import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule, Location } from '@angular/common';
import { Subscription } from 'rxjs';
import { SafePipe } from "../tutorials/safe.pipe";

// Define the Tool interface
export interface Tool {
  toolId: number;
  icon: string;
  name: string;
  description: string;
  longDescription: string;
  isFree: boolean;
  price: number;
  downloadLink: string;
  descriptionImages: string[];
  features: string[];
  version: string;
  releaseDate: string;
  author: string;
  demoVideoUrl: string;
}

@Component({
  selector: 'app-tool-details',
  standalone: true,
  imports: [CommonModule, RouterModule, SafePipe],
  templateUrl: './tool-details.component.html',
  styleUrls: ['./tool-details.component.scss']
})
export class ToolDetailsComponent implements OnInit, OnDestroy {
  tool: Tool | undefined;
  private routeSub: Subscription | undefined;

  // In a real app, this would come from a service.
  private allTools: Tool[] = [
    {
      toolId: 1,
      icon: 'https://hackersonlineclub.com/wp-content/uploads/2020/03/Port-Scanning.png',

      name: 'Port Scanner',
      description: 'A basic tool to scan for open ports on a target system.',
      isFree: false,
      price: 150,
      longDescription: 'Our advanced Port Scanner is engineered for speed and accuracy, allowing security professionals and network administrators to quickly identify open ports and running services on a host. It supports a wide range of scanning techniques, including TCP connect, SYN stealth, and UDP scans.',
      downloadLink: '#',
      descriptionImages: [
        'https://via.placeholder.com/800x450/000000/00ff00?text=Port+Scanner+UI',
        'https://via.placeholder.com/800x450/000000/00ff00?text=Scan+Results',
        'https://via.placeholder.com/800x450/000000/00ff00?text=Configuration+Panel'
      ],
      features: ['TCP & UDP Scanning', 'Service Version Detection', 'OS Fingerprinting', 'Customizable Scan Speed'],
      version: '2.1.0',
      releaseDate: '2023-10-26',
      author: 'All Exploits Inc.',
      demoVideoUrl:
        'https://www.youtube.com/embed/BGfftZNynLc?si=DKYzaXtYryMT60vk'
    },
    {
      toolId: 2,
      icon: 'https://prod.ifacet.in/images/uploads/basic-quantum-programming-1751535338126.jpg',

      name: 'Wi-Fi Cracker',
      description: 'A simple WPA/WPA2 password cracker for educational purposes.',
      isFree: true,
      price: 0,
      longDescription: 'This educational tool demonstrates the vulnerabilities in WPA/WPA2 protocols by using dictionary and brute-force attacks. It captures handshakes and processes them against wordlists to recover network keys. Intended strictly for security research and education.',
      downloadLink: '#',
      descriptionImages: [
        'https://media.licdn.com/dms/image/v2/C4D12AQGfW2CRxqsleA/article-cover_image-shrink_600_2000/article-cover_image-shrink_600_2000/0/1623308571878?e=2147483647&v=beta&t=3hhFz3CTkbx8w71Ctz8nZak0qIYkOeUqVZTEZWgULSc',
        'https://www.stationx.net/wp-content/uploads/2024/05/3.-Learn-Network-Hacking-From-Scratch-WiFi-Wired.jpg',
      ],
      features: ['WPA/WPA2-PSK Cracking', 'Dictionary Attack Mode', 'Brute-force Attack Mode', 'Handshake Analysis'],
      version: '1.5.3',
      releaseDate: '2023-09-15',
      author: 'EthicalHackers',
      demoVideoUrl:
        'https://www.youtube.com/embed/BGfftZNynLc?si=DKYzaXtYryMT60vk'
    },
    {
      toolId: 3,
      icon: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTONrp_VqP1hIBL6Wm8XGm4z2iofoPkRuLyTw&s',

      name: 'Zero-Day Exploit Kit',
      description: 'A comprehensive kit with the latest zero-day exploits.',
      longDescription: 'This educational tool demonstrates the vulnerabilities in WPA/WPA2 protocols by using dictionary and brute-force attacks. It captures handshakes and processes them against wordlists to recover network keys. Intended strictly for security research and education.',
      isFree: false,
      price: 50,
      downloadLink: '#',
      descriptionImages: [
        'https://via.placeholder.com/800x450/000000/00ff00?text=Network+Selection',
        'https://via.placeholder.com/800x450/000000/00ff00?text=Handshake+Capture',
        'https://via.placeholder.com/800x450/000000/00ff00?text=Cracking+Process'
      ],
      features: ['WPA/WPA2-PSK Cracking', 'Dictionary Attack Mode', 'Brute-force Attack Mode', 'Handshake Analysis'],
      version: '1.5.3',
      releaseDate: '2023-09-15',
      author: 'EthicalHackers', demoVideoUrl:
        'https://www.youtube.com/embed/BGfftZNynLc?si=DKYzaXtYryMT60vk'
    },
    {
      toolId: 4,
      icon: 'https://mobileimages.lowes.com/productimages/7d3df928-b690-4670-91e5-09b65ec21d68/67150973.jpeg',

      name: 'Ghost Cloaker',
      description: 'Become completely anonymous with our advanced cloaking technology.',
      isFree: false,
      price: 500,
      longDescription: 'This educational tool demonstrates the vulnerabilities in WPA/WPA2 protocols by using dictionary and brute-force attacks. It captures handshakes and processes them against wordlists to recover network keys. Intended strictly for security research and education.',
      downloadLink: '#',
      descriptionImages: [
        'https://via.placeholder.com/800x450/000000/00ff00?text=Network+Selection',
        'https://via.placeholder.com/800x450/000000/00ff00?text=Handshake+Capture',
        'https://via.placeholder.com/800x450/000000/00ff00?text=Cracking+Process'
      ],
      features: ['WPA/WPA2-PSK Cracking', 'Dictionary Attack Mode', 'Brute-force Attack Mode', 'Handshake Analysis'],
      version: '1.5.3',
      releaseDate: '2023-09-15',
      author: 'EthicalHackers',
      demoVideoUrl:
        'https://www.youtube.com/embed/BGfftZNynLc?si=DKYzaXtYryMT60vk'
    },
    {
      toolId: 5,
      icon: 'https://image-optimizer.cyberriskalliance.com/unsafe/1920x0/https://files.cyberriskalliance.com/wp-content/uploads/2023/07/0725_phishing.jpg',

      name: 'AI Phisher',
      description: 'Automated phishing campaigns with social engineering AI.',
      isFree: true,
      price: 0,
      longDescription: 'This educational tool demonstrates the vulnerabilities in WPA/WPA2 protocols by using dictionary and brute-force attacks. It captures handshakes and processes them against wordlists to recover network keys. Intended strictly for security research and education.',

      downloadLink: '#',
      descriptionImages: [
        'https://via.placeholder.com/800x450/000000/00ff00?text=Network+Selection',
        'https://via.placeholder.com/800x450/000000/00ff00?text=Handshake+Capture',
        'https://via.placeholder.com/800x450/000000/00ff00?text=Cracking+Process'
      ],
      features: ['WPA/WPA2-PSK Cracking', 'Dictionary Attack Mode', 'Brute-force Attack Mode', 'Handshake Analysis'],
      version: '1.5.3',
      releaseDate: '2023-09-15',
      author: 'EthicalHackers',
      demoVideoUrl:
        'https://www.youtube.com/embed/BGfftZNynLc?si=DKYzaXtYryMT60vk'
    },

  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private location: Location
  ) { }

  ngOnInit(): void {
    this.routeSub = this.route.queryParamMap.subscribe(params => {
      const id = params.get('toolId');
      if (id) {
        // The + operator is a quick way to convert a string to a number
        this.tool = this.allTools.find(t => t.toolId === +id);
        if (!this.tool) {
          // Handle case where tool is not found
          console.error('Tool not found!');
          this.router.navigate(['/dashboard']); // or a 'not-found' page
        }
      } else {
        // Handle case where toolId is not present
        console.error('No toolId provided in query params!');
        this.router.navigate(['/dashboard']);
      }
    });
  }

  ngOnDestroy(): void {
    this.routeSub?.unsubscribe();
  }

  goBack(): void {
    this.location.back();
  }
}