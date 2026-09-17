import { Injectable, signal, inject } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private toastController = inject(ToastController)
  private message = signal<string | null>(null)

  async notify (message:string) {
    this.message.set(message)
    const toast = await this.toastController.create({
      message,
      duration: 4000,
      position: 'bottom',
    });
    await toast.present();
  }

}
