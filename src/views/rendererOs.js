const input = document.getElementById('inputSearchClient')
const suggestionList = document.getElementById('viewListSuggestion')
let idClient = document.getElementById('inputIdClient')
let nameClient = document.getElementById('inputNameClient')
let phoneClient = document.getElementById('inputPhoneClient')

let arrayClients = []

input.addEventListener('input', () => {
    const search = input.value.toLowerCase()
    suggestionList.innerHTML = ""

    api.searchClients()

    api.listClients((event, clients) => {
        arrayClients = JSON.parse(clients)

        const results = arrayClients.filter(c =>
            c.nomeCliente && c.nomeCliente.toLowerCase().includes(search)
        ).slice(0, 10)

        suggestionList.innerHTML = ""

        results.forEach(c => {
            const item = document.createElement('li')
            item.classList.add('list-group-item', 'list-group-item-action')
            item.textContent = c.nomeCliente

            item.addEventListener('click', () => {
                idClient.value = c._id
                nameClient.value = c.nomeCliente
                phoneClient.value = c.foneCliente
                input.value = ""
                suggestionList.innerHTML = ""
            })

            suggestionList.appendChild(item)
        })
    })
})

api.setSearch(() => {
    input.focus()
})

document.addEventListener('click', (e) => {
    if (!input.contains(e.target) && !suggestionList.contains(e.target)) {
        suggestionList.innerHTML = ""
    }
})

document.addEventListener('DOMContentLoaded', () => {
    btnUpdate.disabled = true
    btnDelete.disabled = true
})

// Pegando botões
const btnCreate = document.getElementById('btnCreate')
const btnUpdate = document.getElementById('btnUpdate')
const btnDelete = document.getElementById('btnDelete')

// Pegando inputs do formulário (somente os que existem no HTML)
const frmOS = document.getElementById('frmOS')
const idOS = document.getElementById('inputOS')
const dateOS = document.getElementById('inputDataEntrada')
const statusOS = document.getElementById('inputStatus')
const eletro = document.getElementById('inputEletro')
const marca = document.getElementById('inputMarca')
const modelo = document.getElementById('inputModelo')
const serie = document.getElementById('inputSerie')
const acessorios = document.getElementById('inputAcessorios')
const problem = document.getElementById('inputProblema')
const diagnostico = document.getElementById('inputDiagnostico')
const pecas = document.getElementById('inputPecas')
const maoDeObra = document.getElementById('inputMaoDeObra')
const valorPecas = document.getElementById('inputValorPecas')
const valorTotal = document.getElementById('inputValorTotal')
const pagamento = document.getElementById('inputPagamento')
const garantia = document.getElementById('inputGarantia')
const tecnico = document.getElementById('inputTecnico')
const obs = document.getElementById('inputObs')
const aprovado = document.getElementById('inputAprovado')

function resetForm() {
    location.reload()
}

api.resetForm(() => {
    resetForm()
})

function criarOS() {
    const os = {
        clienteId: idClient.value,
        clienteNome: nameClient.value,
        clienteTelefone: phoneClient.value,
        eletrodomestico: eletro.value,
        marca: marca.value,
        modelo: modelo.value,
        numeroSerie: serie.value,
        acessorios: acessorios.value,
        problemaRelatado: problem.value,
        diagnostico: diagnostico.value,
        statusOS: statusOS.value,
        pecasUtilizadas: pecas.value,
        maoDeObra: maoDeObra.value,
        valorPecas: valorPecas.value,
        valorTotal: valorTotal.value,
        formaPagamento: pagamento.value,
        garantia: garantia.value,
        tecnicoResponsavel: tecnico.value,
        observacoes: obs.value,
        clienteAprovou: aprovado.checked
    }

    api.newOS(os)
}

function atualizarOS() {
    const osEditada = {
        _id: idOS.value,
        clienteId: idClient.value,
        clienteNome: nameClient.value,
        clienteTelefone: phoneClient.value,
        eletrodomestico: eletro.value,
        marca: marca.value,
        modelo: modelo.value,
        numeroSerie: serie.value,
        acessorios: acessorios.value,
        problemaRelatado: problem.value,
        diagnostico: diagnostico.value,
        statusOS: statusOS.value,
        pecasUtilizadas: pecas.value,
        maoDeObra: maoDeObra.value,
        valorPecas: valorPecas.value,
        valorTotal: valorTotal.value,
        formaPagamento: pagamento.value,
        garantia: garantia.value,
        tecnicoResponsavel: tecnico.value,
        observacoes: obs.value,
        clienteAprovou: aprovado.checked
    }

    api.updateOS(osEditada)
}

function removeOS() {
    api.deleteOS(idOS.value)
}

function findOS() {
    api.searchOS()
}

api.renderOS((event, dataOS) => {
    if (!dataOS) {
        console.error("Dados da OS vieram vazios ou indefinidos");
        alert("OS não encontrada ou erro ao buscar.");
        return;
    }

    try {
        const os = JSON.parse(dataOS);

        idOS.value = os._id;

        dateOS.value = new Date(os.dataEntrada).toLocaleString("pt-BR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit"
        });

        // Corrigido de acordo com seu schema
        idClient.value = os.cliente?.id || "";
        nameClient.value = os.cliente?.nome || "";
        phoneClient.value = os.cliente?.telefone || "";

        statusOS.value = os.statusOS || "";

        // Correções de nomes
        eletro.value = os.eletrodomestico || "";
        marca.value = os.marca || "";
        modelo.value = os.modelo || "";
        serie.value = os.numeroSerie || "";
        acessorios.value = os.acessorios || "";
        problem.value = os.problemaRelatado || "";
        diagnostico.value = os.diagnostico || "";
        pecas.value = (os.pecasUtilizadas || []).join(", "); // array → string
        maoDeObra.value = os.maoDeObra || 0;
        valorPecas.value = os.valorPecas || 0;
        valorTotal.value = os.valorTotal || 0;
        pagamento.value = os.formaPagamento || "";
        garantia.value = os.garantia || "";
        tecnico.value = os.tecnicoResponsavel || "";
        obs.value = os.observacoes || "";
        aprovado.checked = !!os.clienteAprovou;

        btnCreate.disabled = true;
        btnUpdate.disabled = false;
        btnDelete.disabled = false;

    } catch (error) {
        console.error("Erro ao processar OS:", error);
        alert("Erro ao carregar dados da OS.");
    }
});


  
frmOS.addEventListener('submit', (event) => {
    event.preventDefault()

    if (!idClient.value) {
        api.validateClient()
        return
    }

    if (!idOS.value) {
        criarOS()
    } else {
        atualizarOS()
    }
})

const btnPrintOS = document.getElementById('btnPrintOS')
btnPrintOS.addEventListener('click', () => {
    if (!idOS.value) {
        alert("Nenhuma OS carregada para imprimir!")
        return
    }
    imprimirOS()
})

function imprimirOS() {
    const conteudo = `
        <html>
        <head>
            <title>Ordem de Serviço - ${idOS.value}</title>
            <style>
                body {
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    margin: 40px;
                    color: #333;
                }

                h1 {
                    text-align: center;
                    font-size: 28px;
                    margin-bottom: 20px;
                    color: #005B8F;
                }

                .os-container {
                    border: 2px solid #005B8F;
                    padding: 20px;
                    border-radius: 8px;
                }

                .section {
                    margin-bottom: 25px;
                    padding-bottom: 10px;
                    border-bottom: 1px dashed #aaa;
                }

                .section:last-child {
                    border-bottom: none;
                }

                .label {
                    font-weight: 600;
                    color: #333;
                    display: inline-block;
                    width: 180px;
                }

                .value {
                    color: #444;
                }

                .termos {
                    font-size: 11px;
                    line-height: 1.6;
                    margin-top: 40px;
                    border-top: 1px dashed #aaa;
                    padding-top: 20px;
                }

                .termos h3 {
                    font-size: 14px;
                    color: #005B8F;
                    margin-bottom: 8px;
                }
            </style>
        </head>
        <body>
            <h1>Ordem de Serviço - EletroSeguro</h1>

            <div class="section">
                <div><span class="label">Número OS:</span> ${idOS.value}</div>
                <div><span class="label">Data de Entrada:</span> ${dateOS.value}</div>
                <div><span class="label">Status:</span> ${statusOS.value}</div>
            </div>

            <div class="section">
                <div><span class="label">Cliente:</span> ${nameClient.value}</div>
                <div><span class="label">Telefone:</span> ${phoneClient.value}</div>
            </div>

            <div class="section">
                <div><span class="label">Equipamento:</span> ${eletro.value}</div>
                <div><span class="label">Marca:</span> ${marca.value}</div>
                <div><span class="label">Modelo:</span> ${modelo.value}</div>
                <div><span class="label">Nº de Série:</span> ${serie.value}</div>
                <div><span class="label">Acessórios:</span> ${acessorios.value}</div>
            </div>

            <div class="section">
                <div><span class="label">Problema Relatado:</span> ${problem.value}</div>
                <div><span class="label">Diagnóstico Técnico:</span> ${diagnostico.value}</div>
            </div>

            <div class="section">
                <div><span class="label">Peças Utilizadas:</span> ${pecas.value}</div>
                <div><span class="label">Mão de Obra:</span> R$ ${parseFloat(maoDeObra.value).toFixed(2)}</div>
                <div><span class="label">Valor das Peças:</span> R$ ${parseFloat(valorPecas.value).toFixed(2)}</div>
                <div><span class="label">Valor Total:</span> R$ ${parseFloat(valorTotal.value).toFixed(2)}</div>
                <div><span class="label">Forma de Pagamento:</span> ${pagamento.value}</div>
            </div>

            <div class="section">
                <div><span class="label">Garantia:</span> ${garantia.value}</div>
                <div><span class="label">Técnico Responsável:</span> ${tecnico.value}</div>
                <div><span class="label">Observações:</span> ${obs.value}</div>
                <div><span class="label">Aprovado pelo Cliente:</span> ${aprovado.checked ? 'Sim' : 'Não'}</div>
            </div>

            <div style="text-align:center; margin-top: 50px;">
                <p>Assinatura do Cliente: ___________________________</p>
            </div>

            <div class="termos">
                <h3>Termo de Serviço e Garantia</h3>
                <p>O serviço descrito nesta ordem de serviço foi executado conforme as especificações fornecidas pelo cliente. A garantia cobre exclusivamente defeitos de serviço ou falhas atribuídas ao serviço prestado, não se estendendo a problemas decorrentes de mau uso ou danos posteriores.</p>
                <p>O prazo de garantia é de <strong>${garantia.value || '90 dias'}</strong> contados a partir da conclusão do serviço.</p>
                <p>Ao assinar este documento, o cliente declara estar ciente e de acordo com os termos acima.</p>
            </div>
        </body>
        </html>
    `;

    const janelaPrint = window.open('', '', 'width=800,height=600');
    janelaPrint.document.write(conteudo);
    janelaPrint.document.close();
    janelaPrint.focus();
    janelaPrint.print();
    janelaPrint.close();
}
