import { Component, OnInit, inject, AfterViewInit } from '@angular/core';
import { AuthService } from '../auth-service.service';
import { NotificationService } from 'src/app/notification.service';
import { Router } from '@angular/router';
import { Subscription, Observable, from } from 'rxjs';
import { Firestore, collection, addDoc, setDoc, collectionData, collectionGroup, DocumentReference } from '@angular/fire/firestore';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  authService = inject(AuthService)
  notifications = inject(NotificationService)
  router = inject(Router)
  firestore = inject(Firestore)
  
  constructor() { }

  ngOnInit() {
  }

}
