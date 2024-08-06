import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AngularFireModule } from '@angular/fire/compat';
import { provideFirebaseApp, getApp, initializeApp } from '@angular/fire/app';
import { connectFirestoreEmulator, getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getAuth, indexedDBLocalPersistence, initializeAuth, provideAuth } from '@angular/fire/auth';
import { getAnalytics, provideAnalytics, ScreenTrackingService, UserTrackingService } from '@angular/fire/analytics';
import { initializeAppCheck, ReCaptchaEnterpriseProvider, provideAppCheck } from '@angular/fire/app-check';
import { getDatabase, provideDatabase } from '@angular/fire/database';
import { getFunctions, provideFunctions } from '@angular/fire/functions';
import { getMessaging, provideMessaging } from '@angular/fire/messaging';
import { getPerformance, providePerformance } from '@angular/fire/performance';
import { connectStorageEmulator, getStorage, provideStorage } from '@angular/fire/storage';
import { AuthModule } from '@angular/fire/auth';
import { environment } from '../environments/environment';
import { LoginPageModule } from './auth/login/login.module';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { FieldPath, Firestore } from 'firebase/firestore';
import { Capacitor } from '@capacitor/core';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule, 
    IonicModule.forRoot(), 
    AppRoutingModule,
    AuthModule,
    LoginPageModule,
    HttpClientModule
  ],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }, 
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    //provideAuth(() => getAuth()), 
    provideAuth(() => { 
      if(Capacitor.isNativePlatform()) { 
        return  initializeAuth(getApp(), {
          persistence: indexedDBLocalPersistence
        }
      )
      } else { 
        return getAuth()
      }
    }),
    provideAnalytics(() => getAnalytics()), 
    provideFirestore(() => getFirestore()),
    // provideFirestore(() => { 
    //   const firestore:Firestore = getFirestore();
    //   connectFirestoreEmulator(firestore,'localhost',8080);
    //   return firestore
    // }), 
    provideDatabase(() => getDatabase()), 
    provideFunctions(() => getFunctions()), 
    provideMessaging(() => getMessaging()), 
    providePerformance(() => getPerformance()), 
    provideStorage(() => getStorage()),
    // provideStorage(() => {
    //   const storage = getStorage();
    //   connectStorageEmulator(storage, 'localhost', 9199);
    //   return storage;
    // }),
    ScreenTrackingService, 
    UserTrackingService, 
    provideCharts(withDefaultRegisterables()),
    // provideAppCheck(() => {
    //   // TODO get a reCAPTCHA Enterprise here https://console.cloud.google.com/security/recaptcha?project=_
    //   const provider = new ReCaptchaEnterpriseProvider('6LeVVeIpAAAAAJqkSoJ-lA7LM_zfLuDtNAFbiJ1R');
    //   return initializeAppCheck(undefined, { provider, isTokenAutoRefreshEnabled: true });
    // }), 
],
  bootstrap: [AppComponent],
})
export class AppModule {}

// async () => {
//   if (Capacitor.isNativePlatform()) {
//     return initializeAuth(getApp(), {
//       persistence: indexedDBLocalPersistence,
//     });
//   } else {
//     return getAuth();
//   }