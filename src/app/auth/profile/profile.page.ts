import { Component, OnInit, inject, AfterViewInit, signal } from '@angular/core';
import { AuthService } from '../auth-service.service';
import { NotificationService } from 'src/app/notification.service';
import { Router } from '@angular/router';
import {  Observable } from 'rxjs';
import { Firestore, collection, addDoc, setDoc, doc, collectionData, collectionGroup, DocumentReference, where, query, getDoc, CollectionReference, updateDoc } from '@angular/fire/firestore';

export interface UserProfile {
  id?:string;
  uid?: string;
  displayName?: string;
  email?: string;
  businessName?: string;
  businessAddress1?: string;
  businessAddress2?: string;
  businessCity?: string;
  businessState?: string;
  businessZip?: string;
  businessPhone?: string;
  tier?: string;
}

const statesJson = [
  {
    "name": "Alabama",
    "code": "AL"
  },
  {
    "name": "Alaska",
    "code": "AK"
  },
  {
    "name": "Arizona",
    "code": "AZ"
  },
  {
    "name": "Arkansas",
    "code": "AR"
  },
  {
    "name": "California",
    "code": "CA"
  },
  {
    "name": "Colorado",
    "code": "CO"
  },
  {
    "name": "Connecticut",
    "code": "CT"
  },
  {
    "name": "Delaware",
    "code": "DE"
  },
  {
    "name": "Florida",
    "code": "FL"
  },
  {
    "name": "Georgia",
    "code": "GA"
  },
  {
    "name": "Hawaii",
    "code": "HI"
  },
  {
    "name": "Idaho",
    "code": "ID"
  },
  {
    "name": "Illinois",
    "code": "IL"
  },
  {
    "name": "Indiana",
    "code": "IN"
  },
  {
    "name": "Iowa",
    "code": "IA"
  },
  {
    "name": "Kansas",
    "code": "KS"
  },
  {
    "name": "Kentucky",
    "code": "KY"
  },
  {
    "name": "Louisiana",
    "code": "LA"
  },
  {
    "name": "Maine",
    "code": "ME"
  },
  {
    "name": "Maryland",
    "code": "MD"
  },
  {
    "name": "Massachusetts",
    "code": "MA"
  },
  {
    "name": "Michigan",
    "code": "MI"
  },
  {
    "name": "Minnesota",
    "code": "MN"
  },
  {
    "name": "Mississippi",
    "code": "MS"
  },
  {
    "name": "Missouri",
    "code": "MO"
  },
  {
    "name": "Montana",
    "code": "MT"
  },
  {
    "name": "Nebraska",
    "code": "NE"
  },
  {
    "name": "Nevada",
    "code": "NV"
  },
  {
    "name": "New Hampshire",
    "code": "NH"
  },
  {
    "name": "New Jersey",
    "code": "NJ"
  },
  {
    "name": "New Mexico",
    "code": "NM"
  },
  {
    "name": "New York",
    "code": "NY"
  },
  {
    "name": "North Carolina",
    "code": "NC"
  },
  {
    "name": "North Dakota",
    "code": "ND"
  },
  {
    "name": "Ohio",
    "code": "OH"
  },
  {
    "name": "Oklahoma",
    "code": "OK"
  },
  {
    "name": "Oregon",
    "code": "OR"
  },
  {
    "name": "Pennsylvania",
    "code": "PA"
  },
  {
    "name": "Rhode Island",
    "code": "RI"
  },
  {
    "name": "South Carolina",
    "code": "SC"
  },
  {
    "name": "South Dakota",
    "code": "SD"
  },
  {
    "name": "Tennessee",
    "code": "TN"
  },
  {
    "name": "Texas",
    "code": "TX"
  },
  {
    "name": "Utah",
    "code": "UT"
  },
  {
    "name": "Vermont",
    "code": "VT"
  },
  {
    "name": "Virginia",
    "code": "VA"
  },
  {
    "name": "Washington",
    "code": "WA"
  },
  {
    "name": "West Virginia",
    "code": "WV"
  },
  {
    "name": "Wisconsin",
    "code": "WI"
  },
  {
    "name": "Wyoming",
    "code": "WY"
  }
]

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
  usersCollection = collection(this.firestore, 'users');
  users$!: Observable<UserProfile[]>;
  userProfileSignal = signal<UserProfile>({});
  user!:UserProfile;
  states = statesJson;

  constructor() { }

  ngOnInit() {
    console.log('user profile')
  }

  ngAfterViewInit() {
    this.getUser().subscribe((data:UserProfile[]) => {
      this.userProfileSignal.set(data[0]);
      this.user = {...data[0]};
      const docRef = doc(this.firestore, 'users', this.user.id!)
      const docSnap = getDoc(docRef).then(data => {
        //console.log('data', data.data())
      });
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

}
