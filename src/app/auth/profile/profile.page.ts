import { Component, OnInit, inject, AfterViewInit, signal } from '@angular/core';
import { AuthService } from '../auth-service.service';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Firestore, collection, addDoc, setDoc, doc, collectionData, collectionGroup, DocumentReference, where, query, getDoc, CollectionReference, updateDoc } from '@angular/fire/firestore';
import { getDownloadURL, ref, Storage, uploadBytesResumable } from '@angular/fire/storage';
import { UserProfile } from '../shared/interfaces/userProfile.interface';
import { UtilsService, SelectState } from 'src/app/shared/services/utils.service';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit, AfterViewInit {
  authService = inject(AuthService);
  notifications = inject(NotificationService);
  router = inject(Router);
  firestore = inject(Firestore);
  storage = inject(Storage)
  utils = inject(UtilsService)
  usersCollection = collection(this.firestore, 'users');
  users$!: Observable<UserProfile[]>;
  userProfileSignal = signal<UserProfile>({});
  user!:UserProfile;
  states:SelectState[] = this.utils.statesJson;
  

  ngOnInit() {
    console.log('user profile')
  }

  ngAfterViewInit() {
    this.getUser().subscribe((data:UserProfile[]) => {
      this.userProfileSignal.set(data[0]);
      this.user = {...data[0]};
      const docRef = doc(this.firestore, 'users', this.user.id!)
      const docSnap = getDoc(docRef)
    })
  }

  getUser = ():Observable<UserProfile[]> => {
    const q = query(this.usersCollection, where('uid', '==', this.authService.currentUser.uid))
    return collectionData(q, {idField: 'id'})
  }

  update = (userdata:UserProfile) => {
    const docRef = doc(this.firestore, "users", this.user.id!);
    updateDoc(docRef, {...userdata}).then((data) => {
      this.notifications.notify('Profile Updated Successfully')
    })
    .catch((error) =>{
      this.notifications.notify('There was an error updaing the Profile')
    })
  }

  uploadFile = (input: HTMLInputElement) => {
    if (!input.files) return

    const files: FileList = input.files;
    for (let i = 0; i < files.length; i++) {
        const file = files.item(i);
        if (file) {
          const storageRef = ref(this.storage, file.name)
           uploadBytesResumable(storageRef, file)
           .then((data)=>{
            getDownloadURL(ref(this.storage,data.metadata.name))
            .then((url) =>{
              this.user.photoURL = url;
              this.update(this.user)
            })
           });
        }
    }
  }

  uploadCompanyLogo = (input: HTMLInputElement) => {
    if (!input.files) return

    const files: FileList = input.files;
    for (let i = 0; i < files.length; i++) {
        const file = files.item(i);
        if (file) {
          const storageRef = ref(this.storage, file.name)
           uploadBytesResumable(storageRef, file)
           .then((data)=>{
            getDownloadURL(ref(this.storage,data.metadata.name))
            .then((url) =>{
              this.user.companyLogoUrl = url;
              this.update(this.user)
            })
           });
        }
    }
  }

}
