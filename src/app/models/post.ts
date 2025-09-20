export interface Post {
  id: number;
  title: string;
  description: string;
  date: Date;
  image?: string; // base64 o url de la foto
}
