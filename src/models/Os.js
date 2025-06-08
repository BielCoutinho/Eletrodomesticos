const { model, Schema } = require('mongoose');

const osSchema = new Schema({
  // 🔹 Datas
  dataEntrada: {
    type: Date,
    default: Date.now
  },
  dataSaida: {
    type: Date
  },

  // 🔹 Dados do cliente
  cliente: {
    id: {
      type: Schema.Types.ObjectId,
      ref: 'Cliente',
      required: true
    },
    nome: String,
    telefone: String
  },

  // 🔹 Equipamento
  eletrodomestico: String,     // Ex: Geladeira, Máquina de lavar
  marca: String,               // Ex: Brastemp, Electrolux
  modelo: String,
  numeroSerie: String,
  acessorios: String,          // Ex: Cabo de força, controle

  // 🔹 Situação e problema
  problemaRelatado: String,    // Relato do cliente
  diagnostico: String,         // Diagnóstico técnico
  statusOS: {
    type: String,
    enum: [
      'Em análise',
      'Aguardando aprovação',
      'Aprovado',
      'Em execução',
      'Finalizado',
      'Entregue',
      'Cancelado'
    ],
    default: 'Em análise'
  },

  // 🔹 Serviços e materiais
  pecasUtilizadas: [String],   // Lista de peças trocadas
  maoDeObra: {
    type: Number,
    default: 0
  },
  valorPecas: {
    type: Number,
    default: 0
  },
  valorTotal: {
    type: Number,
    default: 0
  },
  formaPagamento: {
    type: String,
    enum: ['Dinheiro', 'Cartão', 'PIX', 'Transferência', 'Outro'],
    default: 'Dinheiro'
  },

  // 🔹 Informações adicionais
  garantia: String,            // Ex: 90 dias
  tecnicoResponsavel: String,
  observacoes: String,
  clienteAprovou: {
    type: Boolean,
    default: false
  }

}, { versionKey: false });

module.exports = model('OS', osSchema);
