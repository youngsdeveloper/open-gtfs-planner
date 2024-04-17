import { MenuItemConstructorOptions } from "electron";

const { Menu } = require('electron')
const { selectDirectory } = require('./controllers/gtfsImporterController');

function buildMenu(window){

  const isMac = process.platform === 'darwin'

  const templateMenu:MenuItemConstructorOptions[] = [
    {
        label: 'Archivo',
        submenu: [
          {
            label: "Importar GTFS",
            click: async () => {
              selectDirectory(window)
            }
    
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
  const menu = Menu.buildFromTemplate(templateMenu)
  return menu;
}

module.exports = {
  buildMenu
};
