import { Component, DestroyRef, ElementRef, ViewChild, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AlertController } from '@ionic/angular';
import { getDownloadURL, ref, Storage, uploadBytes } from '@angular/fire/storage';
import { AuthService } from '../auth-service.service';
import { NotificationService } from '../../shared/services/notification.service';
import { UserProfile } from '../shared/interfaces/userProfile.interface';
import { UtilsService, SelectState } from '../../shared/services/utils.service';

@Component({
  selector: 'app-profile',
  standalone: false,
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage {
  @ViewChild('upload') uploadBtn!: ElementRef<HTMLInputElement>;
  readonly authService = inject(AuthService);
  readonly states: SelectState[] = inject(UtilsService).statesJson;
  private readonly notifications = inject(NotificationService);
  private readonly storage = inject(Storage);
  private readonly alerts = inject(AlertController);
  private readonly destroyRef = inject(DestroyRef);
  user?: UserProfile;

  ionViewWillEnter(): void {
    this.authService.profile$().pipe(takeUntilDestroyed(this.destroyRef)).subscribe(profile => this.user = profile);
  }

  update(userdata: UserProfile): void {
    this.authService.updateUserProfile(userdata).subscribe({
      next: () => this.notifications.notify('Profile updated successfully.'),
      error: () => this.notifications.notify('We could not update your profile.'),
    });
  }

  uploadFile(input: HTMLInputElement): void { void this.uploadImage(input, 'avatar'); }
  uploadCompanyLogo(input: HTMLInputElement): void { void this.uploadImage(input, 'logo'); }

  selectPicture(): void { this.uploadBtn.nativeElement.click(); }

  async confirmAccountDeletion(): Promise<void> {
    const alert = await this.alerts.create({
      header: 'Delete account?',
      message: 'This permanently deletes your account and associated Invoicer data. This cannot be undone.',
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        { text: 'Delete permanently', role: 'destructive', handler: () => this.deleteAccount() },
      ],
    });
    await alert.present();
  }

  private deleteAccount(): void {
    this.authService.deleteAccount().subscribe({
      next: () => this.notifications.notify('Your account has been deleted.'),
      error: error => this.notifications.notify(error?.error?.error || 'Account deletion failed. Please sign in again and retry.'),
    });
  }

  private async uploadImage(input: HTMLInputElement, kind: 'avatar' | 'logo'): Promise<void> {
    const file = input.files?.[0];
    const uid = this.authService.currentUser?.uid;
    if (!file || !uid || !this.user) return;
    if (!['image/png', 'image/jpeg', 'image/webp'].includes(file.type)) {
      await this.notifications.notify('Choose a PNG, JPG, or WebP image.');
      return;
    }
    if (file.size > 1024 * 1024) {
      await this.notifications.notify('Images must be smaller than 1 MB.');
      return;
    }
    if (kind === 'logo' && !this.authService.isPremiumMember) {
      await this.notifications.notify('Company logos are available on the premium plan.');
      return;
    }
    try {
      const extension = file.type === 'image/png' ? 'png' : file.type === 'image/webp' ? 'webp' : 'jpg';
      const storageRef = ref(this.storage, `branding/${uid}/${kind}.${extension}`);
      await uploadBytes(storageRef, file, { contentType: file.type });
      const url = await getDownloadURL(storageRef);
      if (kind === 'logo') this.user.companyLogoUrl = url;
      else this.user.photoURL = url;
      this.update(this.user);
    } catch {
      await this.notifications.notify('Image upload failed. Please try again.');
    } finally {
      input.value = '';
    }
  }
}
