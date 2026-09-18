import { Injectable, signal } from '@angular/core';
import { Network } from '@capacitor/network';

@Injectable({ providedIn: 'root' })
export class ConnectivityService {
  readonly online = signal(true);

  constructor() {
    Network.getStatus().then(status => this.online.set(status.connected)).catch(() => this.online.set(navigator.onLine));
    Network.addListener('networkStatusChange', status => this.online.set(status.connected)).catch(() => undefined);
  }
}
