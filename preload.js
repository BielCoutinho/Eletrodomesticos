const { contextBridge, ipcRenderer } = require('electron')

ipcRenderer.send('db-connect')

contextBridge.exposeInMainWorld('api', {
  clientWindow: () => ipcRenderer.send('client-window'),
  osWindow: () => ipcRenderer.send('os-window'),
  dbStatus: (message) => ipcRenderer.on('db-status', message),
  newClient: (client) => ipcRenderer.send('new-client', client),
  resetForm: (args) => ipcRenderer.on('reset-form', args),
  searchName: (name) => ipcRenderer.send('search-name', name),
  renderClient: (dataClient) => ipcRenderer.on('render-client', dataClient),
  validateSearch: () => ipcRenderer.send('validate-search'),
  setName: (args) => ipcRenderer.on('set-name', args),
  updateClientes: (cliente) => ipcRenderer.send('update-clientes', cliente),
  deleteClient: (cpf) => ipcRenderer.send('delete-client', cpf),
  buscarSugestoes: (valor) => ipcRenderer.send('search-suggestions', valor),
  retornarSugestoes: (callback) => ipcRenderer.on('suggestions-found', callback),
  searchClients: () => ipcRenderer.send('search-clients'),
  listClients: (callback) => ipcRenderer.on('list-clients', callback),
  searchOS: () => ipcRenderer.send('search-os'),
  validateClient: () => ipcRenderer.send('validate-client'),
  setSearch: (callback) => ipcRenderer.on('set-search', (event, args) => callback(args)),
  newOS: (os) => ipcRenderer.send('new-os', os),
  updateOS: (os) => ipcRenderer.send('update-os', os),
  deleteOS: (idOS) => ipcRenderer.send('delete-os', idOS),
  searchOS: () => ipcRenderer.send('search-os'),
  validateClient: () => ipcRenderer.send('validate-client'),
  
  // Listeners
  renderOS: (callback) => ipcRenderer.on('render-os', (event, dataOS) => callback(event, dataOS)),

  resetForm: (callback) => ipcRenderer.on('reset-form', () => callback()),
  setSearch: (callback) => ipcRenderer.on('set-search', (event, args) => callback(args))

})

contextBridge.exposeInMainWorld('electron', {
  sendMessage: (channel, data) => { ipcRenderer.send(channel, data) },
  onReceiveMessage: (channel, callback) => { ipcRenderer.on(channel, callback) }
})