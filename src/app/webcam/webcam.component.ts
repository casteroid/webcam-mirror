import { Component, OnInit, AfterViewInit, ViewChild, ChangeDetectionStrategy } from '@angular/core';


@Component({
    selector: 'app-webcam',
    templateUrl: './webcam.component.html',
    styleUrls: ['./webcam.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class WebcamComponent implements OnInit, AfterViewInit {

  @ViewChild('videoElement') videoElement: any;
  video: any;

  ready: boolean;

  cameras: MediaDeviceInfo[];
  selectedCamera: MediaDeviceInfo | undefined;
  error: any | null;

  private browser = navigator as any;

  private STORAGE_KEY = "webcam-mirror_options";

  constructor() {

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

      const { deviceId } = this.loadOptions();

      let selectedCamera;
      if (deviceId) {
        selectedCamera = this.cameras.find(d => d.deviceId === deviceId);
      }

      // Default camera
      if (!selectedCamera && this.cameras.length > 0) {
        selectedCamera = this.cameras[0];
      }

      if (selectedCamera) {
        this.selectCamera(selectedCamera);
      } else {
        throw new Error("No cameras found");
      }

    } catch (err) {
      this.error = err;
      throw err;
    }

  }

  onCameraChange(device: MediaDeviceInfo) {
    this.selectedCamera = device;
    this.selectCamera(device);
    this.saveOptions();
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

    // Stop old stream tracks before switching
    const oldStream: MediaStream = this.video.srcObject;
    if (oldStream) {
      oldStream.getTracks().forEach(track => track.stop());
    }

    const mediaConstraints = {
      video: {
        deviceId: { exact: deviceId },
        width: { ideal: 1920 },
        height: { ideal: 1080 },
        frameRate: { ideal: 60 }
      },
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
      const mediaConstraints = {
        video: {
          width: { ideal: 1920 },
          height: { ideal: 1080 },
          frameRate: { ideal: 30 }
        },
        audio: false
      };
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

  private saveOptions() {
    const deviceId = this.selectedCamera?.deviceId;
    const data = { deviceId };
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));

  }

  private loadOptions(): { deviceId?: string } {
    const data = localStorage.getItem(this.STORAGE_KEY);
    if (!data) {
      return {};
    }
    const { deviceId } = JSON.parse(data);
    return { deviceId };
  }

}
