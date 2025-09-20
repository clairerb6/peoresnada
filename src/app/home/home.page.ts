import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';

import { IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItemSliding, IonItem, IonLabel, IonItemOptions, IonItemOption, IonIcon, IonFab, IonFabButton, AlertController } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { add, trash } from 'ionicons/icons';
import { Post } from '../models/post';
import { PostService } from '../services/post-service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItemSliding, IonItem, IonLabel, IonItemOptions, IonItemOption, IonIcon, IonFab, IonFabButton, DatePipe],
})
export class HomePage {
  /**
   * Arreglo para almacenar los avisos que se mostrarán en la página.
   */
  posts: Post[] = [];

  /**
   * @param postService Servicio para gestionar los datos de los avisos.
   * @param router Servicio de enrutamiento para navegar entre páginas.
   * @param alertController Controlador para mostrar alertas y modales.
   */
  constructor(
    private postService: PostService,
    private router: Router,
    private alertController: AlertController
  ) {
    addIcons({ add, trash });
  }

  /**
   * Método del ciclo de vida de Ionic que se ejecuta cada vez que la vista está a punto de mostrarse.
   */
  ionViewWillEnter() {
    this.loadPosts();
  }

  /**
   * Carga los avisos desde el servicio y los asigna a la variable local 'posts'.
   */
  async loadPosts() {
    this.posts = await this.postService.getPosts();
  }

  /**
   * Navega a la página de agregar un nuevo aviso.
   */
  goToAddPost() {
    this.router.navigate(['/add-post']);
  }

  /**
   * Muestra un diálogo de confirmación antes de eliminar un aviso.
   * @param postId El ID del aviso a eliminar.
   */
  async confirmDelete(postId: number) {
    const alert = await this.alertController.create({
      header: 'Confirmar Eliminación',
      message: '¿Estás seguro de que quieres eliminar este aviso?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Eliminar',
          handler: () => {
            this.deletePost(postId);
          }
        }
      ]
    });

    await alert.present();
  }

  /**
   * Llama al servicio para eliminar un aviso y recarga la lista.
   * @param postId El ID del aviso a eliminar.
   */
  private async deletePost(postId: number) {
    await this.postService.deletePost(postId);
    this.loadPosts();
  }
}