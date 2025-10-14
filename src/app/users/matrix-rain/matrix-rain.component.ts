import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';

@Component({
    selector: 'app-matrix-rain',
    standalone: true,
    template: `
    <canvas #matrixCanvas class="matrix-canvas"></canvas>
  `,
    styleUrls: ['./matrix-rain.component.scss']
})
export class MatrixRainComponent implements OnInit, OnDestroy {
    @ViewChild('matrixCanvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;

    private ctx!: CanvasRenderingContext2D | null;
    private animationInterval: any;
    private drops: number[] = [];
    private chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    private fontSize = 16;
    private columns!: number;
    private resizeHandler = this.resizeCanvas.bind(this);

    ngOnInit() {
        const canvas = this.canvasRef.nativeElement;
        this.ctx = canvas.getContext('2d');

        if (!this.ctx) return;

        this.resizeCanvas();
        window.addEventListener('resize', this.resizeHandler);

        this.columns = Math.floor(canvas.width / this.fontSize);
        this.drops = Array.from({ length: this.columns }, () => Math.random() * -100);

        this.animationInterval = setInterval(() => this.draw(), 50);
    }

    private resizeCanvas() {
        const canvas = this.canvasRef.nativeElement;
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    private draw() {
        if (!this.ctx) return;
        const canvas = this.canvasRef.nativeElement;

        // 🌌 Background
        this.ctx.fillStyle = 'rgba(0, 19, 42, 0.1)'; // translucent layer for trail effect
        this.ctx.fillRect(0, 0, canvas.width, canvas.height);

        this.ctx.font = `${this.fontSize}px monospace`;

        for (let i = 0; i < this.drops.length; i++) {
            const text = this.chars[Math.floor(Math.random() * this.chars.length)];
            const brightness = Math.random();

            // ✨ Text glow shades (based on brightness)
            if (brightness > 0.8) {
                this.ctx.shadowBlur = 10;
                this.ctx.shadowColor = '#84FCFD';
                this.ctx.fillStyle = '#84FCFD';
            } else if (brightness > 0.5) {
                this.ctx.shadowBlur = 5;
                this.ctx.shadowColor = 'rgba(132, 252, 253, 0.6)';
                this.ctx.fillStyle = 'rgba(132, 252, 253, 0.8)';
            } else {
                this.ctx.shadowBlur = 0;
                this.ctx.fillStyle = 'rgba(132, 252, 253, 0.5)';
            }

            this.ctx.fillText(text, i * this.fontSize, this.drops[i] * this.fontSize);
            this.ctx.shadowBlur = 0;

            if (this.drops[i] * this.fontSize > canvas.height && Math.random() > 0.975) {
                this.drops[i] = 0;
            }

            this.drops[i]++;
        }
    }

    ngOnDestroy() {
        clearInterval(this.animationInterval);
        window.removeEventListener('resize', this.resizeHandler);
    }
}
