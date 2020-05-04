import { Component, ElementRef, EventEmitter, Input, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';

@Component({
  selector: 'waveform',
  templateUrl: './waveform.component.html',
  styleUrls: ['./waveform.component.scss']
})
export class WaveformComponent implements OnInit {
  @ViewChild('wrapper', {static: true}) wrapper: ElementRef<HTMLDivElement>;
  @ViewChild('overlayCanvas', {static: true}) overlayCanvas: ElementRef<HTMLCanvasElement>;
  @ViewChild('waveformCanvas', {static: true}) waveformCanvas: ElementRef<HTMLCanvasElement>;
  @ViewChild('cursorCanvas', {static: true}) cursorCanvas: ElementRef<HTMLCanvasElement>;

  @Input() audioTime: number;
  @Input() totalTime: number;
  @Input() disabled: boolean = true;
  @Input() waveformElapsedColor: string = '#b0003a';
  @Input() waveformRemainingColor: string = '#ff6090';
  @Input() backgroundColor: string = '#fff';
  @Input() disabledColor: string = '#888888';
  @Output() time: EventEmitter<any> = new EventEmitter();

  width: string = '1190'
  height: string = '150'
  waveformContext: any;
  cursorContext: any;
  overlayContext: any;
  mouseX: number
  mouseY: number;

  ngOnInit() {
    this.width = String(this.wrapper.nativeElement.offsetWidth);
    this.height = String(this.wrapper.nativeElement.offsetHeight);

    this.waveformContext = this.waveformCanvas.nativeElement.getContext('2d');
    this.overlayContext = this.overlayCanvas.nativeElement.getContext('2d');
    this.cursorContext = this.cursorCanvas.nativeElement.getContext('2d');


    this.drawWaveformImage();
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

  updateWaveform(disabledColor?: string) {
    const position = this.cursorCanvas.nativeElement.width * this.audioTime / this.totalTime;
    const width = this.cursorCanvas.nativeElement.width;
    const height = this.cursorCanvas.nativeElement.height;
    this.overlayContext.clearRect(0, 0, width, height);
    this.overlayContext.fillStyle = disabledColor ?? this.waveformElapsedColor
    this.overlayContext.fillRect(0, 0, position, height);
    this.overlayContext.fillStyle = disabledColor ?? this.waveformRemainingColor;
    this.overlayContext.fillRect(position, 0, width, height);
    this.overlayContext.beginPath();
    this.overlayContext.moveTo(position, 0);
    this.overlayContext.lineTo(position, height);
    this.overlayContext.strokeStyle = '#000';
    this.overlayContext.stroke();
  }

  onMouseLeave() {
    this.cursorContext.clearRect(0, 0, this.cursorCanvas.nativeElement.width, this.cursorCanvas.nativeElement.height);
  }

  onMouseClick(event: any) {
    const mouseX = event.clientX - this.getOffset(this.waveformCanvas.nativeElement).left;
    let time = Math.floor(Math.floor(this.totalTime) * mouseX / this.waveformCanvas.nativeElement.width);
    this.time.emit({
      value: time
    })
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

  ngOnChanges(changes: SimpleChanges) {
    if (!this.disabled) {
      this.updateWaveform();
    } else {
      this.updateWaveform(this.disabledColor);
    }
  }

  drawWaveformImage() {
    console.log("fatt");
    this.width = String(this.wrapper.nativeElement.offsetWidth);
    this.height = String(this.wrapper.nativeElement.offsetHeight);
    const image = new Image();
    image.src = "assets/waveforms-tmp/123.png";
    image.onload = () => {
      this.waveformContext.clearRect(0, 0, this.width, this.height);
      this.cursorContext.clearRect(0, 0, this.width, this.height);
      this.overlayContext.clearRect(0, 0, this.width, this.height);
      this.waveformContext.drawImage(image, 0, 0, this.width, this.height);
      this.waveformContext.globalCompositeOperation = "source-out";
      this.waveformContext.fillStyle = this.backgroundColor;
      this.waveformContext.fillRect(0, 0, this.width, this.height);

      this.overlayContext.fillStyle = this.waveformRemainingColor
      this.overlayContext.fillRect(0, 0, this.width, this.height);

    }
  }

}
