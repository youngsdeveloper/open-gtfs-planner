"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const { Menu } = require('electron');
const { selectDirectory } = require('./controllers/gtfsImporterController');
function buildMenu(window) {
    const isMac = process.platform === 'darwin';
    const templateMenu = [
        {
            label: 'Archivo',
            submenu: [
                {
                    label: "Importar GTFS",
                    click: () => __awaiter(this, void 0, void 0, function* () {
                        selectDirectory(window);
                    })
                },
                isMac ? { role: 'close' } : { role: 'quit' }
            ]
        },
        {
            label: 'Editar',
            submenu: [
                isMac ? { role: 'close' } : { role: 'quit' }
            ]
        },
        {
            label: 'Vista',
            submenu: [
                isMac ? { role: 'close' } : { role: 'quit' },
                { role: 'toggleDevTools' } // Esta entrada habilita las herramientas de desarrollo
            ]
        },
        {
            label: 'Simulación',
            submenu: [
                isMac ? { role: 'close' } : { role: 'quit' }
            ]
        },
        {
            label: 'Ayuda',
            submenu: [
                isMac ? { role: 'close' } : { role: 'quit' }
            ]
        },
    ];
    const menu = Menu.buildFromTemplate(templateMenu);
    return menu;
}
module.exports = {
    buildMenu
};
