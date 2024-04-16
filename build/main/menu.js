"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { Menu } = require('electron');
const isMac = process.platform === 'darwin';
const templateMenu = [
    {
        label: 'Archivo',
        submenu: [
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
module.exports = menu;
