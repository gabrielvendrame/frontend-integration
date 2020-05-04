import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AudioService } from '../../services/audio.service';
import { StreamState } from '../../interfaces/stream-state';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-mat-audio',
  templateUrl: './mat-audio.component.html',
  styleUrls: ['./mat-audio.component.scss']
})
export class MatAudioComponent {

  currentFile: any = {};
  state: StreamState;
  files: any = [];

  constructor(private audioService: AudioService) {
    this.audioService.getState()
      .subscribe(state => {
        this.state = state;
      });
    this.audioService.getSongs().subscribe(songs => {
      this.files = songs.audios;
    })
  }


  playStream(url) {
    this.audioService.playStream(url)
      .subscribe(events => {
        // listening for fun here
      });
  }

  openFile(file, index) {
    this.currentFile = { index, file };
    this.audioService.stop();
    this.playStream(file.url);
  }

  pause() {
    this.audioService.pause();
  }

  play() {
    this.audioService.play();
  }

  onSliderChangeEnd(change) {
    this.audioService.seekTo(change.value);
  }


}
