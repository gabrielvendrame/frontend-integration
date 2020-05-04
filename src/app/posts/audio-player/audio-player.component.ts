import { Component } from '@angular/core';
import { AudioService } from '../../services/audio.service';
import { StreamState } from '../../interfaces/stream-state';

@Component({
  selector: 'app-audio-player',
  templateUrl: './audio-player.component.html',
  styleUrls: ['./audio-player.component.scss']
})
export class AudioPlayerComponent {

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
    this.currentFile = {index, file};
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
