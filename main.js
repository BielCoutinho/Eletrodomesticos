const { app, BrowserWindow, nativeTheme, Menu, ipcMain, dialog, shell } = require('electron');
const mongoose = require('mongoose');
const path = require('node:path');
const { conectar, desconectar } = require("./database.js");
const clientModel = require("./src/models/Clientes.js");
const osModel = require('./src/models/Os.js');
const { jspdf, default: jsPDF } = require('jspdf')
const fs = require('fs');
const prompt = require('electron-prompt')
let win;




const createWindow = () => {
  nativeTheme.themeSource = 'dark';
  win = new BrowserWindow({
    width: 1010,
    height: 720,
    resizable: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });
  Menu.setApplicationMenu(Menu.buildFromTemplate(template))

  

  win.loadFile(path.join(__dirname, 'src', 'views', 'index.html'));

  ipcMain.on('client-window', () => {
    clienteWindow();
  });

  ipcMain.on('os-window', () => {
    osWindow();
  });
};

let client
function clienteWindow() {
    nativeTheme.themeSource = 'dark'
    const main = BrowserWindow.getFocusedWindow()
    if (main) {
        client = new BrowserWindow({
            width: 1010,
            height: 650,
            autoHideMenuBar: true,
            resizable: false,
            parent: main,
            modal: true,
            webPreferences: {
                preload: path.join(__dirname, 'preload.js'),
                contextIsolation: true,
                nodeIntegration: false
            }
        })
    }
    client.loadFile(path.join(__dirname, 'src', 'views', 'cliente.html'))
    client.center()

}

let osScreen
function osWindow() {
    nativeTheme.themeSource = 'dark'
    const main = BrowserWindow.getFocusedWindow()
    if (main) {
        osScreen = new BrowserWindow({
            width: 1010,
            height: 650,
            autoHideMenuBar: true,
            resizable: false,
            parent: main,
            modal: true,
            webPreferences: {
                preload: path.join(__dirname, 'preload.js'),
                contextIsolation: true,
                nodeIntegration: false
            }
        })
    }
    osScreen.loadFile(path.join(__dirname, 'src', 'views', 'os.html'))
    osScreen.center()
}

let about
function aboutWindow() {
    nativeTheme.themeSource = 'dark'
    const main = BrowserWindow.getFocusedWindow()
    if (main) {
        about = new BrowserWindow({
            width: 800,
            height: 550,
            autoHideMenuBar: true,
            resizable: false,
            minimizable: false,
            parent: main,
            modal: true,
            webPreferences: {
                preload: path.join(__dirname, 'preload.js'),
                contextIsolation: true,
                nodeIntegration: false
            }
        })
    }

    about.loadFile(path.join(__dirname, 'src', 'views', 'sobre.html'))
}



app.whenReady().then(() => {
  createWindow();

  ipcMain.on('db-connect', async (event) => {
    await conectar()
    setTimeout(() => {
        event.reply('db-status', "conectado")
    }, 500)
})

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow()
    }
})
})

app.on('window-all-closed', () => {
if (process.platform !== 'darwin') {
    app.quit()
}
})

app.on('before-quit', async () => {
await desconectar()
})

app.commandLine.appendSwitch('log-level', '3')


const template = [
    {
        label: 'Cadastro',
        submenu: [
            {
                label: 'Clientes',
                click: () => clienteWindow()
            },
            {
                label: 'OS',
                click: () => osWindow()
            },
            {
                type: 'separator'
            },
            {
                label: 'Sair',
                accelerator: 'Alt+F4',
                click: () => app.quit()
            }
        ]
    },
    {
        label: 'Relatório',
        submenu: [
            {
                label: 'Clientes',
                click: () => relatorioClientes()
            },
            
            {
                label: 'Todas as OS',
                click: () => relatorioTodasOS()
            }
        ]
    },
    {
        label: 'Ferramentas',
        submenu: [
            {
                label: 'Aplicar zoom',
                role: 'zoomIn'
            },
            {
                label: 'Reduzir zoom',
                role: 'zoomOut'
            },
            {
                label: 'Restaurar zoom padrão',
                role: 'resetZoom'
            },
            {
                type: 'separator'
            },
            {
                label: 'Recarregar',
                role: 'reload'
            },
            {
                label: 'DevTools',
                role: 'toggleDevTools'
            }
        ]
    },
    {
        label: 'Ajuda',
        submenu: [
            {
                label: 'Repositório',
                click: () => shell.openExternal('https://github.com/BielCoutinho/Eletrodomesticos.git')
            },
            {
                label: 'Sobre',
                click: () => aboutWindow()
            }
        ]
    }
]

async function relatorioClientes() {
    try {
      const clientes = await clientModel.find().sort({ nomeCliente: 1 })
      const doc = new jsPDF('l', 'mm', 'a4')
  
      const imagePath = path.join(__dirname, 'src', 'public', 'img', 'logo.png')
      const imageBase64 = fs.readFileSync(imagePath, { encoding: 'base64' })
      doc.addImage(imageBase64, 'PNG', 5, 8, 40, 20)
  
      doc.setFontSize(24)
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(0, 0, 80)
      doc.text('Relatório de Clientes', 60, 30)
  
      doc.setFontSize(12)
      doc.setTextColor(100)
      doc.setFont('helvetica', 'normal')
      doc.text(`Data: ${new Date().toLocaleDateString('pt-BR')}`, 270, 15, { align: 'right' })
  
      
      let y = 50
      doc.setFillColor(0, 123, 255)
      doc.rect(5, y - 8, 285, 10, 'F')
  
      doc.setTextColor(255, 255, 255)
      doc.setFontSize(12)
      doc.setFont('helvetica', 'bold')
      doc.text("Nome", 10, y)
      doc.text("Telefone", 100, y)
      doc.text("Email", 180, y)
  
      y += 4
      doc.setDrawColor(0, 123, 255)
      doc.setLineWidth(0.7)
      doc.line(5, y + 2, 290, y + 2)
      y += 10
  
      
      clientes.forEach((c, index) => {
        if (y > 180) {
          doc.addPage()
          y = 20
          
          doc.setFillColor(0, 123, 255)
          doc.rect(5, y - 8, 285, 10, 'F')
          doc.setTextColor(255, 255, 255)
          doc.setFont('helvetica', 'bold')
          doc.setFontSize(12)
          doc.text("Nome", 10, y)
          doc.text("Telefone", 100, y)
          doc.text("Email", 180, y)
          y += 12
          doc.setDrawColor(0, 123, 255)
          doc.line(5, y - 2, 290, y - 2)
        }
  
        const linhaIndex = Math.floor((y - 60) / 10)
        doc.setFillColor(linhaIndex % 2 === 0 ? 230 : 245, 240, 255)
        doc.rect(5, y - 7, 285, 8, 'F')
  
        doc.setTextColor(0, 0, 0)
        doc.setFont('helvetica', 'normal')
        doc.setFontSize(10)
        doc.text(String(c.nomeCliente || '').substring(0, 40), 10, y)
        doc.text(String(c.foneCliente || '').substring(0, 20), 100, y)
        doc.text(String(c.emailCliente || '').substring(0, 35), 180, y)
        y += 10
      })
  
      const totalPages = doc.internal.getNumberOfPages()
      for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i)
        doc.setDrawColor(0, 123, 255)
        doc.setLineWidth(0.7)
        doc.line(5, 195, 290, 195)
        doc.setFontSize(10)
        doc.setTextColor(100)
        doc.text(`Página ${i} de ${totalPages}`, 150, 200, { align: 'center' })
      }
  
      const tempDir = app.getPath('temp')
      const filePath = path.join(tempDir, 'clientes.pdf')
      doc.save(filePath)
      shell.openPath(filePath)
    } catch (error) {
      console.log(error)
    }
  }
  

ipcMain.on('search-suggestions', async (event, termo) => {
    try {
        const regex = new RegExp(termo, 'i')
        let sugestoes = await clientModel.find({
            $or: [
                { nomeCliente: regex },
                { cpfCliente: regex }
            ]
        }).limit(10)

        sugestoes = sugestoes.sort((a, b) => a.nomeCliente.localeCompare(b.nomeCliente))

        event.reply('suggestions-found', JSON.stringify(sugestoes))
    } catch (error) {
        console.error("Erro ao buscar sugestões:", error)
    }
})


ipcMain.on('new-client', async (event, client) => {
    try {
        const newClient = new clientModel({
            nomeCliente: client.nameCli,
            cpfCliente: client.cpfCli,
            emailCliente: client.emailCli,
            foneCliente: client.foneCli,
            cepCliente: client.cepCli,
            logradouroCliente: client.logCli,
            numeroCliente: client.numCli,
            complementoCliente: client.complementoCli,
            bairroCliente: client.bairroCli,
            cidadeCliente: client.cidadeCli,
            ufCliente: client.ufCli
        })
        await newClient.save()

        dialog.showMessageBox({
            type: 'info',
            title: "Aviso",
            message: "Cliente adicionado com sucesso",
            buttons: ['OK']
        }).then((result) => {
            if (result.response === 0) {
                event.reply('reset-form')
            }
        })

    } catch (error) {
        if (error.code === 11000) {
            dialog.showMessageBox({
                type: 'error',
                title: "ATENÇÃO!",
                message: "CPF já cadastrado. \n Verfique o número digitado.",
                buttons: ['OK']
            }).then((result) => {
                if (result.response === 0) {
                    event.reply('reset-cpf')
                }
            })
        } else {
            console.log(error)
        }
    }

})

ipcMain.on('search-name', async (event, cliValor) => {

    try {
        const valor = cliValor.trim()
        const cpfRegex = /^\d{11}$/

        const query = cpfRegex.test(valor.replace(/\D/g, ''))
            ? { cpfCliente: new RegExp(valor, 'i') }
            : { nomeCliente: new RegExp(valor, 'i') }

        const client = await clientModel.find(query)

        if (client.length === 0) {
            dialog.showMessageBox({
                type: 'warning',
                title: 'Aviso',
                message: 'Cliente não cadastrado. \nDeseja cadastrar este cliente?',
                defaultId: 0,
                buttons: ['Sim', 'Não']
            }).then((result) => {
                if (result.response === 0) {
                    event.reply('set-name')
                } else {
                    event.reply('reset-form')
                }
            })
        } else {
            event.reply('render-client', JSON.stringify(client))
        }
    } catch (error) {
        console.error("Erro ao buscar cliente:", error)
    }
})

ipcMain.on('update-clientes', async (event, dadosAtualizados) => {
    try {
        const cliente = await clientModel.findOne({ cpfCliente: dadosAtualizados.cpf })
        if (!cliente) {
            dialog.showMessageBox({
                type: 'error',
                title: 'Erro',
                message: 'O CPF não pode ser alterado! Para corrigir esse dado, exclua o cliente e cadastre novamente.',
                buttons: ['OK']
            })
            return
        }

        cliente.nomeCliente = dadosAtualizados.nome
        cliente.cpfCliente = dadosAtualizados.cpf
        cliente.emailCliente = dadosAtualizados.email
        cliente.foneCliente = dadosAtualizados.telefone
        cliente.cepCliente = dadosAtualizados.cep
        cliente.logradouroCliente = dadosAtualizados.logradouro
        cliente.numeroCliente = dadosAtualizados.numero
        cliente.complementoCliente = dadosAtualizados.complemento
        cliente.bairroCliente = dadosAtualizados.bairro
        cliente.cidadeCliente = dadosAtualizados.cidade
        cliente.ufCliente = dadosAtualizados.uf

        await cliente.save()

        dialog.showMessageBox({
            type: 'info',
            title: 'Sucesso',
            message: 'Cliente atualizado com sucesso!',
            buttons: ['OK']
        })

        event.reply('reset-form')

    } catch (error) {
        console.log(error)
        dialog.showMessageBox({
            type: 'error',
            title: 'Erro',
            message: 'Ocorreu um erro ao atualizar o cliente.',
            buttons: ['OK']
        })
    }
})

ipcMain.on('delete-client', async (event, cpf) => {
    try {
        const resultado = await clientModel.deleteOne({ cpfCliente: cpf })
        if (resultado.deletedCount > 0) {
            dialog.showMessageBox({
                type: 'info',
                title: 'Exclusão concluída',
                message: 'Cliente excluído com sucesso!'
            })
            event.reply('reset-form')
        } else {
            dialog.showMessageBox({
                type: 'warning',
                title: 'Erro',
                message: 'Cliente não encontrado para exclusão.'
            })
        }
    } catch (erro) {
        console.log(erro)
        dialog.showErrorBox('Erro ao excluir cliente', erro.message)
    }
})


ipcMain.on('search-clients', async (event) => {
    try {
        const clients = await clientModel.find().sort({ nomeCliente: 1 })
        event.reply('list-clients', JSON.stringify(clients))
    } catch (error) {
        console.log(error)
    }
})


ipcMain.on('validate-client', (event) => {
    dialog.showMessageBox({
        type: 'warning',
        title: "Aviso!",
        message: "É obrigatório vincular o cliente na ordem de serviço",
        buttons: ['OK']
    }).then((result) => {
        if (result.response === 0) {
            event.reply('set-search')
        }
    })
})

ipcMain.on('new-os', async (event, os) => {
    try {
      const newOS = new osModel({
        cliente: {
          id: os.clienteId,
          nome: os.clienteNome,
          telefone: os.clienteTelefone
        },
        eletrodomestico: os.eletrodomestico,
        marca: os.marca,
        modelo: os.modelo,
        numeroSerie: os.numeroSerie,
        acessorios: os.acessorios,
        problemaRelatado: os.problemaRelatado,
        diagnostico: os.diagnostico,
        statusOS: os.statusOS,
        pecasUtilizadas: os.pecasUtilizadas,
        maoDeObra: os.maoDeObra,
        valorPecas: os.valorPecas,
        valorTotal: os.valorTotal,
        formaPagamento: os.formaPagamento,
        garantia: os.garantia,
        tecnicoResponsavel: os.tecnicoResponsavel,
        observacoes: os.observacoes,
        clienteAprovou: os.clienteAprovou
      })
  
      await newOS.save()
  
      dialog.showMessageBox({
        type: 'info',
        title: 'Aviso',
        message: 'OS criada com sucesso!',
        buttons: ['OK']
      }).then((result) => {
        if (result.response === 0) {
          event.reply('reset-form') 
        }
      })
    } catch (error) {
      console.error(error)
      dialog.showErrorBox('Erro ao salvar OS', error.message)
    }
  })
  
  ipcMain.on('search-os', async (event) => {
    prompt({
      title: 'Buscar OS',
      label: 'Digite o número da OS:',
      inputAttrs: { type: 'text' },
      type: 'input',
      width: 400,
      height: 200
    }).then(async (result) => {
      if (result !== null && mongoose.Types.ObjectId.isValid(result)) {
        try {
          const dataOS = await osModel.findById(result);

          console.log("Resultado do banco de dados:", dataOS); 
          if (dataOS) {
            event.reply('render-os', JSON.stringify(dataOS));
          } else {
            dialog.showMessageBox({
              type: 'warning',
              title: "Aviso!",
              message: "OS não encontrada.",
              buttons: ['OK']
            });
            event.reply('render-os', null); 
          }
        } catch (error) {
          console.error("Erro ao buscar OS no banco de dados:", error);
          dialog.showMessageBox({
            type: 'error',
            title: "Erro!",
            message: "Erro ao buscar OS no banco de dados.",
            buttons: ['OK']
          });
          event.reply('render-os', null); 
        }
      } else if (result !== null) {
        dialog.showMessageBox({
          type: 'error',
          title: "Atenção!",
          message: "Formato do número da OS inválido.\nVerifique e tente novamente.",
          buttons: ['OK']
        });
        event.reply('render-os', null); 
      }
    });
  });
  
  ipcMain.on('update-os', async (event, os) => {
    try {
      if (!os._id || !mongoose.Types.ObjectId.isValid(os._id)) {
        dialog.showErrorBox('Erro', 'ID da OS inválido ou não informado.')
        return
      }
  
      const atualizada = await osModel.findByIdAndUpdate(
        os._id,
        {
          cliente: {
            id: os.clienteId,
            nome: os.clienteNome,
            telefone: os.clienteTelefone
          },
          eletrodomestico: os.eletrodomestico,
          marca: os.marca,
          modelo: os.modelo,
          numeroSerie: os.numeroSerie,
          acessorios: os.acessorios,
          problemaRelatado: os.problemaRelatado,
          diagnostico: os.diagnostico,
          statusOS: os.statusOS,
          pecasUtilizadas: os.pecasUtilizadas,
          maoDeObra: os.maoDeObra,
          valorPecas: os.valorPecas,
          valorTotal: os.valorTotal,
          formaPagamento: os.formaPagamento,
          garantia: os.garantia,
          tecnicoResponsavel: os.tecnicoResponsavel,
          observacoes: os.observacoes,
          clienteAprovou: os.clienteAprovou
        },
        { new: true }
      )
  
      dialog.showMessageBox({
        type: 'info',
        title: 'Aviso',
        message: 'OS atualizada com sucesso!',
        buttons: ['OK']
      }).then((result) => {
        if (result.response === 0) {
          event.reply('reset-form')
        }
      })
    } catch (error) {
      console.log(error)
      dialog.showErrorBox('Erro ao atualizar OS', error.message)
    }
  })
  
  

  ipcMain.on('delete-os', async (event, idOS) => {
    try {
      const { response } = await dialog.showMessageBox({
        type: 'warning',
        title: "Atenção!",
        message: "Deseja excluir esta ordem de serviço?\nEsta ação não poderá ser desfeita.",
        buttons: ['Cancelar', 'Excluir']
      })
      if (response === 1) {
        await osModel.findByIdAndDelete(idOS)
        event.reply('reset-form')
      }
    } catch (error) {
      console.log(error)
    }
  })
  

  function desenharCabecalhoRelatorio(doc, yInicial = 60, mostrarStatus = true) {
    doc.setFillColor(0, 123, 255)
    doc.rect(5, yInicial - 8, 285, 10, 'F')
  
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(12)
    doc.setFont('helvetica', 'bold')
    doc.text("Nº OS", 10, yInicial)
    doc.text("Cliente", 35, yInicial)
    doc.text("Telefone", 95, yInicial)
    doc.text("Equipamento", 145, yInicial)
    doc.text("Problema", 195, yInicial)
    if (mostrarStatus) doc.text("Status", 240, yInicial)
        doc.text("Valor", 280, yInicial, { align: 'right' })
    doc.setTextColor(0, 0, 0)
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(10)
  
    doc.setDrawColor(0, 123, 255)
    doc.setLineWidth(0.7)
    doc.line(5, yInicial + 2, 290, yInicial + 2)
  
    return yInicial + 12
  }
  
  
  function formatarValor(valorStr) {
    const numero = Number(valorStr?.toString().replace(/\./g, '').replace(',', '.')) || 0
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(numero)
  }
  
  async function relatorioOSporStatus(statusDesejado, tituloRelatorio, nomeArquivo) {
    try {
      const osFiltradas = await osModel.find({ statusOS: statusDesejado }).sort({ dataEntrada: -1 })
  
      const doc = new jsPDF('l', 'mm', 'a4')
      const imagePath = path.join(__dirname, 'src', 'public', 'img', 'logo.png')
      const imageBase64 = fs.readFileSync(imagePath, { encoding: 'base64' })
      doc.addImage(imageBase64, 'PNG', 5, 8, 40, 20)
  
      doc.setFontSize(24)
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(0, 0, 80)
      doc.text(`Relatório de OS - ${tituloRelatorio}`, 60, 30)
  
      doc.setFontSize(12)
      doc.setTextColor(100)
      doc.setFont('helvetica', 'normal')
      doc.text(`Data: ${new Date().toLocaleDateString('pt-BR')}`, 270, 15, { align: 'right' })
  
      let baseY = 50
      let y = desenharCabecalhoRelatorio(doc, baseY, false)
  
      osFiltradas.forEach((o) => {
        if (y > 180) {
          doc.addPage()
          baseY = 20
          y = desenharCabecalhoRelatorio(doc, baseY, false)
        }
  
        const linhaIndex = Math.floor((y - baseY) / 10)
        doc.setFillColor(linhaIndex % 2 === 0 ? 230 : 245, linhaIndex % 2 === 0 ? 240 : 245, linhaIndex % 2 === 0 ? 255 : 245)
        doc.rect(5, y - 7, 285, 8, 'F')
  
        doc.setTextColor(0, 0, 0)
        doc.text(String(o._id).slice(-6), 10, y)
        doc.text((o.cliente?.nome || '').substring(0, 25), 35, y)
        doc.text((o.cliente?.telefone || '').substring(0, 15), 95, y)
        doc.text((o.eletrodomestico || '').substring(0, 20), 145, y)
        doc.text((o.problemaRelatado || '').substring(0, 30), 195, y)
        doc.text(formatarValor(o.valorTotal || '0'), 280, y, { align: 'right' }) 
      })
  
      const paginas = doc.internal.getNumberOfPages()
      for (let i = 1; i <= paginas; i++) {
        doc.setPage(i)
        doc.setDrawColor(0, 123, 255)
        doc.setLineWidth(0.7)
        doc.line(5, 195, 290, 195)
        doc.setFontSize(10)
        doc.setTextColor(100)
        doc.text(`Página ${i} de ${paginas}`, 150, 200, { align: 'center' })
      }
  
      const tempDir = app.getPath('temp')
      const filePath = path.join(tempDir, `${nomeArquivo}.pdf`)
      doc.save(filePath)
      shell.openPath(filePath)
    } catch (error) {
      console.log(error)
    }
  }
  
  
  async function relatorioTodasOS() {
    try {
      const osList = await osModel.find().sort({ dataEntrada: -1 })
  
      const doc = new jsPDF('l', 'mm', 'a4')
      const imagePath = path.join(__dirname, 'src', 'public', 'img', 'logo2.png')
      const imageBase64 = fs.readFileSync(imagePath, { encoding: 'base64' })
      doc.addImage(imageBase64, 'PNG', 5, 8, 40, 20)
  
      doc.setFontSize(24)
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(0, 0, 80)
      doc.text(`Relatório Geral de Ordens de Serviço`, 60, 30)
  
      doc.setFontSize(12)
      doc.setTextColor(100)
      doc.setFont('helvetica', 'normal')
      doc.text(`Data: ${new Date().toLocaleDateString('pt-BR')}`, 270, 15, { align: 'right' })
  
      let baseY = 50
      let y = desenharCabecalhoRelatorio(doc, baseY, true)
  
      osList.forEach((o) => {
        if (y > 180) {
          doc.addPage()
          baseY = 20
          y = desenharCabecalhoRelatorio(doc, baseY, true)
        }
  
        const linhaIndex = Math.floor((y - baseY) / 10)
        doc.setFillColor(linhaIndex % 2 === 0 ? 230 : 245, linhaIndex % 2 === 0 ? 240 : 245, linhaIndex % 2 === 0 ? 255 : 245)
        doc.rect(5, y - 7, 285, 8, 'F')
  
        doc.setTextColor(0, 0, 0)
        doc.text(String(o._id).slice(-6), 10, y)
        doc.text((o.cliente?.nome || '').substring(0, 25), 35, y)
        doc.text((o.cliente?.telefone || '').substring(0, 15), 95, y)
        doc.text((o.eletrodomestico || '').substring(0, 20), 145, y)
        doc.text((o.problemaRelatado || '').substring(0, 30), 195, y)
        doc.text((o.statusOS || '').substring(0, 15), 240, y)
        doc.text(formatarValor(o.valorTotal || '0'), 280, y, { align: 'right' })
        y += 10
      })
  
      const paginas = doc.internal.getNumberOfPages()
      for (let i = 1; i <= paginas; i++) {
        doc.setPage(i)
        doc.setDrawColor(0, 123, 255)
        doc.setLineWidth(0.7)
        doc.line(5, 195, 290, 195)
        doc.setFontSize(10)
        doc.setTextColor(100)
        doc.text(`Página ${i} de ${paginas}`, 150, 200, { align: 'center' })
      }
  
      const tempDir = app.getPath('temp')
      const filePath = path.join(tempDir, `os_todas.pdf`)
      doc.save(filePath)
      shell.openPath(filePath)
    } catch (error) {
      console.log(error)
    }
  }
  