# 🛠️🔌 EletroSeguro — Sua Assistência Técnica Digital para Eletrodomésticos!

👋 Olá, seja bem-vindo ao **EletroSeguro**, o sistema desktop criado para **facilitar a vida de técnicos e oficinas** que trabalham com conserto de eletrodomésticos!  
Desenvolvido por [**Gabriel "Biel" Coutinho**](https://github.com/BielCoutinho) ⚙️💙

---

## 🔍 O que é o EletroSeguro?

**EletroSeguro** é um sistema completo e moderno feito com **Electron**, **MongoDB** e **Node.js**, perfeito para gerenciar:

🔹 Clientes  
🔹 Ordens de Serviço  
🔹 Relatórios e Impressões  
🔹 Tudo com um visual 🔥 **dark mode estiloso** e com performance de primeira!

---

## ⚙️ Funcionalidades que fazem a diferença

🔧 **Cadastro Inteligente de Clientes**  
- Nome, CPF, telefone, endereço completo  
- Busca dinâmica por nome ou CPF

📄 **Ordens de Serviço Detalhadas**  
- Equipamento, defeito, peças usadas  
- Valores, garantia, técnico responsável  
- Editar, excluir e imprimir em segundos!

📊 **Relatórios Profissionais em PDF**  
- Visual moderno e organizado  
- Cabeçalho com cor e destaque  
- Pronto pra imprimir e entregar pro cliente! 🖨️

🖥️ **Visual limpo e bonito**  
- Tema escuro (#0d1117 + #58a6ff) inspirado nos sistemas técnicos reais  
- Interface intuitiva com menus de fácil acesso

---

## 🧰 Tecnologias por trás

| 🔌 Camada        | 🔍 Ferramenta                      |
|------------------|------------------------------------|
| Interface        | Electron, HTML, CSS, Bootstrap     |
| Backend          | Node.js, Mongoose, MongoDB         |
| PDF & Impressão  | jsPDF, `window.print()`            |
| Estilo visual    | CSS com tema dark técnico moderno  |

---

## 🚀 Como rodar o EletroSeguro localmente

⚡ É simples! Siga os passos abaixo:

```bash
# 1. Clone o repositório
git clone https://github.com/BielCoutinho/eletroseguro.git
cd eletroseguro

# 2. Instale as dependências
npm install

# 3. Configure o banco (MongoDB)
# Crie um .env com a variável de conexão
MONGODB_URI=mongodb://localhost:27017/eletroseguro

# 4. Inicie o app
npm start
