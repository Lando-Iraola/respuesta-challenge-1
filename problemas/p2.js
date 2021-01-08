/**
 * Problema número 2.
 * 
 * Genera un script/algoritmo/función que sea capaz de transformar los datos de input-p2.csv
 * en un arból de estructura similar al problema de p1 utilizando la estructura de Nodo.js
 */

const { resolve } = require("path");
const Nodo = require("./src/Nodo");
const raiz = new Nodo("root", "Raíz");

//Agregar a raiz toda la estructura solicitada.

/*
    Correr npm install antes de ejecutar esta solucion.
*/

function leerCSV()
{   
    /*
        Lee el CSV usando csv-parser.
        Devuelve una promesa que entregara la variable result al resolverse
    */
    const promesa = function (resolve, reject)
    {
        const csv = require("csv-parser");
        csv({separator: ","});

        const fs = require("fs");
        const result = [];

        fs.createReadStream("./src/input-p2.csv")
            .pipe(csv())
            .on("data", (data) => result.push(data))
            .on("end", () => {resolve(result)})
    }

    return new Promise(promesa);
}

function formatearDatos(data)
{
    /*
        primero ordena los datos segun su sede.
        Esto para facilitar la creacion, ya que si cambiamos de sede, no volvera a aparecer despues.
    */
    const dataOrdenada = data.sort(_ordernar);
    const resultado = [];

    dataOrdenada.forEach(
        linea =>
        {
            /*
                Aqui se intentara pasar por cada registro solo una vez.
                Dentro de las funciones se realiza la transformacion y es guardada directamente en resultado.
                Las transformaciones dependen de que toda la informacion esta almacenada en la variable linea.

                La variable indice existe para asegurar que se esta intentando guardar en la posicion en arreglo correspondiente a la sede de linea.Sede
            */
            const indice = _indiceAUtilizar(resultado, linea);
            _agregarSedes(resultado, linea);
            _agregarCursos(resultado, linea, indice);
            _agregarSecciones(resultado, linea, indice);
            _agregarOfertas(resultado, linea, indice);
        }
    )
    
    return resultado;
}

function _ordernar(a,b)
{
    if (a.Sede > b.Sede) 
        return 1;
    
    if (a.Sede < b.Sede) 
        return -1;
    
    return 0;
}

function _indiceAUtilizar(resultado, data)
{
    const indiceConocido = resultado.forEach(
        (s, index) => 
        {
            if(s.nombre === data.Sede)
                return index;
            else
                return 0;
        }
    );
    
    const indiceNuevo = resultado.length === 0 ? 0 : resultado.length - 1;
    const indice = indiceConocido ? indiceConocido : indiceNuevo;           

    return indice;
}

function _agregarSedes(resultado, data)
{
    /*
        Se agrega un nodo sede solo si no existe data.Sede dentro de resultado
    */
    const sede = new Nodo(data.Sede, "Sede");

    if(resultado.length === 0 || !resultado.map(s => s.nombre).includes(sede.nombre))
    {
        resultado.push(sede);
    }
}

function _agregarCursos(resultado, data, indice)
{
    /*
        Aqui se guarda directamente el curso dentro de la sede si es que no es conocido.
        Ya que resultado[indice] corresponde a la sede de data (debido al csv y el forEach, esta linea contiene su sede y curso) 
        no es necesario validar su correspondencia a esta estructura.
    */
    const cursos = new Nodo(data.Curso, "Curso");
            
    if(!resultado[indice].hijos.map(c => c.nombre).includes(cursos.nombre))
    {
        resultado[indice].hijos.push(cursos);
    }
}

function _agregarSecciones(resultado, data, indice)
{
    /*
        Debido a la existencia de varios Cursos, secciones.
        Aqui si se debe validar la pertenencia de data.seccion al curso.
    */
    const secciones = new Nodo(data.Seccion, "Seccion");

    resultado[indice].hijos.forEach(
        curso => 
        {
            if(resultado[indice].nombre === data.Sede &&
                curso.nombre === data.Curso &&
                !curso.hijos.map(sec => sec.nombre).includes(data.Seccion)
            )
            {
                curso.hijos.push(secciones);
            }
        }
    )
}

function _agregarOfertas(resultado, data, indice)
{
    /*
        Mismo caso que en agregarSecciones.
        Aqui antes de poder insertar la linea (data) a la seccion, 
        se debe validar que esta oferta corresponde a la seccion, curso y sede.
    */
    const oferta = new Nodo(data.Oferta, "Oferta");
    resultado[indice].hijos.forEach(
        curso => 
        {
            if(resultado[indice].nombre === data.Sede &&
                curso.nombre === data.Curso
            )
            {
                curso.hijos.forEach(
                    secciones =>
                    {
                        if(secciones.nombre === data.Seccion)
                        {
                            secciones.hijos.push(oferta)
                        }
                    }
                )
            }
        }
    )
}

async function agregarEstructura(raiz)
{
    /*
        Ya que leerCSV es una promesa, aqui se agrego una funcion async para poder manejarla
    */
    const csv = await leerCSV();
    const hijosFormateados = formatearDatos(csv);

    raiz.hijos = hijosFormateados;

    return raiz;
}

/*
    Ya que se estan utilizando promesas, y aqui nos encontramos fuera de una funcion: 
    Se utiliza then() para poder visualizar los resultados.
*/
agregarEstructura(raiz).then(
    resultado =>
    console.log(JSON.stringify(resultado))
)



