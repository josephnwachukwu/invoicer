import { Component, OnInit, inject, AfterViewInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators} from '@angular/forms';
import { Firestore } from '@angular/fire/firestore';
import { ClientService } from '../shared/services/client.service';
import { NotificationService } from '../shared/services/notification.service';
import { Client } from '../client.interface';
import { AuthService } from '../auth/auth-service.service';
import { IonModal } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { UtilsService, SelectState } from '../shared/services/utils.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-clients',
  templateUrl: './clients.page.html',
  styleUrls: ['./clients.page.scss'],
})
export class ClientsPage implements OnInit, AfterViewInit {
  @ViewChild(IonModal) modal!: IonModal;
  firestore = inject(Firestore)
  formBuilder = inject(FormBuilder)
  clientService = inject(ClientService)
  notifications = inject(NotificationService)
  authService = inject(AuthService)
  alertController = inject(AlertController)
  utils = inject(UtilsService)
  states:SelectState[] = this.utils.statesJson;
  clientsList = Observable<Client[]>

  clientForm = this.formBuilder.group({
    name: ['', Validators.required],
    address1: ['', Validators.required],
    address2: [''],
    city: ['', Validators.required],
    state: ['', Validators.required],
    zipcode: ['', Validators.required],
    phoneNumber: [''],
    contactName: ['Accounts Payable', Validators.required],
  })
  client:Client = {}
  alertButtons = () => [
    {
      text: 'Cancel',
      role: 'cancel',
      handler: () => {
        console.log('Alert canceled');
      },
    },
    {
      text: 'OK',
      role: 'confirm',
      handler: (data:any) => {
        this.deleteClient(data.id)
      },
    },
  ];
  alertInputs = (client:string) => [
    {
      value: client,
      name: 'id',
      cssClass: 'invisible',
      disabled: true
    }
  ]

  async presentAlert(client:string) {
    const alert = await this.alertController.create({
      header: 'Are you sure?',
      message: 'Deleting a client is permanent and cannot be reversed',
      buttons: this.alertButtons(),
      inputs: this.alertInputs(client)
    });

    await alert.present();
  }

  ngOnInit() {
    console.log('Clients')
  }

  ngAfterViewInit() {
   this.clientService.getClients()
  }

  addClient = (client:any) => {
    this.clientService.add({ ...client, uid:  this.authService.currentUserSignal()!.uid}).subscribe({
      next: (data) => {
        this.notifications.notify('Client added sucessfully!')
        this.modal.dismiss(null, 'cancel');
      },
      error: (error) => {
        this.notifications.notify(error.code)
      }
    })
  }

  deleteClient = (id:string) => {
    this.clientService.delete(id).subscribe({
      next: () => this.notifications.notify('Client deleted sucessfully'),
      error: (error) => this.notifications.notify(error.code)
    })
  }

  updateClient = (client:Client) => {
    this.clientService.update(client).subscribe({
      next: () => this.notifications.notify('Client Updated Sucesfully'),
      error: (error) => this.notifications.notify(error.code)
    })
  }

  cancel = () => {
    this.modal.dismiss(null, 'cancel');
  }

  onWillDismiss = (event:any) => {

  }
}
