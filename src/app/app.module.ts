import { ErrorHandler, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { provideFirebaseApp, getApp, initializeApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getAuth, indexedDBLocalPersistence, initializeAuth, provideAuth } from '@angular/fire/auth';
import { initializeAppCheck, ReCaptchaEnterpriseProvider, provideAppCheck } from '@angular/fire/app-check';
import { getStorage, provideStorage } from '@angular/fire/storage';
import { environment } from '../environments/environment';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { Capacitor } from '@capacitor/core';
import { GlobalErrorHandler } from './shared/services/global-error-handler.service';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule, 
    IonicModule.forRoot(), 
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }, 
    { provide: ErrorHandler, useClass: GlobalErrorHandler },
    provideFirebaseApp(() => initializeApp(environment.firebase)),
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
    provideFirestore(() => getFirestore()),
    // provideFirestore(() => { 
    //   const firestore:Firestore = getFirestore();
    //   connectFirestoreEmulator(firestore,'localhost',8080);
    //   return firestore
    // }), 
    provideStorage(() => getStorage()),
    // provideStorage(() => {
    //   const storage = getStorage();
    //   connectStorageEmulator(storage, 'localhost', 9199);
    //   return storage;
    // }),
    provideCharts(withDefaultRegisterables()),
    provideAppCheck(() => {
      if (!environment.production) {
        (globalThis as typeof globalThis & { FIREBASE_APPCHECK_DEBUG_TOKEN?: boolean }).FIREBASE_APPCHECK_DEBUG_TOKEN = true;
      }
      return initializeAppCheck(getApp(), {
        provider: new ReCaptchaEnterpriseProvider(environment.recaptcha.siteKey),
        isTokenAutoRefreshEnabled: true,
      });
    }),
],
  bootstrap: [AppComponent],
})
export class AppModule {}
