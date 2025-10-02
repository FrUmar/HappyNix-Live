import { Component, OnInit, OnDestroy, AfterViewInit, ElementRef, QueryList, ViewChildren } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

// Define interfaces for better type safety
interface Slide {
  image: string;
  title: string;
  description: string;
}

interface Category {
  name: string;
  icon: string;
}

interface Tool {
  toolId: number;
  icon: string;
  name: string;
  description: string;
  isFree: boolean;
  price: number;
  downloadLink: string;
}

interface VmwareTool {
  icon: string;
  title: string;
  description: string;
  link: string;
  linkText: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit, OnDestroy, AfterViewInit {

  slides: Slide[] = [
    {
      image: 'https://sectricity.com/wp-content/uploads/2023/05/Hacker-Cyber-Security-Internet-Sectricity.jpg',
      title: 'Quantum Injector',
      description: 'Bypass any firewall with our new quantum entanglement toolkit.'
    },
    {
      image: 'https://bif.telkomuniversity.ac.id/wp-content/uploads/2024/09/Apa-Itu-Ethical-Hacking-dan-Bagaimana-Menjadi-Seorang-Ethical-Hacker.jpeg',
      title: 'Cyberpunk 2077 Hacking Contest',
      description: 'Join now and win exclusive prizes!'
    },
    {
      image: 'https://www.wattlecorp.com/wp-content/uploads/2020/08/Top-7-ethical-hacking-tools.jpg',
      title: 'Neural Scrambler',
      description: 'Advanced social engineering tool powered by AI.'
    }
  ];

  categories: Category[] = [
    { name: 'Android', icon: 'https://osm.eu.com/wp-content/uploads/2022/04/osm_rat_risk_analysis_tool.jpg' },
    { name: 'Windows', icon: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRdWePDsOXD_C9BbzLpRYoUXDL-EzAjGqGH0Q&s' },
    { name: 'Other', icon: 'https://cdn.softwareportal.com/wp-content/uploads/best-server-monitoring-software-and-tools-650x400.png' },
    // { name: 'Educational', icon: 'https://media.licdn.com/dms/image/v2/D4D12AQFdvK62HWKJGA/article-cover_image-shrink_720_1280/article-cover_image-shrink_720_1280/0/1730812750277?e=2147483647&v=beta&t=LdJtlUAJZ3Giz9J3VfVXhZjoA1OciIJQ8lPtiaichSM' }
  ];

  tools: Tool[] = [
    {
      toolId: 1,
      icon: 'https://hackersonlineclub.com/wp-content/uploads/2020/03/Port-Scanning.png',
      name: 'Port Scanner',
      description: 'A basic tool to scan for open ports on a target system.',
      isFree: false,
      price: 150,
      downloadLink: '#'
    },
    {
      toolId: 2,
      icon: 'https://prod.ifacet.in/images/uploads/basic-quantum-programming-1751535338126.jpg',
      name: 'Wi-Fi Cracker',
      description: 'A simple WPA/WPA2 password cracker for educational purposes.',
      isFree: true,
      price: 0,
      downloadLink: '#'
    },
    {
      toolId: 3,
      icon: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTONrp_VqP1hIBL6Wm8XGm4z2iofoPkRuLyTw&s',
      name: 'Zero-Day Exploit Kit',
      description: 'A comprehensive kit with the latest zero-day exploits.',
      isFree: false,
      price: 50,
      downloadLink: '#'
    },
    {
      toolId: 4,
      icon: 'https://mobileimages.lowes.com/productimages/7d3df928-b690-4670-91e5-09b65ec21d68/67150973.jpeg',
      name: 'Ghost Cloaker',
      description: 'Become completely anonymous with our advanced cloaking technology.',
      isFree: false,
      price: 500,
      downloadLink: '#'
    },
    {
      toolId: 5,
      icon: 'https://image-optimizer.cyberriskalliance.com/unsafe/1920x0/https://files.cyberriskalliance.com/wp-content/uploads/2023/07/0725_phishing.jpg',
      name: 'AI Phisher',
      description: 'Automated phishing campaigns with social engineering AI.',
      isFree: true,
      price: 0,
      downloadLink: '#'
    }
  ];

  vmwareTools: VmwareTool[] = [
    {
      icon: '🖥️',
      title: 'Run Nearly Any Operating System, Virtually',
      description: 'Choose from hundreds of supported operating systems, from cloud-ready Linux distributions to the latest Windows 11, all without rebooting.',
      link: '#',
      linkText: 'Learn More'
    },
    {
      icon: '🛡️',
      title: 'Develop and Test for Any Platform',
      description: 'Support for VMs, containers, Kubernetes clusters, providing developers a versatile and automatable platform.',
      link: '#',
      linkText: 'Explore Features'
    },
    {
      icon: '🖥️',
      title: 'Connect to vSphere',
      description: 'Connect Fusion or Workstation to remote vSphere/ESX servers, launch/control/manage VMs, migrate to private cloud easily.',
      link: '#',
      linkText: 'See Integration'
    },
    {
      icon: '🛡️',
      title: 'Run Secure and Isolated Desktops',
      description: 'Run a second secure desktop with different privacy settings, snapshots for roll-back and recovery.',
      link: '#',
      linkText: 'View Security Details'
    }
  ];

  currentSlide = 0;
  private sliderInterval?: ReturnType<typeof setInterval>;

  @ViewChildren('animatedSection', { read: ElementRef }) animatedSections!: QueryList<ElementRef>;
  private observer?: IntersectionObserver;

  get freeTools(): Tool[] {
    return this.tools.filter(tool => tool.isFree);
  }

  get paidTools(): Tool[] {
    return this.tools.filter(tool => !tool.isFree);
  }

  ngOnInit(): void {
    this.sliderInterval = setInterval(() => {
      this.nextSlide();
    }, 5000);
  }

  ngAfterViewInit(): void {
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1
    };

    this.observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, options);

    this.animatedSections.forEach(section => {
      this.observer?.observe(section.nativeElement);
    });
  }

  ngOnDestroy(): void {
    if (this.sliderInterval) {
      clearInterval(this.sliderInterval);
    }
    this.observer?.disconnect();
  }

  nextSlide(): void {
    this.currentSlide = (this.currentSlide + 1) % this.slides.length;
  }
}
