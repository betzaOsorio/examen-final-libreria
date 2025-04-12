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

const fileSystem = require('fs');
const estilos = require('chalk');
const entradaSalida = require('readline');
const paleta = require('colors');
const interfaz = entradaSalida.createInterface({
    input: process.stdin,
    output: process.stdout
});

const listadoLibros = [];

function solicitarDato(consulta) {
    return new Promise((resolver) => {
        interfaz.question(consulta, (entradaUsuario) => {
            resolver(entradaUsuario);
        });
    });
}

function presentarOpciones() {
    console.log(estilos.blue('\nSistema de administración bibliográfica "Letras y Saberes"'));
    console.log(estilos.green('1. Registrar nuevo libro'));
    console.log(estilos.green('2. Visualizar todos los libros'));
    console.log(estilos.green('3. Encontrar libro específico'));
    console.log(estilos.green('4. Quitar libro del sistema'));
    console.log(estilos.green('5. Consultar métricas'));
    console.log(estilos.green('6. Organizar colección'));
    console.log(estilos.green('7. Modificar datos de libro'));
    console.log(estilos.red('8. Finalizar programa'));
}

async function registrarLibro() {
    const nombreObra = await solicitarDato('Proporcione el nombre del libro: ');
    const escritor = await solicitarDato('Indique el autor: ');
    const valor = parseFloat(await solicitarDato('Introduzca el valor monetario: '));
    const fechaPublicacion = parseInt(await solicitarDato('Año de edición: '));

    if (isNaN(valor) || valor <= 0) {
        console.log(estilos.red('El valor debe ser numérico y mayor a cero.'));
        return;
    }

    const nuevoRegistro = { nombreObra, escritor, valor, fechaPublicacion };
    listadoLibros.push(nuevoRegistro);
    console.log(estilos.green('Libro registrado satisfactoriamente.'));
}

function exhibirColeccion() {
    if (listadoLibros.length === 0) {
        console.log(estilos.yellow('La colección está vacía actualmente.'));
        return;
    }

    console.log(estilos.blue('Registros bibliográficos:'));
    listadoLibros.forEach((ejemplar, posicion) => {
        console.log(estilos.cyan(`${posicion + 1}. Obra: ${ejemplar.nombreObra}, Creador: ${ejemplar.escritor}, Costo: $${ejemplar.valor}, Publicación: ${ejemplar.fechaPublicacion}`));
    });
}

async function localizarLibro() {
    const busqueda = await solicitarDato('Escriba el título a buscar: ');
    const resultado = listadoLibros.find(ejemplar => ejemplar.nombreObra.toLowerCase() === busqueda.toLowerCase());

    if (resultado) {
        console.log(estilos.blue(`Resultado encontrado: Obra: ${resultado.nombreObra}, Autor: ${resultado.escritor}, Valor: $${resultado.valor}, Año: ${resultado.fechaPublicacion}`));
    } else {
        console.log(estilos.red('No se encontró coincidencia.'));
    }
}

async function removerLibro() {
    const busqueda = await solicitarDato('Indique el título a eliminar: ');
    const indiceRegistro = listadoLibros.findIndex(ejemplar => ejemplar.nombreObra.toLowerCase() === busqueda.toLowerCase());

    if (indiceRegistro !== -1) {
        listadoLibros.splice(indiceRegistro, 1);
        console.log(estilos.green('Registro eliminado con éxito.'));
    } else {
        console.log(estilos.red('No existe ese título en la colección.'));
    }
}

function calcularMetricas() {
    if (listadoLibros.length === 0) {
        console.log(estilos.yellow('No hay registros para analizar.'));
        return;
    }

    const cantidadTotal = listadoLibros.length;
    const promedioValores = listadoLibros.reduce((acumulador, ejemplar) => acumulador + ejemplar.valor, 0) / cantidadTotal;
    const obraMasAntigua = listadoLibros.reduce((a, b) => (a.fechaPublicacion < b.fechaPublicacion ? a : b));
    const obraMasCostosa = listadoLibros.reduce((a, b) => (a.valor > b.valor ? a : b));

    console.log(estilos.blue(`Total de obras registradas: ${cantidadTotal}`));
    console.log(estilos.blue(`Valor promedio: $${promedioValores.toFixed(2)}`));
    console.log(estilos.blue(`Publicación más antigua: Obra: ${obraMasAntigua.nombreObra}, Autor: ${obraMasAntigua.escritor}, Año: ${obraMasAntigua.fechaPublicacion}`));
    console.log(estilos.blue(`Obra de mayor valor: Obra: ${obraMasCostosa.nombreObra}, Autor: ${obraMasCostosa.escritor}, Precio: $${obraMasCostosa.valor}`));
}

async function reorganizarColeccion() {
    console.log(estilos.blue('Seleccione el criterio de ordenamiento:'));
    console.log(estilos.green('1. Valor (menor a mayor)'));
    console.log(estilos.green('2. Valor (mayor a menor)'));
    console.log(estilos.green('3. Fecha de publicación'));

    const seleccion = parseInt(await solicitarDato('Elija una opción numérica: '));

    switch (seleccion) {
        case 1:
            listadoLibros.sort((a, b) => a.valor - b.valor);
            console.log(estilos.green('Colección ordenada por valor ascendente.'));
            break;
        case 2:
            listadoLibros.sort((a, b) => b.valor - a.valor);
            console.log(estilos.green('Colección ordenada por valor descendente.'));
            break;
        case 3:
            listadoLibros.sort((a, b) => a.fechaPublicacion - b.fechaPublicacion);
            console.log(estilos.green('Colección ordenada cronológicamente.'));
            break;
        default:
            console.log(estilos.red('Opción incorrecta.'));
    }
}

async function actualizarRegistro() {
    const busqueda = await solicitarDato('Título del libro a modificar: ');
    const registroExistente = listadoLibros.find(ejemplar => ejemplar.nombreObra.toLowerCase() === busqueda.toLowerCase());

    if (registroExistente) {
        const tituloActualizado = await solicitarDato('Nuevo título (opcional): ');
        const autorActualizado = await solicitarDato('Nuevo autor (opcional): ');
        const valorInput = await solicitarDato('Nuevo valor (opcional): ');
        const fechaInput = await solicitarDato('Nuevo año (opcional): ');

        const nuevoValor = parseFloat(valorInput);
        const nuevaFecha = parseInt(fechaInput);

        if (tituloActualizado) registroExistente.nombreObra = tituloActualizado;
        if (autorActualizado) registroExistente.escritor = autorActualizado;
        if (!isNaN(nuevoValor) && nuevoValor > 0) registroExistente.valor = nuevoValor;
        if (!isNaN(nuevaFecha)) registroExistente.fechaPublicacion = nuevaFecha;

        console.log(estilos.green('Cambios aplicados correctamente.'));
    } else {
        console.log(estilos.red('No se encontró el libro especificado.'));
    }
}

function respaldarDatos() {
    fileSystem.writeFileSync('registros.json', JSON.stringify(listadoLibros, null, 2));
    console.log(estilos.green('Datos almacenados en registros.json'));
}

async function ejecutarPrograma() {
    while (true) {
        presentarOpciones();
        const eleccion = await solicitarDato('Ingrese el número de opción: ');

        switch (eleccion) {
            case '1':
                await registrarLibro();
                break;
            case '2':
                exhibirColeccion();
                break;
            case '3':
                await localizarLibro();
                break;
            case '4':
                await removerLibro();
                break;
            case '5':
                calcularMetricas();
                break;
            case '6':
                await reorganizarColeccion();
                break;
            case '7':
                await actualizarRegistro();
                break;
            case '8':
                respaldarDatos();
                console.log(estilos.red('Programa finalizado.'));
                interfaz.close();
                return;
            default:
                console.log(estilos.red('Selección inválida.'));
        }
    }
}

ejecutarPrograma();



