const { model, Schema } = require('mongoose');

const osSchema = new Schema({
  
  dataEntrada: {
    type: Date,
    default: Date.now
  },
  dataSaida: {
    type: Date
  },

  
  cliente: {
    id: {
      type: Schema.Types.ObjectId,
      ref: 'Cliente',
      required: true
    },
    nome: String,
    telefone: String
  },

  
  eletrodomestico: String,     
  marca: String,               
  modelo: String,
  numeroSerie: String,
  acessorios: String,          

  
  problemaRelatado: String,    
  diagnostico: String,         
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

  
  pecasUtilizadas: [String],   
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

  
  garantia: String,            
  tecnicoResponsavel: String,
  observacoes: String,
  clienteAprovou: {
    type: Boolean,
    default: false
  }

}, { versionKey: false });

module.exports = model('OS', osSchema);
