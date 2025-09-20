import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonList, IonItem, IonInput, IonTextarea, IonButton, IonIcon, IonButtons, NavController, ActionSheetController } from '@ionic/angular/standalone';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { addIcons } from 'ionicons';
import { arrowBack, camera } from 'ionicons/icons';
import { PostService } from '../services/post-service';

@Component({
  selector: 'app-add-post',
  templateUrl: './add-post.page.html',
  styleUrls: ['./add-post.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonContent, IonHeader, IonTitle, IonToolbar, IonList, IonItem, IonInput, IonTextarea, IonButton, IonIcon, IonButtons
  ]
})
export class AddPostPage implements OnInit {
  /**
   * FormGroup para manejar el formulario reactivo de creación de avisos.
   */
  postForm: FormGroup;
  /**
   * Variable para almacenar la imagen en formato base64.
   */
  imageData: string | null = null;

  /**
   * @param fb FormBuilder para crear el formulario reactivo.
   * @param postService Servicio para la gestión de avisos.
   * @param navController Controlador de navegación para volver a la página anterior.
   * @param actionSheetCtrl Controlador para mostrar hojas de acciones (menús contextuales).
   */
  constructor(
    private fb: FormBuilder,
    private postService: PostService,
    private navController: NavController,
    private actionSheetCtrl: ActionSheetController
  ) {
    addIcons({ arrowBack, camera });
    this.postForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(5)]],
      description: ['', [Validators.required, Validators.minLength(20)]]
    });
  }

  ngOnInit() { }

  /**
   * Guarda el nuevo aviso si el formulario es válido.
   */
  async savePost() {
    if (this.postForm.invalid) {
      this.postForm.markAllAsTouched();
      return;
    }

    await this.postService.addPost({
      ...this.postForm.value,
      image: this.imageData
    });

    this.navController.back();
  }

  /**
   * Muestra las opciones para tomar una foto o seleccionarla de la galería.
   */
  async takePicture() {
    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Seleccionar Fuente',
      buttons: [
        {
          text: 'Usar Cámara',
          handler: () => {
            this.captureImage(CameraSource.Camera);
          },
        },
        {
          text: 'Abrir Galería',
          handler: () => {
            this.captureImage(CameraSource.Photos);
          },
        },
        {
          text: 'Cancelar',
          role: 'cancel',
        },
      ],
    });

    await actionSheet.present();
  }

  /**
   * Captura una imagen utilizando el plugin de Capacitor Camera.
   * @param source La fuente de la imagen (cámara o galería).
   */
  async captureImage(source: CameraSource) {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.DataUrl,
      source: source
    });

    if (image.dataUrl) {
      this.imageData = image.dataUrl;
    }
  }

  /**
   * Vuelve a la página anterior.
   */
  goBack() {
    this.navController.back();
  }
}