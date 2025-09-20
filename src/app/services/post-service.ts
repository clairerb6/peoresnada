import { Injectable } from '@angular/core';
import { Post } from '../models/post';
import { Preferences } from '@capacitor/preferences';

const POSTS_KEY = 'posts';

/**
 * Servicio para gestionar las operaciones de los avisos (Posts).
 * Utiliza Capacitor Preferences para el almacenamiento local.
 */
@Injectable({
  providedIn: 'root'
})
export class PostService {

  constructor() { }

  /**
   * Obtiene todos los avisos desde el almacenamiento local.
   * @returns Una promesa que se resuelve con un arreglo de Posts.
   */
  async getPosts(): Promise<Post[]> {
    const { value } = await Preferences.get({ key: POSTS_KEY });
    return value ? JSON.parse(value) : [];
  }

  /**
   * Agrega un nuevo aviso al almacenamiento.
   * @param post El objeto del aviso a agregar, sin id ni fecha.
   */
  async addPost(post: Omit<Post, 'id' | 'date'>): Promise<void> {
    const posts = await this.getPosts();
    const newPost: Post = {
      id: new Date().getTime(),
      date: new Date(),
      ...post
    };
    posts.unshift(newPost);
    await this.savePosts(posts);
  }

  /**
   * Elimina un aviso por su ID.
   * @param id El ID del aviso a eliminar.
   */
  async deletePost(id: number): Promise<void> {
    let posts = await this.getPosts();
    posts = posts.filter(p => p.id !== id);
    await this.savePosts(posts);
  }

  /**
   * Guarda el arreglo completo de avisos en el almacenamiento local.
   * @param posts El arreglo de avisos a guardar.
   */
  private async savePosts(posts: Post[]): Promise<void> {
    await Preferences.set({
      key: POSTS_KEY,
      value: JSON.stringify(posts)
    });
  }
}