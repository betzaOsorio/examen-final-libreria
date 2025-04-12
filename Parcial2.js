/*Has sido contratado por una pequeña librería local llamada "El Rincón del Saber".
El dueño de la librería quiere modernizar la forma en la que administra su catálogo de libros y necesita una aplicación de consola para gestionar su inventario.

Tu misión es desarrollar un sistema simple pero funcional que le permita agregar, editar, buscar, eliminar y analizar los libros que tiene a la venta.
Este proyecto pondrá a prueba todo lo que has aprendido durante el curso hasta ahora.

Menú principal
El sistema debe mostrar el siguiente menú (puedes usar switch o if-else):

1. Agregar libro
2. Mostrar catálogo
3. Buscar libro por título
4. Eliminar libro
5. Ver estadísticas
6. Ordenar libros
7. Editar libro
8. Salir

1. Agregar libro
Solicitar al usuario los siguientes datos:

Título
Autor
Precio
Año de publicación
Guardar el libro como un objeto dentro de un arreglo llamado catalogo.

2. Mostrar catálogo
Mostrar todos los libros registrados en el sistema en un formato ordenado.

3. Buscar libro por título
Permitir al usuario ingresar el título de un libro y mostrar sus datos si existe.
Si no se encuentra, mostrar "Libro no encontrado".

4. Eliminar libro
Solicitar un título y eliminar el libro correspondiente del catálogo.
Confirmar si fue eliminado correctamente.

5. Ver estadísticas
Mostrar:

Cantidad total de libros
Precio promedio
Libro más antiguo
Libro más caro
6. Ordenar libros
Permitir ordenar el catálogo por:

Precio (ascendente o descendente)
Año de publicación
El usuario debe poder elegir el criterio de ordenamiento.

7. Editar libro
Permitir editar un libro existente: buscar por título y modificar sus datos.

8. Salir
Finalizar el programa.

🔧 Requisitos técnicos
Usar funciones para cada acción.
Utilizar arreglos de objetos.
Aplicar al menos 4 métodos de arreglo como .push(), .filter(), .find(), .sort(), .reduce(), etc.
Utilizar bucles (while, do...while o for) para mantener el menú activo.
Validar datos básicos (por ejemplo, que el precio sea un número positivo).
El sistema debe ejecutarse desde la terminal y mostrar información clara.

Usar colores en la consola (chalk, colors, etc.).
Crear una función para guardar el catálogo en un archivo (fs.writeFileSync).
Agregar una opción para filtrar libros por autor.
*/

const fs = require('fs');
const chalk = require('chalk');
const readline = require('readline');
const colors = require('colors');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const catalogo = [];

function preguntar(pregunta) {
    return new Promise((resolve) => {
        rl.question(pregunta, (respuesta) => {
            resolve(respuesta);
        });
    });
}

function mostrarMenu() {
    console.log(chalk.blue('\nBienvenido al sistema de gestión de libros "El Rincón del Saber"'));
    console.log(chalk.green('1. Agregar libro'));
    console.log(chalk.green('2. Mostrar catálogo'));
    console.log(chalk.green('3. Buscar libro por título'));
    console.log(chalk.green('4. Eliminar libro'));
    console.log(chalk.green('5. Ver estadísticas'));
    console.log(chalk.green('6. Ordenar libros'));
    console.log(chalk.green('7. Editar libro'));
    console.log(chalk.red('8. Salir'));
}

async function agregarLibro() {
    const titulo = await preguntar('Ingrese el título del libro: ');
    const autor = await preguntar('Ingrese el autor del libro: ');
    const precio = parseFloat(await preguntar('Ingrese el precio del libro: '));
    const anio = parseInt(await preguntar('Ingrese el año de publicación: '));

    if (isNaN(precio) || precio <= 0) {
        console.log(chalk.red('El precio debe ser un número positivo.'));
        return;
    }

    const libro = { titulo, autor, precio, anio };
    catalogo.push(libro);
    console.log(chalk.green('Libro agregado correctamente.'));
}

function mostrarCatalogo() {
    if (catalogo.length === 0) {
        console.log(chalk.yellow('No hay libros en el catálogo.'));
        return;
    }

    console.log(chalk.blue('Catálogo de libros:'));
    catalogo.forEach((libro, index) => {
        console.log(chalk.cyan(`${index + 1}. Título: ${libro.titulo}, Autor: ${libro.autor}, Precio: $${libro.precio}, Año: ${libro.anio}`));
    });
}

async function buscarLibroPorTitulo() {
    const titulo = await preguntar('Ingrese el título del libro a buscar: ');
    const libro = catalogo.find(libro => libro.titulo.toLowerCase() === titulo.toLowerCase());

    if (libro) {
        console.log(chalk.blue(`Libro encontrado: Título: ${libro.titulo}, Autor: ${libro.autor}, Precio: $${libro.precio}, Año: ${libro.anio}`));
    } else {
        console.log(chalk.red('Libro no encontrado.'));
    }
}

async function eliminarLibro() {
    const titulo = await preguntar('Ingrese el título del libro a eliminar: ');
    const indice = catalogo.findIndex(libro => libro.titulo.toLowerCase() === titulo.toLowerCase());

    if (indice !== -1) {
        catalogo.splice(indice, 1);
        console.log(chalk.green('Libro eliminado correctamente.'));
    } else {
        console.log(chalk.red('Libro no encontrado.'));
    }
}

function verEstadisticas() {
    if (catalogo.length === 0) {
        console.log(chalk.yellow('No hay libros en el catálogo.'));
        return;
    }

    const totalLibros = catalogo.length;
    const precioPromedio = catalogo.reduce((sum, libro) => sum + libro.precio, 0) / totalLibros;
    const libroMasAntiguo = catalogo.reduce((a, b) => (a.anio < b.anio ? a : b));
    const libroMasCaro = catalogo.reduce((a, b) => (a.precio > b.precio ? a : b));

    console.log(chalk.blue(`Cantidad total de libros: ${totalLibros}`));
    console.log(chalk.blue(`Precio promedio: $${precioPromedio.toFixed(2)}`));
    console.log(chalk.blue(`Libro más antiguo: Título: ${libroMasAntiguo.titulo}, Autor: ${libroMasAntiguo.autor}, Año: ${libroMasAntiguo.anio}`));
    console.log(chalk.blue(`Libro más caro: Título: ${libroMasCaro.titulo}, Autor: ${libroMasCaro.autor}, Precio: $${libroMasCaro.precio}`));
}

async function ordenarLibros() {
    console.log(chalk.blue('¿Cómo desea ordenar los libros?'));
    console.log(chalk.green('1. Por precio (ascendente)'));
    console.log(chalk.green('2. Por precio (descendente)'));
    console.log(chalk.green('3. Por año de publicación'));

    const opcion = parseInt(await preguntar('Ingrese su opción: '));

    switch (opcion) {
        case 1:
            catalogo.sort((a, b) => a.precio - b.precio);
            console.log(chalk.green('Libros ordenados por precio (ascendente).'));
            break;
        case 2:
            catalogo.sort((a, b) => b.precio - a.precio);
            console.log(chalk.green('Libros ordenados por precio (descendente).'));
            break;
        case 3:
            catalogo.sort((a, b) => a.anio - b.anio);
            console.log(chalk.green('Libros ordenados por año de publicación.'));
            break;
        default:
            console.log(chalk.red('Opción no válida.'));
    }
}

async function editarLibro() {
    const titulo = await preguntar('Ingrese el título del libro a editar: ');
    const libro = catalogo.find(libro => libro.titulo.toLowerCase() === titulo.toLowerCase());

    if (libro) {
        const nuevoTitulo = await preguntar('Ingrese el nuevo título (deje vacío para no modificar): ');
        const nuevoAutor = await preguntar('Ingrese el nuevo autor (deje vacío para no modificar): ');
        const precioInput = await preguntar('Ingrese el nuevo precio (deje vacío para no modificar): ');
        const anioInput = await preguntar('Ingrese el nuevo año de publicación (deje vacío para no modificar): ');

        const nuevoPrecio = parseFloat(precioInput);
        const nuevoAnio = parseInt(anioInput);

        if (nuevoTitulo) libro.titulo = nuevoTitulo;
        if (nuevoAutor) libro.autor = nuevoAutor;
        if (!isNaN(nuevoPrecio) && nuevoPrecio > 0) libro.precio = nuevoPrecio;
        if (!isNaN(nuevoAnio)) libro.anio = nuevoAnio;

        console.log(chalk.green('Libro editado correctamente.'));
    } else {
        console.log(chalk.red('Libro no encontrado.'));
    }
}

function guardarCatalogo() {
    fs.writeFileSync('catalogo.json', JSON.stringify(catalogo, null, 2));
    console.log(chalk.green('Catálogo guardado en catalogo.json'));
}

async function iniciar() {
    while (true) {
        mostrarMenu();
        const opcion = await preguntar('Seleccione una opción: ');

        switch (opcion) {
            case '1':
                await agregarLibro();
                break;
            case '2':
                mostrarCatalogo();
                break;
            case '3':
                await buscarLibroPorTitulo();
                break;
            case '4':
                await eliminarLibro();
                break;
            case '5':
                verEstadisticas();
                break;
            case '6':
                await ordenarLibros();
                break;
            case '7':
                await editarLibro();
                break;
            case '8':
                guardarCatalogo();
                console.log(chalk.red('¡Hasta luego!'));
                rl.close();
                return;
            default:
                console.log(chalk.red('Opción no válida.'));
        }
    }
}

iniciar();



