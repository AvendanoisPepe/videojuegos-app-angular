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
    titulo: '',
    genero: '',
    estado: '',
    imagen: '',
    consola: '',
    ranking: 0,
    descripcion: ''
  };
  mostrarFormulario: boolean = false; // Arranca en falso para que el formulario este oculto al inicio
  // Variables para enlazar los controles del footer (Filtros)
  filtroTexto: string = '';
  filtroGenero: string = '';
  filtroConsola: string = '';
  filtroEstado: string = '';
  ordenarPor: string = ''; // Puede ser: 'alfabetico' o 'ranking'


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
    if (this.nuevoJuego.titulo.trim() === '' || this.nuevoJuego.genero.trim() === '') {
      alert("Por favor, llena ambos campos");
      return;
    }

    // Le mandamos a .NET el objeto mapeado con las propiedades que espera el backend
    const juegoAEnviar: any = {
      'titulo': this.nuevoJuego.titulo,
      'genero': this.nuevoJuego.genero,
      'estado': this.nuevoJuego.estado,
      'imagen': this.nuevoJuego.imagen,
      'consola': this.nuevoJuego.consola,
      'ranking': this.nuevoJuego.ranking,
      'descripcion': this.nuevoJuego.descripcion
    };

    this._videojuegoService.crear(juegoAEnviar).subscribe({
      next: () => {
        this.cargarVideojuegos(); // Recargamos la lista para ver el nuevo juego
        // Limpiamos el formulario
        this.nuevoJuego.titulo = '';
        this.nuevoJuego.genero = '';
        this.nuevoJuego.estado = '';
        this.nuevoJuego.imagen = '';
        this.nuevoJuego.consola = '';
        this.nuevoJuego.ranking = 0;
        this.nuevoJuego.descripcion = '';
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
    // Retorna directamente la propiedad limpia en minuscula
    return juego.titulo || juego['titulo'] || '';
  }

  getGenero(juego: any): string {
    // Retorna directamente la propiedad limpia en minuscula
    return juego.genero || juego['genero'] || '';
  }

  // Getter que procesa la lista con todos los filtros activos en tiempo real
  get juegosFiltrados() : any[] {
    if (!this.listJuegos) return [];

    // Filtrar datos 1 por 1
    let resultado = this.listJuegos.filter((juego: any) => {
      const cumpleNombre = !this.filtroTexto || 
        (juego.titulo && juego.titulo.toLowerCase().includes(this.filtroTexto.toLowerCase()));
      const cumpleGenero = !this.filtroGenero || 
        (juego.genero && juego.genero.toLowerCase().includes(this.filtroGenero.toLowerCase()));
      const cumpleConsola = !this.filtroConsola || 
        (juego.consola && juego.consola === this.filtroConsola);
      const cumpleEstado = !this.filtroEstado || 
        (juego.estado && juego.estado === this.filtroEstado);
      return cumpleNombre && cumpleGenero && cumpleConsola && cumpleEstado;
    })
    // Aplicar ordenamiento si aplica
    if (this.ordenarPor === "alfabetico") {
      resultado.sort((a: any, b: any) => (a.titulo || '').localeCompare(b.titulo || ''));
    } else if (this.ordenarPor === 'ranking') {
      resultado.sort((a: any, b: any) => (b.ranking || 0) - (a.ranking || 0)); // De mayor a menor puntuación
    }
    return resultado
  }
}