import { Component, OnInit, ViewChild, NgZone } from '@angular/core';
import { ActionSheetController, IonSearchbar } from '@ionic/angular';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { AngularFireUploadTask, AngularFireStorageReference } from 'angularfire2/storage';
import { Observable } from 'rxjs';
import * as firebase from 'firebase';
import { ApisService } from 'src/app/services/apis.service';
import { UtilService } from 'src/app/services/util.service';
import { NavController } from '@ionic/angular';
import { Router } from '@angular/router';
import * as moment from 'moment';


@Component({
  selector: 'app-venue-profile',
  templateUrl: './venue-profile.page.html',
  styleUrls: ['./venue-profile.page.scss'],
})
export class VenueProfilePage implements OnInit {
  @ViewChild('searchbar', { read: IonSearchbar, static: true }) searchbar: IonSearchbar;

  task: AngularFireUploadTask;
  ref: AngularFireStorageReference;
  uploadState: Observable<string>;
  downloadURL: Observable<string>;
  uploadProgress: Observable<number>;
  image: any = '';
  db = firebase.firestore();
  coverImage: any;
  image1: any;
  image2: any;
  image3: any;
  image4: any;
  image5: any;
  image6: any;
  name: any = '';
  address: any = '';
  descritions: any = '';
  haveData: boolean = false;
  dishPrice: any = '';
  time: any = '';
  latitude: any;
  longitude: any;
  cusine: any;
  phone: any = '';
  email;
  openTime;
  closeTime;
  status: any = '';
  constructor(
    private actionSheetController: ActionSheetController,
    private camera: Camera,
    private util: UtilService,
    private api: ApisService,
    private navCtrl: NavController,
    private router: Router
  ) {

  }
  ngOnInit() {

  }

  updateSearch() {
  }

  createVenue() {
    this.openTime = moment(this.openTime).format('HH:mm');
    this.closeTime = moment(this.closeTime).format('HH:mm');
    const param = {
      uid: localStorage.getItem('uid'),
      name: this.name,
      address: this.address,
      descritions: this.descritions,
      lat: this.latitude,
      lng: this.longitude,
      cover: this.coverImage,
      dishPrice: this.dishPrice,
      time: this.time,
      ratting: 0,
      cusine: this.cusine,
      totalRatting: 0,
      openTime: this.openTime,
      isClose: false,
      closeTime: this.closeTime,
      images: [
        this.image1 ? this.image1 : '',
        this.image2 ? this.image2 : '',
        this.image3 ? this.image3 : '',
        this.image4 ? this.image4 : '',
        this.image5 ? this.image5 : '',
        this.image6 ? this.image6 : ''
      ],
    };
    console.log('param', param);
    this.util.show();
    this.api.createVenue(param).then((data) => {
      this.util.hide();
      console.log(data);
      this.util.showToast(this.util.translate('Restaurant updated successfully'), 'success', 'bottom');
      this.util.publishProfile('update');
      this.navCtrl.back();
    }, error => {
      this.util.hide();
      console.log(error);
      this.util.errorToast(error);
    }).catch(error => {
      this.util.hide();
      console.log(error);
      this.util.errorToast(error);
    });
  }
  updateVenue() {
    //alert(this.openTime)
    //this.openTime = moment(this.openTime).format('HH:mm');
    //alert(this.openTime)
    //this.closeTime = moment(this.closeTime).format('HH:mm');
    if (this.openTime === 'Invalid date') {
      this.openTime = '10:00';
    }
    if (this.closeTime === 'Invalid date') {
      this.closeTime = '22:00';
    }
    const param = {
      uid: localStorage.getItem('uid'),
      name: this.name,
      address: this.address,
      descritions: this.descritions,
      lat: this.latitude,
      lng: this.longitude,
      cover: this.coverImage,
      dishPrice: this.dishPrice,
      time: this.time,
      cusine: this.cusine,
      openTime: this.openTime,
      closeTime: this.closeTime,
      isClose: false,
      images: [
        this.image1 ? this.image1 : '',
        this.image2 ? this.image2 : '',
        this.image3 ? this.image3 : '',
        this.image4 ? this.image4 : '',
        this.image5 ? this.image5 : '',
        this.image6 ? this.image6 : ''
      ],
    };
    console.log('param', param);
    this.util.show();
    this.api.updateVenue(param).then((data) => {
      this.util.hide();
      console.log(data);
      this.util.showToast(this.util.translate('Restaurant updated successfully'), 'success', 'bottom');
      this.util.publishProfile('update');
      this.navCtrl.back();
    }, error => {
      this.util.hide();
      console.log(error);
      this.util.errorToast(error);
    }).catch(error => {
      this.util.hide();
      console.log(error);
      this.util.errorToast(error);
    });
  }

  submit() {
    console.log('cusine', this.cusine);
    if (this.name === '' || this.address === '' || this.descritions === '' || this.dishPrice === '' || this.time === '' ||
      !this.cusine || !this.cusine.length || this.openTime === '' || this.closeTime === '' || !this.openTime ||
      !this.closeTime || this.phone === '' || !this.phone) {
      this.util.errorToast(this.util.translate('All Fields are required'));
      return false;
    }
    if (!this.coverImage || this.coverImage === '') {
      this.util.errorToast(this.util.translate('Please add your cover image'));
      return false;
    }
    if (this.haveData) {
      console.log('update');
      this.updateVenue();
    } else {
      console.log('create');
      this.createVenue();
    }

  }

  async cover() {
    const actionSheet = await this.actionSheetController.create({
      header: this.util.translate('Choose from'),
      buttons: [ {
        text: this.util.translate('Gallery'),
        icon: 'image',
        handler: () => {
          console.log('Share clicked');
          this.openCameraOrGalleryWeb('gallery');
        }
      }, {
        text: this.util.translate('Cancel'),
        icon: 'close',
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
        }
      }]
    });
    await actionSheet.present();
  }

  async others(num) {
    console.log('num', num);
    const actionSheet = await this.actionSheetController.create({
      header: this.util.translate('Choose from'),
      buttons: [ {
        text: this.util.translate('Gallery'),
        icon: 'image',
        handler: () => {
          console.log('Share clicked');
          this.openCameraOrGalleryWeb('gallery', num);
        }
      }, {
        text: this.util.translate('Cancel'),
        icon: 'close',
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
        }
      }]
    });
    await actionSheet.present();
  }


  ionViewWillEnter() {
    console.log('newAddressnewAddressnewAddress', localStorage.getItem('newAddress'));
    this.util.show();
    this.api.getVenueDetails(localStorage.getItem('uid')).then(data => {
      this.util.hide();
      console.log(data);
      if (data) {
        this.haveData = true;
        this.name = data.name;
        this.address = data.address;
        this.coverImage = data.cover;
        this.descritions = data.descritions;
        this.image1 = data.images[0];
        this.image2 = data.images[1];
        this.image3 = data.images[2];
        this.image4 = data.images[3];
        this.image5 = data.images[4];
        this.image6 = data.images[5];
        this.latitude = data.lat;
        this.longitude = data.lng;
        this.time = data.time;
        this.dishPrice = data.dishPrice;
        this.cusine = data.cusine;
        this.openTime = data.openTime;
        this.closeTime = data.closeTime;
        this.email = data.email;
        this.phone = data.phone;
        this.status = data.status;
        if (localStorage.getItem('newAddress') && localStorage.getItem('newAddress') != null) {
          this.address = localStorage.getItem('newAddress');
        }
        if (localStorage.getItem('newLng') && localStorage.getItem('newLng') != null) {
          this.longitude = localStorage.getItem('newLng');
        }
        if (localStorage.getItem('newLat') && localStorage.getItem('newLat') != null) {
          this.latitude = localStorage.getItem('newLat');
        }
      } else {
        localStorage.clear();
        this.router.navigate(['login']);
      }
      if (localStorage.getItem('newAddress') && localStorage.getItem('newAddress') != null) {
        this.address = localStorage.getItem('newAddress');
      }
      if (localStorage.getItem('newLng') && localStorage.getItem('newLng') != null) {
        this.longitude = localStorage.getItem('newLng');
      }
      if (localStorage.getItem('newLat') && localStorage.getItem('newLat') != null) {
        this.latitude = localStorage.getItem('newLat');
      }
    }).catch(error => {
      console.log(error);
      this.util.hide();
      this.util.errorToast(this.util.translate('Something went wrong'));
    });
  }

// Variables para almacenar las imágenes y la URL
imageUrls: string[] = [];


async openCameraOrGalleryWeb(type:'gallery', num?: string) {
  if (this.imageUrls.length >= 6) {
    alert('Ya has seleccionado 6 imágenes.');
    return; // No permite más de 6 imágenes
  }

   if (type === 'gallery') {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*'; // Solo imágenes
    input.onchange = (event: any) => {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          console.log('Imagen seleccionada:', e.target.result);
          this.uploadImageToFirebase(e.target.result, num); // Sube la imagen a Firebase
        };
        reader.readAsDataURL(file); // Convierte la imagen a Base64
      }
    };
    input.click();
  }
}

// Función para subir la imagen a Firebase
uploadImageToFirebase(base64Image: string, num?: string) {
  this.util.show();  // Muestra el cargador (puedes personalizarlo)
  const id = localStorage.getItem('uid') + '/' + this.makeid(10);
  firebase.storage().ref().child(localStorage.getItem('uid')).child(btoa(id) + '.jpg')
    .putString(base64Image, 'data_url')
    .then((snapshot) => {
      this.util.hide(); // Oculta el cargador
      snapshot.ref.getDownloadURL().then((url) => {
        console.log('Imagen subida con éxito:', url);
        // Dependiendo de `num`, asigna la URL a la imagen correspondiente
        if (!num) {
          this.coverImage = url;
        } else if (num === '1') {
          this.image1 = url;
        } else if (num === '2') {
          this.image2 = url;
        } else if (num === '3') {
          this.image3 = url;
        } else if (num === '4') {
          this.image4 = url;
        } else if (num === '5') {
          this.image5 = url;
        } else if (num === '6') {
          this.image6 = url;
        }
      });
    }, error => {
      this.util.hide(); // Oculta el cargador
      console.log('Error al subir la imagen:', error);
      this.util.errorToast('Algo salió mal al subir la imagen.');
    });
}


  makeid(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }
  dismiss() {

  }
  closeIt() {
    const param = {
      uid: localStorage.getItem('uid'),
      status: 'close',
    };
    this.util.show();
    this.api.updateVenue(param).then((data) => {
      this.util.hide();
      console.log(data);
      this.util.showToast(this.util.translate('Restaurant updated successfully'), 'success', 'bottom');
      this.util.publishProfile('update');
      this.navCtrl.back();
    }, error => {
      this.util.hide();
      console.log(error);
      this.util.errorToast(error);
    }).catch(error => {
      this.util.hide();
      console.log(error);
      this.util.errorToast(error);
    });
  }

  openIt() {
    const param = {
      uid: localStorage.getItem('uid'),
      status: 'open',
    };
    this.util.show();
    this.api.updateVenue(param).then((data) => {
      this.util.hide();
      console.log(data);
      this.util.publishProfile('update');
      this.util.showToast(this.util.translate('Restaurant updated'), 'success', 'bottom');
      this.navCtrl.back();
    }, error => {
      this.util.hide();
      console.log(error);
      this.util.errorToast(error);
    }).catch(error => {
      this.util.hide();
      console.log(error);
      this.util.errorToast(error);
    });
  }

  openMap() {
    localStorage.removeItem('newAddress');
    localStorage.removeItem('newLng');
    localStorage.removeItem('newLat');
    this.router.navigate(['maps']);
  }
}
