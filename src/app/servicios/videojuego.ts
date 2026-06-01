import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Creamos una interfaz para decirle a Angular qué forma tienen nuestros datos (el mismo molde de C#)
export interface Videojuego {
  id?: number; // El ? significa que es opcional (porque al crear uno nuevo, .NET le asigna el ID)
  título: string; 
  gênero?: string; // Para evitar líos con la 'é', usemos de momento la propiedad exacta que viste o ponla opcional
  género: string; 
}

@Injectable({
  providedIn: 'root'
})
export class VideojuegoService {
    // URL DONDE ESTA CORRIENDO LA API EN .NET
    private myAppUrl = 'http://localhost:5100/';
    private myApiUrl = 'api/videojuegos';
    
    // Inyectamos el HttpClient de Angular (Inyección de Dependencias, igual que en .NET) 
    constructor(private http: HttpClient) { }

    // Método para obtener todos los videojuegos
    // 1. Peticion get para traer todos los juegos
    obtenerTodos(): Observable<Videojuego[]> {
        return this.http.get<Videojuego[]>(this.myAppUrl + this.myApiUrl);
    }
    // 2. Petición POST para guardar un juego nuevo
    crear(juego: Videojuego): Observable<Videojuego> {
      return this.http.post<Videojuego>(this.myAppUrl + this.myApiUrl, juego);
    }

    // 3. Petición DELETE para borrar un juego por su ID
    eliminar(id: number): Observable<void> {
      return this.http.delete<void>(this.myAppUrl + this.myApiUrl + '/' + id);
    }
}