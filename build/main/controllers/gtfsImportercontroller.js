"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
function selectDirectory() {
    return electron_1.dialog
        .showOpenDialog({
        properties: ['openDirectory']
    })
        .then(result => {
        if (!result.canceled && result.filePaths.length > 0) {
            console.log('Directorio seleccionado:', result.filePaths[0]);
            // Aquí puedes hacer algo con el directorio seleccionado
        }
    })
        .catch(err => {
        console.error('Error al abrir el diálogo:', err);
    });
}
module.exports = {
    selectDirectory
};
