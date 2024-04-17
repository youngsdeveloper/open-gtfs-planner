import {dialog} from "electron";
import {readFileSync} from "fs"
import Papa from 'papaparse';


function selectDirectory(window) {
    return  dialog
      .showOpenDialog(window,{
        properties: ['openDirectory'],
        title: "Selecciona una carpeta para importar GTFS"
      })
      .then(result => {
        if (!result.canceled && result.filePaths.length > 0) {

          const path = result.filePaths[0];
          
          parseAgency(path);
        }
        })
       .catch(err => {
          dialog.showErrorBox("Error al importar GTFS", "Ha ocurrido un error al seleccionar la ruta. Error: " + err)
        });
}

function parseAgency(path){
  const string_output = readFileSync(`${path}/agency.txt`, 'utf8');

  Papa.parse(string_output, {
    header: true,
    complete: function(results) {
      console.log(results);
    }
  })
  

}

module.exports = {
    selectDirectory
};