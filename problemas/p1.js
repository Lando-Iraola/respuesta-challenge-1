/**
 * Problema número 1.
 *
 * Necesitamos que obtengas los datos de ./src/input-p1.json y generes funciones que permitan:
 *
 * 1. Retornar todos los nodos que no tienen hijos.
 * 2. Retornar todos los nodos que contienen una cantidad X (parametrizable) de hijos
 * 3. Contabilizar la cantidad de nodos totales
 * 4. Retornar todas las Sedes con 4° Medio que *SI* poseen la *Oferta Tecnología* en sus *Secciones A*
 */

const data = require("./src/input-p1.json");
// console.log(data);

function sinHijos(input)
{
    /*
        Todos los elementos que no tengan hijos seran guardados en un arreglo
    */
    let elementoSinHijos = [];
    _recorrerHijos(input, elementoSinHijos);
    
    return elementoSinHijos;
}

function _recorrerHijos(input, inArray)
{
    /*
        Encuentra todos los nodos que no tengan hijos de forma recursiva.

        1) inArray viene desde sinHijos
        2) Recorrera todos los nodos hasta encontrar uno que no tenga hijos
        3) Al encontrar uno sin hijos, lo agrega a inArray

        Se utiliza inArray ya que se desea crear un nuevo arreglo con solo los elementos vacios.
    */

    if(input.hijos.length == 0)
    {
        inArray.push(input);
    }
    
    input.hijos.forEach(
        h =>
        _recorrerHijos(h, inArray)
    )
}

function cantidadEspecificaDeHijos(input, cantidadHijos)
{
    let cantidadEspecifica = [];
   
    _soloConXHijos(input, cantidadHijos, cantidadEspecifica);
    
    return cantidadEspecifica;
}

function _soloConXHijos(input, cantidadHijos, inArray)
{
    if(input.hijos.length == cantidadHijos)
    {
        inArray.push(input)
    }
    
    input.hijos.forEach(
        h =>
        _soloConXHijos(h, cantidadHijos, inArray)
    )
}

function contarNodos(input, cuenta = 0)
{
    /*
        Esto entra a cada uno de los nodos.
        Por tanto solo agrega +1 por cada lugar al que entra.
        Y como es una funcion recursiva, la cuenta va incrementando cada vez que es invocada.
    */
    cuenta += 1;

    input.hijos.forEach(
        h =>
        cuenta = contarNodos(h, cuenta)
    )

    return cuenta;
}

function encontrarSedesConCursoYOfertaEspecifico(input, curso, seccion, oferta)
{
    const sedes = input.hijos;
    const soloCursoDeMiInteres = _borrarCursosNoDeseados(sedes, curso); //Funcion que filtra sedes que solo tengan 4to medio usando forEach y Filter
    const soloSeccionDeMiInteres = _borrarSeccionNoDeseadas(soloCursoDeMiInteres, seccion); //Funcion que filtra sedes que tengan cursos con la seccion deseaada usando forEach y filter
    const soloOfertasDeMiInteres = _borrarOfertasNoDeseadas(soloSeccionDeMiInteres, oferta); //Funcion que filtra sedes que tengan cursos con la seccion y oferta deseaada usando forEach y filter
    const soloSedesDeMiInteres = _borrarSedesNoDeseadas(soloOfertasDeMiInteres); //Funcion que solo agrega elementos al arreglo si tienen la profundidad en la que la oferta vive.

    return soloSedesDeMiInteres;
}

function _borrarCursosNoDeseados(sedes, curso)
{ 
    sedes.forEach(
        s =>
        {
            s.hijos = s.hijos.filter(c => c.nombre === curso);
        }
    )

    return sedes;
}

function _borrarSeccionNoDeseadas(sedes, seccion)
{ 
    sedes.forEach(
        s =>
        {
            s.hijos.forEach(
                c =>
                {
                    c.hijos = c.hijos.filter(s => s.nombre === seccion)
                }
            )
        }
    )

    return sedes;
}

function _borrarOfertasNoDeseadas(sedes, oferta)
{ 
    sedes.forEach(
        s =>
        {
            s.hijos.forEach(
                c =>
                {
                    c.hijos.forEach(
                        sec =>
                        {
                            sec.hijos = sec.hijos.filter(o => o.nombre === oferta)
                        }
                    )
                }
            )
        }
    )

    return sedes;
}

function _borrarSedesNoDeseadas(sedes)
{
    let sedesDeseadas = [];
    sedes.forEach(
        s =>
        {
            s.hijos.forEach(
                c =>
                {
                    c.hijos.forEach(
                        sec =>
                        {
                            sec.hijos.forEach(
                                o =>
                                sedesDeseadas.push(s)
                            )
                        }
                    )
                }
            )
        }
    )

    return sedesDeseadas;
}

console.log(sinHijos(data));
console.log(cantidadEspecificaDeHijos(data, 5));
console.log(contarNodos(data));
console.log(encontrarSedesConCursoYOfertaEspecifico(data, "4 Medio", "A","Tecnología"));