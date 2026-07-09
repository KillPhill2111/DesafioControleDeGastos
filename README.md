## Objetivo

Implementar um sistema capaz de:

- cadastrar pessoas;
- cadastrar receitas e despesas;
- consultar os totais por pessoa;
- calcular o saldo geral.

O sistema foi desenvolvido seguindo as regras de negócio.


# Funcionalidades:
- Cadastro de pessoas
- Listagem de pessoas
- Exclusão de pessoas
- Cadastro de receitas
- Cadastro de despesas
- Consulta de saldo individual
- Consulta do saldo geral

# Regras de negocio:
### Pessoas

- Identificador gerado automaticamente.
- Exclusão em cascata das transações.

### Transações

- Apenas pessoas cadastradas podem receber transações.
- Menores de idade só podem possuir despesas.

### Consulta

- Total de receitas
- Total de despesas
- Saldo por pessoa
- Total geral

# Arquitetura:
Frontend
React + TypeScript

↓

API REST

↓

ASP.NET Core

↓

Entity Framework Core

↓

SQLite
# ------------------------------------------------

# 💰 Sistema de Controle de Gastos Residenciais

Este é um sistema full-stack desenvolvido como solução para o desafio prático de gerenciamento de finanças familiares. A aplicação permite o gerenciamento completo de moradores (pessoas), o lançamento de movimentações financeiras (receitas e despesas) e fornece um painel de balanço consolidado individual e geral em tempo real.

---

## 🛠️ Pré-requisitos para Execução

Para rodar este projeto em sua máquina local, certifique-se de ter instalado:
1. **SDK do .NET 9.0** ou superior (para o Back-end)
2. **Node.js (versão LTS 20.x ou superior)** e gerenciador de pacotes `npm` (para o Front-end)

*Nota: O banco de dados utiliza o SQLite baseado em arquivo local (`gastos.db`), eliminando a necessidade de instalar servidores externos de banco de dados (como MySQL ou SQL Server).*

---

## 📂 Arquitetura e Estrutura de Arquivos Criados

O repositório está dividido em duas frentes independentes:

### 🖥️ Back-end (`/backend`)
Desenvolvido em **ASP.NET Core Web API** com **Entity Framework Core**:
- `📄 Program.cs`: Arquivo de inicialização configurado com políticas de CORS (liberando portas locais do React) e serializador global de JSON.
- `📁 Data/`
  - `📄 AppDbContext.cs`: Contexto do banco de dados configurando o mapeamento das tabelas e a deleção estrutural.
- `📁 Models/`
  - `📄 Pessoa.cs`: Entidade com validações de dados (Nome, Idade) e identificador único gerado via `Guid`.
  - `📄 Transacao.cs`: Contém o Enum `TipoTransacao`, a entidade física `Transacao` e o `TransacaoDTO` utilizado como barreira de segurança para requisições de entrada.
- `📁 Controllers/`
  - `📄 PessoasController.cs`: Endpoints de criação, listagem e remoção segura de usuários.
  - `📄 TransacoesController.cs`: Gerencia o histórico e o recebimento de movimentações, aplicando regras de negócio de idade.
  - `📄 TotaisController.cs`: Centraliza os cálculos financeiros agregados (soma de receitas, despesas e saldos individuais/líquidos).

### 💻 Front-end (`/frontend`)
Desenvolvido em **React**, **TypeScript** e **Vite**:
- `📁 src/services/`
  - `📄 api.ts`: Centralização do cliente HTTP Axios apontando para a URL local da API .NET (`http://localhost:5041/api`).
- `📁 src/types/`
  - `📄 index.ts`: Arquivo de tipagem estrita com as interfaces que mapeiam os objetos retornados pelo servidor.
- `📁 src/components/`
  - `📄 CadastroPessoas.tsx`: Interface com formulário de cadastro, tabela de usuários e gatilho de exclusão.
  - `📄 CadastroTransacoes.tsx`: Formulário de lançamentos financeiros e histórico geral com cruzamento dinâmico de IDs de usuários.
  - `📄 ConsultaTotais.tsx`: Painel consolidado com cards de resumo financeiro e tabela contendo o cálculo do saldo líquido de toda a família.
- `📄 src/App.tsx`: Orquestrador principal da tela, gerenciando os estados compartilhados e os gatilhos visuais de atualização em tempo real.

---

## 🧠 Regras de Negócio Implementadas

1. **Persistência total**: Todos os dados são gravados localmente no arquivo do SQLite e não são perdidos ao fechar as aplicações.
2. **Deleção Programática**: Ao excluir um usuário da lista, o sistema realiza uma remoção antecipada via código (`RemoveRange`) de todas as despesas vinculadas a ele, impedindo registros órfãos ou inconsistências na tela.
3. **Restrição por Idade**: Validação dupla baseada em regras de negócio. Se o usuário selecionado for menor de 18 anos, a interface do React bloqueia a opção "Receita" exibindo um aviso preventivo, e o controlador do .NET barra a requisição de forma estrita caso ocorra uma tentativa de envio direto.
4. **Isolamento por DTO**: Uso de Data Transfer Objects para separar as entidades de persistência do banco das payloads do front-end, garantindo compatibilidade de nomes de propriedades e segurança.

---

## ⚙️ Como Executar a Aplicação Localmente

Siga o passo a passo abaixo abrindo dois terminais diferentes:

### 1º Passo: Inicializar o Back-end
Abra o terminal na pasta raiz do projeto e entre na pasta do servidor:
```bash
cd backend
```
Restaure os pacotes NuGet do Entity Framework e SQLite:
```bash
dotnet restore
```
Gere o arquivo de banco de dados e aplique as tabelas estruturais automaticamente:
```bash
dotnet ef database update
```
Inicie o servidor local da API:
```bash
dotnet run
```
*O back-end estará online e escutando na porta padrão (ex: `http://localhost:5041`).*

### 2º Passo: Inicializar o Front-end
Abra um **segundo terminal** na pasta raiz do projeto e acesse a pasta da interface:
```bash
cd frontend
```
Instale as dependências de pacotes do Node (como Axios e Lucide Icons):
```bash
npm install
```
Inicie o servidor de desenvolvimento do Vite:
```bash
npm run dev
```
*Acesse o endereço indicado no terminal (geralmente `http://localhost:5173`) em seu navegador de preferência.*

---
*Nota do Desenvolvedor: Todas as referências diretas a marcas, nomes de processos corporativos ou e-mails de RH externos foram rigorosamente removidas do código-fonte e desta documentação, mantendo o repositório inteiramente público e neutro para avaliação.*
