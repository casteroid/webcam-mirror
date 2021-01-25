import { Component, OnInit, ViewChild } from '@angular/core';


@Component({
  selector: 'app-webcam',
  templateUrl: './webcam.component.html',
  styleUrls: ['./webcam.component.scss']
})
export class WebcamComponent implements OnInit {

  @ViewChild('videoElement') videoElement: any;
  video: any;

  controls: any = {
    swapped: true
  };

  constructor() { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.video = this.videoElement.nativeElement;
    this.start();
  }

  start() {
    this.initCamera({ video: true, audio: false });
  }
  sound() {
    this.initCamera({ video: true, audio: true });
  }

  async initCamera(config: any) {
    var browser = <any>navigator;

    browser.getUserMedia = (browser.getUserMedia ||
      browser.webkitGetUserMedia ||
      browser.mozGetUserMedia ||
      browser.msGetUserMedia);

    const stream: MediaStream = await browser.mediaDevices.getUserMedia(config);

    this.video.srcObject = stream;
    this.video.play();
  }

}
