import { Component, ElementRef, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { gsap } from 'gsap';

@Component({
  selector: 'app-bunny',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './bunny.html',
  styleUrls: ['./bunny.css']
})
export class BunnyComponent implements AfterViewInit, OnDestroy {
  @ViewChild('bunnyContainer') container!: ElementRef<HTMLDivElement>;
  @ViewChild('body') body!: ElementRef<SVGEllipseElement>;
  @ViewChild('headGroup') headGroup!: ElementRef<SVGGElement>;
  @ViewChild('earLeft') earLeft!: ElementRef<SVGGElement>;
  @ViewChild('earRight') earRight!: ElementRef<SVGGElement>;
  // Nuevas referencias para los ojos
  @ViewChild('eyeLeft') eyeLeft!: ElementRef<SVGEllipseElement>;
  @ViewChild('eyeRight') eyeRight!: ElementRef<SVGEllipseElement>;
  @ViewChild('nose') nose!: ElementRef<SVGGElement>;
  @ViewChild('tail') tail!: ElementRef<SVGCircleElement>;

  private currentX = 100;
  private currentY = 0;
  private mainLoopId: any;
  private blinkLoopId: any;
  private twitchLoopId: any;

  ngAfterViewInit() {
    this.currentY = window.innerHeight - 150;
    gsap.set(this.container.nativeElement, { x: this.currentX, y: this.currentY, opacity: 1 });
    
    this.startBreathing();
    this.randomBlink();
    this.randomEarTwitch();
    this.lifeCycle();
  }

  ngOnDestroy() {
    clearTimeout(this.mainLoopId);
    clearTimeout(this.blinkLoopId);
    clearTimeout(this.twitchLoopId);
    gsap.killTweensOf("*"); 
  }

  // --- PROCESOS BIOLÓGICOS ---

  startBreathing() {
    gsap.to(this.body.nativeElement, {
      scaleY: 1.05, scaleX: 0.98,
      transformOrigin: "center center",
      duration: 1.2, yoyo: true, repeat: -1, ease: "sine.inOut"
    });
  }

  randomBlink() {
    // MAGIA: Animamos el atributo SVG nativo. Cero bugs visuales.
    gsap.to([this.eyeLeft.nativeElement, this.eyeRight.nativeElement], {
      attr: { ry: 0.5 }, // Aplasta el elipse hasta casi 0
      duration: 0.1,
      yoyo: true,
      repeat: 1,
      onComplete: () => {
        this.blinkLoopId = setTimeout(() => this.randomBlink(), Math.random() * 4000 + 2000);
      }
    });
  }

  randomEarTwitch() {
    const earToTwitch = Math.random() > 0.5 ? this.earLeft : this.earRight;
    gsap.to(earToTwitch.nativeElement, {
      rotation: (Math.random() * 20) - 10,
      duration: 0.15, yoyo: true, repeat: 3, ease: "power1.inOut",
      onComplete: () => {
        this.twitchLoopId = setTimeout(() => this.randomEarTwitch(), Math.random() * 5000 + 3000);
      }
    });
  }

  // --- CEREBRO DE COMPORTAMIENTO ---

  lifeCycle = () => {
    const r = Math.random();
    if (r < 0.2) this.groom();       
    else if (r < 0.4) this.lookAround(); 
    else if (r < 0.7) this.realisticHop(); 
    else this.eat(); // Cambiamos sniffGround por la nueva animación de comer
  }

  groom() {
    const tl = gsap.timeline({ onComplete: () => this.nextAction(1000) });
    tl.to(this.headGroup.nativeElement, { rotation: 15, duration: 0.3 })
      .to(this.headGroup.nativeElement, { y: 3, rotation: 20, duration: 0.15, yoyo: true, repeat: 5 })
      .to(this.headGroup.nativeElement, { y: 0, rotation: 0, duration: 0.4 });
  }

  lookAround() {
    const tl = gsap.timeline({ onComplete: () => this.nextAction(500) });
    tl.to(this.headGroup.nativeElement, { rotation: -20, duration: 0.5, ease: "power2.inOut" })
      .to(this.headGroup.nativeElement, { rotation: -20, duration: 1 }) 
      .to(this.headGroup.nativeElement, { rotation: 10, duration: 0.5, ease: "power2.inOut" })
      .to(this.headGroup.nativeElement, { rotation: 0, duration: 0.4 });
  }

  // NUEVA ANIMACIÓN: Comer realista
  eat() {
    const tl = gsap.timeline({ onComplete: () => this.nextAction(1000) });

    // 1. Baja la cabeza al suelo y relaja las orejas hacia adelante (pose muy tierna)
    tl.to(this.headGroup.nativeElement, { rotation: 35, y: 12, duration: 0.4 })
      .to(this.earLeft.nativeElement, { rotation: -30, duration: 0.4 }, "<")
      .to(this.earRight.nativeElement, { rotation: -10, duration: 0.4 }, "<")

    // 2. Ciclo de masticar: movimiento rápido de mandíbula/nariz y cabezazos suaves
      .to(this.nose.nativeElement, { y: -2, duration: 0.08, yoyo: true, repeat: 15 }, ">")
      .to(this.headGroup.nativeElement, { rotation: 32, duration: 0.16, yoyo: true, repeat: 7 }, "<")
      .to(this.body.nativeElement, { scaleX: 1.02, scaleY: 0.98, duration: 0.16, yoyo: true, repeat: 7 }, "<")

    // 3. Vuelve a su postura alerta normal
      .to(this.headGroup.nativeElement, { rotation: 0, y: 0, duration: 0.4 })
      .to(this.earLeft.nativeElement, { rotation: 0, duration: 0.4 }, "<")
      .to(this.earRight.nativeElement, { rotation: 0, duration: 0.4 }, "<");
  }

  realisticHop() {
    const targetX = Math.max(50, Math.min(window.innerWidth - 150, this.currentX + (Math.random() * 400 - 200)));
    const direction = targetX > this.currentX ? 1 : -1;
    
    gsap.to(this.container.nativeElement, { scaleX: direction, duration: 0.2 });

    const tl = gsap.timeline({ onComplete: () => {
      this.currentX = targetX;
      this.nextAction(1000);
    }});

    // Anticipación
    tl.to(this.body.nativeElement, { scaleY: 0.8, scaleX: 1.1, y: 10, duration: 0.2 })
      .to(this.headGroup.nativeElement, { y: 10, rotation: 15, duration: 0.2 }, "<");

    // Vuelo
    tl.to(this.container.nativeElement, { x: targetX, duration: 0.5, ease: "power1.inOut" }, ">")
      .to(this.container.nativeElement, { y: this.currentY - 60, duration: 0.25, yoyo: true, repeat: 1, ease: "sine.out" }, "<")
      .to(this.body.nativeElement, { scaleY: 1.2, scaleX: 0.9, y: -10, duration: 0.25 }, "<") 
      .to(this.headGroup.nativeElement, { y: -10, rotation: -10, duration: 0.25 }, "<")
      .to(this.tail.nativeElement, { y: 5, duration: 0.25 }, "<"); 

    // Aterrizaje
    tl.to(this.body.nativeElement, { scaleY: 0.85, scaleX: 1.1, y: 5, duration: 0.15 })
      .to(this.headGroup.nativeElement, { y: 5, rotation: 10, duration: 0.15 }, "<")
      .to(this.tail.nativeElement, { y: -2, duration: 0.15 }, "<")
      // Vuelve a pose
      .to(this.body.nativeElement, { scaleY: 1, scaleX: 1, y: 0, duration: 0.2 })
      .to(this.headGroup.nativeElement, { y: 0, rotation: 0, duration: 0.2 }, "<")
      .to(this.tail.nativeElement, { y: 0, duration: 0.2 }, "<");
  }

  nextAction(baseDelay: number) {
    this.mainLoopId = setTimeout(this.lifeCycle, baseDelay + Math.random() * 1500);
  }
}