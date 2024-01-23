//IMPORTACIONES
const http = require('http');
const url = require('url');
const fs = require('fs');

//CONSTANTES
const host = '127.0.0.3';
const port = 8083;
const folder = "Copia";
const file = "holamundo.txt";
const nombrealumno = "Carlos Landa Vázquez";
const server = http.createServer(); //Creamos el servidor
const letras_dni = ["T", "R", "W", "A", "G", "M", "Y", "F", "P", "D", "X", "B", "N", "J", "Z", "S", "Q", "V", "H", "L", "C", "K", "E"]

//VARIABLES
let msg_error = "La pagina seleccionada no existe.";

//funciones que definen la gestion de peticiones
server.on('request', (request, response) => {
    let urlcompleta = url.parse(request.url, true);
    let parametros = urlcompleta.query;
    let result = "";

    //segun el path al que accedamos mostramos diferentes contenidos.
    switch (urlcompleta.pathname) {
        //mostramos la bienvenida
        case "/":
            //info
            console.log(`Peticion Realizada al servidor http://${host}:${port}${request.url}`);
            //console.log(`url: ${urlcompleta.pathname}`);

            //mostramos el contenido de bienvenida.html
            fs.readFile("./bienvenida.html", "utf-8", (err, data) => {
                if (!err) {
                    result = data;
                    responder(response, result);
                }
                else {
                    console.log(`Error: ${err}`);
                }
            });
            break;

        //mostramos el contenido de /dni
        case "/dni":
            //info
            console.log(`Peticion Realizada al servidor http://${host}:${port}${request.url}`);
            //console.log(`url: ${urlcompleta.pathname}`);

            //comprobamos si esta definido el parametro numero de DNI, calculamos la letra, y si no es asi mostramos /instrucciones.html
            if (parametros.num) {
                let letra = calculaLetra(Number(parametros.num));
                dni = parametros.num + letra;

                //info
                console.log(`dni number: ${parametros.num}`);
                console.log(`dni letter: ${letra}`);
                console.log(`dni: ${dni}`);

                //mostramos el resultado del calculo de la letra del dni
                result = `
                <!DOCTYPE html>
                <html>

                <head>
                    <meta charset="UTF-8"><!--Especificamos juego de caracteres-->
                    <!--Titulo-->
                    <title>Bienvenido ...</title>
                    <!--Boostrap-->
                    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet"
                        integrity="sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN" crossorigin="anonymous">
                </head>
                
                <body cz-shortcut-listen="true">
                    <div class="container">
                        <div class="row justify-content-center">
                            <div class="col-6 m-5 alert alert-success text-center" role="alert">
                                DNI seleccionado es ${dni} 
                            </div>
                        </div>
                    </div>
                </body>
                
                </html>`;
                //console.log(`result: ${result}`);
                responder(response, result);
            }
            else {
                fs.readFile("./instrucciones.html", "utf-8", (err, data) => {
                    if (!err) {
                        result = data;
                        responder(response, result);
                    }
                    else {
                        console.log(`Error: ${err.message}`);
                    }
                });
            }
            break;

        //mostramos el contenido de /escribir
        case "/escribir":
            //info
            console.log(`Peticion Realizada al servidor http://${host}:${port}${request.url}`);
            //console.log(`url: ${urlcompleta.pathname}`);

            //comporbamos si existe la carpeta y la creamos en caso de que no sea así.
            if (fs.existsSync(folder)) {
                console.log(`la carpeta ${folder} ya existia.`);
            }
            else {
                fs.mkdir(folder, (err) => {
                    if (!err) {
                        console.log(`Creando carpeta ${folder}...`);
                    }
                    else {
                        console.log(`Error: ${err.message}`)
                    }
                })
            }

            //creamos el archivo dentro de la carpeta, y sobreescribimos si existe.
            fs.appendFile(folder + "/" + file, nombrealumno, (err) => {
                if (err) {
                    console.log(`Error: ${err.message}`);
                }
                else {
                    console.log(`Creando archivo ${file} en la carpeta ${folder}.`)

                    //mostramos mensaje de  que se a ceado correctamente el archivo.
                    result = `
                        <!DOCTYPE html>
                        <html>

                        <head>
                            <meta charset="UTF-8"><!--Especificamos juego de caracteres-->
                            <!--Titulo-->
                            <title>Bienvenido ...</title>
                            <!--Boostrap-->
                            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet"
                                integrity="sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN" crossorigin="anonymous">
                        </head>
                        
                        <body cz-shortcut-listen="true">
                            <div class="container">
                                <div class="row justify-content-center">
                                    <div class="col-6 m-5 alert alert-success text-center" role="alert">
                                        Archivo creado correctamente con el contenido ${nombrealumno} 
                                    </div>
                                </div>
                            </div>
                        </body>
                        
                        </html>`;
                    responder(response, result);
                }
            });
            break;

        //excluimos el caso de que el navegador intente pedir el favicon (error que me he encontrado durante las pruebas).
        case "/favicon.ico":
            //console.log(`Peticion Realizada al servidor http://${host}:${port}${request.url}`);
            //console.log(`url: ${urlcompleta.pathname}`);
            break;

        //si no es ninguna de las webs definidas nos mostrará error.html
        default:
            //info
            console.log(`Peticion Realizada al servidor http://${host}:${port}${request.url}`);
            //console.log(`url: ${urlcompleta.pathname}`);

            //mostramosla web error.html
            fs.readFile("./error.html", "utf-8", (err, data) => {
                if (!err) {
                    result = data;
                    responder(response, result);
                }
                else {
                    console.log(`Error: ${err}`);
                }
            });
    }
});

function responder(response, respuesta) {
    response.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    //console.log(`Respuesta: ${respuesta}`);
    response.write(respuesta);
    response.end();
}
function calculaLetra(num) {
    //crear la función que calcula la letra del DNI
    let order = num % 23;
    return letras_dni[order];
}

//arrancamos el servidor web a la escucha de peticiones y lo mostramos por terminal.
server.listen(port, host);
console.log(`Servidor a la escucha en ${host}:${port}`);