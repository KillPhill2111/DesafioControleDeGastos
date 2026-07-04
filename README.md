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
