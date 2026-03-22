import { Component, HostListener, OnInit, AfterViewInit, ElementRef, ViewChildren, QueryList } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BunnyComponent } from './bunny/bunny';
import { gsap } from 'gsap';

interface PhysicalPetal {
  x: number;       // Posición horizontal (%)
  y: number;       // Posición vertical (px)
  speed: number;
  drift: number;
  scale: number;
  rotation: number;
  rotationSpeed: number;
  velX: number;
  velY: number;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, BunnyComponent],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class AppComponent implements OnInit, AfterViewInit {
  @ViewChildren('petalEl') petalElements!: QueryList<ElementRef<HTMLDivElement>>;

  bouquetX = 0; bouquetY = 0;
  floatingMessages: { id: number, x: number, y: number }[] = [];
  messageId = 0;

  private mouseX = -1000; private mouseY = -1000;
  private repulsionRadius = 120; 
  private friction = 0.95;
  physicalPetals: PhysicalPetal[] = [];

  ngOnInit() {
    this.initializePetals();
  }

  ngAfterViewInit() {
    gsap.ticker.add(() => this.updatePhysics());
  }

  private initializePetals() {
    this.physicalPetals = Array.from({ length: 35 }).map(() => ({
      x: Math.random() * 100, // Dispersión total de 0 a 100%
      y: Math.random() * -window.innerHeight,
      speed: Math.random() * 2 + 1,
      drift: (Math.random() - 0.5) * 0.2,
      scale: Math.random() * 0.5 + 0.5,
      rotation: Math.random() * 360,
      rotationSpeed: Math.random() * 2 - 1,
      velX: 0, velY: 0
    }));
  }

  private updatePhysics() {
    if (!this.petalElements) return;
    const petalsDOM = this.petalElements.toArray();

    this.physicalPetals.forEach((p, i) => {
      const px = (p.x / 100) * window.innerWidth;
      const py = p.y;

      const dx = px - this.mouseX;
      const dy = py - this.mouseY;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < this.repulsionRadius) {
        const angle = Math.atan2(dy, dx);
        const force = (this.repulsionRadius - dist) / this.repulsionRadius;
        p.velX += Math.cos(angle) * force * 8;
        p.velY += Math.sin(angle) * force * 8;
      }

      p.velX *= this.friction;
      p.velY *= this.friction;

      p.x += (p.drift + (p.velX / window.innerWidth * 100));
      p.y += p.speed + p.velY;
      p.rotation += p.rotationSpeed;

      if (p.y > window.innerHeight + 20) {
        p.y = -20;
        p.x = Math.random() * 100;
        p.velX = 0; p.velY = 0;
      }

      if (petalsDOM[i]) {
        gsap.set(petalsDOM[i].nativeElement, {
          left: p.x + '%',
          y: p.y,
          rotation: p.rotation,
          scale: p.scale
        });
      }
    });
  }

  @HostListener('mousemove', ['$event'])
  onMouseMove(e: MouseEvent) {
    this.mouseX = e.clientX;
    this.mouseY = e.clientY;
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    this.bouquetX = (e.clientX - centerX) * 0.04;
    this.bouquetY = (e.clientY - centerY) * 0.04;
  }

  showLoveMessage(e: MouseEvent) {
    const id = this.messageId++;
    this.floatingMessages.push({ id, x: e.clientX, y: e.clientY });
    setTimeout(() => this.floatingMessages = this.floatingMessages.filter(m => m.id !== id), 2000);
  }
}