import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { FormsModule } from '@angular/forms';
import { Videojuego, VideojuegoService } from './servicios/videojuego'; 

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule], 
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class AppComponent implements OnInit {
  listJuegos: Videojuego[] = [];
  // Creamos un objeto vacío que estará amarrado al formulario
  nuevoJuego: Videojuego = {
    título: '',
    género: ''
  };
  constructor(private _videojuegoService: VideojuegoService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.cargarVideojuegos();
  }

  cargarVideojuegos(): void {
    this._videojuegoService.obtenerTodos().subscribe({
      next: (data) => {
        this.listJuegos = data;
        console.log("¡Datos recibidos de .NET!", data); 
        // ¡Obligamos a Angular a pintar la pantalla SI O SI justo ahora!
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error("Hubo un error al conectar con .NET:", error);
      }
    });
  }

  // Método para Crear un nuevo videojuego
  agregarVideojuego(): void {
    if (this.nuevoJuego.título.trim() === '' || this.nuevoJuego.género.trim() === '') {
      alert("Por favor, llena ambos campos");
      return;
    }

    // Le mandamos a .NET el objeto mapeado con las propiedades que espera el backend
    const juegoAEnviar: any = {
      'título': this.nuevoJuego.título,
      'género': this.nuevoJuego.género
    };

    this._videojuegoService.crear(juegoAEnviar).subscribe({
      next: () => {
        this.cargarVideojuegos(); // Recargamos la lista para ver el nuevo juego
        // Limpiamos el formulario
        this.nuevoJuego.título = '';
        this.nuevoJuego.género = '';
      },
      error: (error) => console.error("Error al crear:", error)
    });
  }

  // Método para Eliminar un videojuego por su ID
  eliminarVideojuego(id: number | undefined): void {
    if (id === undefined) return;

    this._videojuegoService.eliminar(id).subscribe({
      next: () => {
        this.cargarVideojuegos(); // Recargamos la lista para ver los cambios
      },
      error: (error) => console.error("Error al eliminar:", error)
    });
  }
  
  // Funciones ayudantes para obtener los datos sin que Angular se confunda con las tildes
  getTitulo(juego: any): string {
    return juego['título'] || juego['titulo'] || '';
  }

  getGenero(juego: any): string {
    return juego['género'] || juego['genero'] || '';
  }
}