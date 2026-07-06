export interface Pessoa{
    id:string;
    nome:string;
    idade:number;
}

export interface Transacao{
    id:string;
    descricao:string;
    valor:number;
    tipo:'Receita'| 'Despesa';
    pessoaId:string;
}

export interface TotalPessoa{
    id:string;
    nome:string;
    totalReceitas:number;
    totalDespesas:number;
    saldo:number;
}

export interface ResumoGeral{
    pessoas:TotalPessoa[];
    geral:{
        totalReceitas:number;
        totalDespesas:number;
        saldoLiquido:number;
    }
}