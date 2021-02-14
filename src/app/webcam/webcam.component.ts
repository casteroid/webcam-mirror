import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { from } from 'rxjs';


@Component({
  selector: 'app-webcam',
  templateUrl: './webcam.component.html',
  styleUrls: ['./webcam.component.scss']
})
export class WebcamComponent implements OnInit {

  @ViewChild('videoElement') videoElement: any;
  video: any;

  swapped: boolean;
  lightsOn: boolean;
  ready: boolean;

  cameras: MediaDeviceInfo[];
  selectedCamera: MediaDeviceInfo | undefined;
  error: string | null;

  private browser = <any>navigator;

  constructor() {

    this.swapped = true;
    this.lightsOn = true;
    this.ready = false;

    this.cameras = [];
    this.error = null;

    this.start();
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.video = this.videoElement?.nativeElement;
  }

  private async start() {

    try {
      this.cameras = await this.getCameras();    
      if (this.cameras.length > 0) {
        this.selectCamera(this.cameras[0]);
      }
    } catch (err) {
      this.error = err;
      throw err;
    }

  }

  onCameraChange() {
    this.selectCamera(this.selectedCamera);
  }

  private async selectCamera(deviceInfo?: MediaDeviceInfo) {

    if (!deviceInfo) {
      return;
    }

    this.selectedCamera = deviceInfo;
    this.initCamera(this.selectedCamera.deviceId);
  }

  private async initCamera(deviceId: string) {

    this.video = this.videoElement?.nativeElement;
    if (!this.video) {
      return;
    }

    const mediaConstraints = {
      video: { deviceId },
      audio: false
    };

    const stream: MediaStream = await this.browser.mediaDevices.getUserMedia(mediaConstraints);
    this.video.srcObject = stream;
    this.video.play();

    this.ready = true;
  }

  private async getCameras() {

    try {

      // Need to request stream to initialize permissions
      const mediaConstraints = { video: true, audio: false };
      const stream = await this.browser.mediaDevices.getUserMedia(mediaConstraints);
      console.log("stream", stream);

      const mediaDevices: MediaDeviceInfo[] = await this.browser.mediaDevices.enumerateDevices();
      const videoInputDevices = mediaDevices.filter(d => d.kind === "videoinput");

      return videoInputDevices;
    } catch (err) {
      this.error = err;
      throw err;
    }
  }

}
