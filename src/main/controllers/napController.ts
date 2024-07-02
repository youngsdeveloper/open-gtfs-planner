import { writeFile } from 'fs/promises';
const { importGTFS } = require('./gtfsImporterController');

async function listGtfsFromNap(window){
    
    // URL del endpoint
    const url = 'https://nap.mitma.es/api/Fichero/GetList';

    // Configuración de la petición
    const requestOptions = {
        method: 'GET', // Método HTTP GET
        headers: {
            'Content-Type': 'application/json', // Tipo de contenido esperado
            'ApiKey': process.env.API_KEY_NAP_MITMA!!
        }
    };

    // Realización de la petición usando fetch
    const response = await fetch(url, requestOptions)
    const data = await response.json();
    window.webContents.send("nap_mitma_data",data);
}

async function downloadGtfsFromNap(window, name, fileId){

    window.webContents.send('start-loading-gtfs');

    // URL del endpoint
    const url = `https://nap.mitma.es/api/Fichero/download/${fileId}`;

    // Configuración de la petición
    const requestOptions = {
        method: 'GET', // Método HTTP GET
        headers: {
            'ApiKey': process.env.API_KEY_NAP_MITMA!!
        }
    };
    const respuesta = await fetch(url, requestOptions);

    // Verificamos el código de respuesta HTTP
    if (!respuesta.ok) {
      throw new Error(`Error al descargar el archivo. Código de respuesta: ${respuesta.status}`);
    }

    // Leemos el contenido de la respuesta como un buffer
    const buffer = await respuesta.arrayBuffer();

    // Convertimos el buffer a un Buffer de Node.js
    const bufferNode = Buffer.from(buffer);


    const _name = name.replace(/\s/g, '') + "-"+fileId
    // Escribimos el buffer en el archivo de destino
    const filename = `gtfs/${_name}.zip`;

    const path = require('path');

    const target = path.resolve(`./gtfs/${_name}`);

    console.log(target)
    await writeFile(filename, bufferNode);
    
    const extract = require('extract-zip')
    await extract(filename, { dir: target })

    await importGTFS(window, target)

}

module.exports = {
    listGtfsFromNap,
    downloadGtfsFromNap
}