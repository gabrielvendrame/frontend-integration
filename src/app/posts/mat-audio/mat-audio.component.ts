import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-mat-audio',
  templateUrl: './mat-audio.component.html',
  styleUrls: ['./mat-audio.component.scss']
})
export class MatAudioComponent implements OnInit {
  @ViewChild('overlayCanvas', {static: true}) overlayCanvas: ElementRef<HTMLCanvasElement>;
  @ViewChild('waveformCanvas', {static: true}) waveformCanvas: ElementRef<HTMLCanvasElement>;
  @ViewChild('cursorCanvas', {static: true}) cursorCanvas: ElementRef<HTMLCanvasElement>;
  @ViewChild('audio', {static: false}) audio: ElementRef<HTMLAudioElement>;

  // Input bg-color
  // Input waveform-color
  // Input width ?
  // Input height ? devono essere proporzionali
  // Input src image and src sound

  cursorContext: any;
  overlayContext: any;
  mouseX: number
  mouseY: number;

  constructor() {
  }

  ngOnInit(): void {
    let waveformContext = this.waveformCanvas.nativeElement.getContext('2d');
    this.overlayContext = this.overlayCanvas.nativeElement.getContext('2d');
    this.cursorContext = this.cursorCanvas.nativeElement.getContext('2d');


    // Add src from input
    const image = new Image();
    image.src = "assets/waveforms-tmp/123.png";
    image.onload = () => {
      waveformContext.drawImage(image, 0, 0, this.waveformCanvas.nativeElement.width, this.waveformCanvas.nativeElement.height);
      waveformContext.globalCompositeOperation = "source-out";
      waveformContext.fillStyle = "#333";
      waveformContext.fillRect(0, 0, this.waveformCanvas.nativeElement.width, this.waveformCanvas.nativeElement.height);

      this.overlayContext.fillStyle = "#fff";
      this.overlayContext.fillRect(0, 0, this.overlayCanvas.nativeElement.width, this.overlayCanvas.nativeElement.height);
    }

  }

  onMouseMove(event: any) {
    const cursorOffset = this.getOffset(this.cursorCanvas.nativeElement);
    const offsetX = cursorOffset.left;
    const offsetY = cursorOffset.top;
    event.preventDefault();
    event.stopPropagation();

    this.mouseX = event.clientX - offsetX;
    this.mouseY = event.clientY - offsetY;

    this.cursorContext.clearRect(0, 0, this.cursorCanvas.nativeElement.width, this.cursorCanvas.nativeElement.height);
    this.cursorContext.beginPath();
    this.cursorContext.moveTo(this.mouseX, 0);
    this.cursorContext.lineTo(this.mouseX, this.cursorCanvas.nativeElement.height);
    this.cursorContext.strokeStyle = '#fff';
    this.cursorContext.stroke();
  }


  // Da migliorare
  moveWaveform(event: any) {
    //Do grafical stuff
    this.overlayContext.clearRect(0, 0, this.cursorCanvas.nativeElement.width, this.cursorCanvas.nativeElement.height);
    this.overlayContext.fillStyle = "#E92559";
    this.overlayContext.fillRect(0, 0, this.mouseX, this.cursorCanvas.nativeElement.height);
    this.overlayContext.fillStyle = "#fff";
    this.overlayContext.fillRect(this.mouseX, 0, this.cursorCanvas.nativeElement.width, this.cursorCanvas.nativeElement.height);
    this.overlayContext.beginPath();
    this.overlayContext.moveTo(this.mouseX, 0);
    this.overlayContext.lineTo(this.mouseX, this.cursorCanvas.nativeElement.height);
    this.overlayContext.strokeStyle = '#000';
    this.overlayContext.stroke();

    this.audio.nativeElement.currentTime = Math.floor((this.audio.nativeElement.duration * this.mouseX) / this.cursorCanvas.nativeElement.width);
  }


  getOffset(element) {
    if (!element.getClientRects().length) {
      return {top: 0, left: 0};
    }

    let rect = element.getBoundingClientRect();
    let win = element.ownerDocument.defaultView;
    return (
      {
        top: rect.top + win.pageYOffset,
        left: rect.left + win.pageXOffset
      });
  }


}
