import React, { useState, useEffect } from 'react';
import api from '../services/api';
import type { Pessoa, Transacao } from "../types";
import { DollarSign, AlertCircle } from "lucide-react";

interface CadastroTransacoesProps{
    onTransacaoCriada:()=>void;
    pessoas:Pessoa[]

}

export default function CadastroTransacoes({onTransacaoCriada,pessoas}:CadastroTransacoesProps){
    const [transacoes, setTransacoes]=useState<Transacao[]>([]);
    const [descricao, setDescricao]=useState('');
    const [valor, setValor]=useState('');
    const [tipo, setTipo]=useState<'Receita' | 'Despesa'>('Despesa');
    const [pessoaId,setPessoaId]=useState('');
    const [erro, setErro]=useState('');
    const [avisoMenorIdade, setAvisoMenorIdade]=useState(false);


    //Buscando a lçista de transações cadastradas no backend

    const fetchTransacoes=async()=>{
        try{
            const response=await api.get<Transacao[]>("/transacoes");
            setTransacoes(response.data);
        }
        catch(erro){
            console.log("Erro ao buscar a transação",erro)
        }
    }
    useEffect(()=>{
        fetchTransacoes();
    },[pessoas])//recarragando a lista de pessoas


    useEffect(()=>{
        if(!pessoaId){
            setAvisoMenorIdade(false);
            return
        }
    

        const pessoaSelecionada=pessoas.find(p=>p.id===pessoaId)
        if(pessoaSelecionada && pessoaSelecionada.idade<18){  
            setAvisoMenorIdade(true);
            setTipo('Despesa') //Sempre que a pessoa ser menor de idade, o tipo será despesa
        }else{
            setAvisoMenorIdade(false)
        }
    },[pessoaId, pessoas])

    const handleSubmit=async (e:React.FormEvent)=>{
        e.preventDefault();
        setErro('');
        if (!descricao.trim()|| !valor || !pessoaId){
            setErro("Por favor, preencha todos os campos")
            return 
        }
        try{
            await api.post('/transacoes',{
                descricao,
                valor:parseFloat(valor),
                tipo:tipo,
                pessoaId:pessoaId,
            })

            setDescricao('');
            setValor('');
            fetchTransacoes();
            onTransacaoCriada();
        }catch(er:any){
            console.error("Erro completop retonado pela api",er.response?.data)
          if (er.response?.data?.errors) {
            const mensagensDeErro = Object.values(er.response.data.errors).flat().join(' ');
          setErro(mensagensDeErro);
          } 
      
          else if (typeof er.response?.data === 'string') {
          setErro(er.response.data);
          } 
      
          else {
          setErro('Erro ao processar o lançamento no servidor.');
      }
        }
    };

    const getNomePessoa=(id:string)=>{
        const pessoa=pessoas.find(p=>p.id===id);
        return pessoa?pessoa.nome :"Desconhecido";
    };

    return (
        <div style={styles.card}>
      <h2 style={styles.title}>
        <DollarSign size={20} style={{ marginRight: '8px' }} /> Cadastro de Transações
      </h2>

      {erro && <div style={styles.error}>{erro}</div>}

      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.inputGroup}>
          <label style={styles.label}>Pessoa Responsável</label>
          <select
            value={pessoaId}
            onChange={(e) => setPessoaId(e.target.value)}
            style={styles.input}
          >
            <option value="">Selecione uma pessoa...</option>
            {pessoas.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nome} ({p.idade} anos)
              </option>
            ))}
          </select>
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label}>Descrição</label>
          <input
            type="text"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            style={styles.input}
            placeholder="Ex: Aluguel, Supermercado"
          />
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label}>Valor (R$)</label>
          <input
            type="number"
            value={valor}
            onChange={(e) => setValor(e.target.value)}
            style={styles.input}
            placeholder="0.00"
            step="0.01"
            min="0.01"
          />
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label}>Tipo de Transação</label>
          <select
            value={tipo}
            onChange={(e) => setTipo(e.target.value as 'Receita'| 'Despesa')}
            style={styles.input}
            disabled={avisoMenorIdade} // Bloqueia a alteração se for menor de idade
          >
            <option value="Despesa">Despesa</option>
            <option value="Receita">Receita</option>
          </select>
        </div>

        <button type="submit" style={styles.button}>Lançar Transação</button>
      </form>

      {/* REGRA DE NEGOCIO VISUAL: Exibe o aviso caso a pessoa selecionada seja menor de 18 anos */}
      {avisoMenorIdade && (
        <div style={styles.warningContainer}>
          <AlertCircle size={18} style={{ marginRight: '8px', flexShrink: 0 }} />
          <span>Atenção: A pessoa selecionada é menor de 18 anos. De acordo com as regras de negócio, apenas despesas podem ser atribuídas a ela.</span>
        </div>
      )}

      <h3 style={styles.subtitle}>Histórico de Transações</h3>
      <div style={styles.tableContainer}>
        <table style={styles.table}>
          <thead>
            <tr style={styles.thRow}>
              <th style={styles.th}>Pessoa</th>
              <th style={styles.th}>Descrição</th>
              <th style={styles.th}>Tipo</th>
              <th style={styles.th}>Valor</th>
            </tr>
          </thead>
          <tbody>
            {transacoes.length === 0 ? (
              <tr>
                <td colSpan={4} style={styles.tdEmpty}>Nenhuma transação lançada.</td>
              </tr>
            ) : (
              transacoes.map((t) => (
                <tr key={t.id} style={styles.tr}>
                  <td style={styles.td}>{getNomePessoa(t.pessoaId)}</td>
                  <td style={styles.td}>{t.descricao}</td>
                  <td style={styles.td}>
                    <span style={t.tipo === 'Receita' ? styles.badgeReceita : styles.badgeDespesa}>
                      {t.tipo ==='Receita' ? "Receita" : "Despesa"}
                    </span>
                  </td>
                  <td style={{ ...styles.td, fontWeight: '500', color: t.tipo === 'Receita' ? '#38a169' : '#e53e3e' }}>
                    {t.tipo === 'Receita' ? '+' : '-'} R$ {t.valor.toFixed(2)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
//Estilização do compoente
const styles = {
  card: { background: '#1e293b', padding: '24px', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.2)', marginBottom: '24px' },
  title: { margin: '0 0 16px 0', fontSize: '18px', display: 'flex', alignItems: 'center', color: '#f8fafc' },
  subtitle: { fontSize: '16px', color: '#cbd5e1', margin: '24px 0 12px 0' },
  form: { display: 'flex', gap: '16px', alignItems: 'flex-end', flexWrap: 'wrap' as const },
  inputGroup: { display: 'flex', flexDirection: 'column' as const, flex: 1, minWidth: '180px' },
  label: { fontSize: '14px', fontWeight: '500', color: '#94a3b8', marginBottom: '6px' },
  input: { padding: '10px', borderRadius: '6px', border: '1px solid #334155', background: '#0f172a', color: '#f8fafc', fontSize: '14px', outline: 'none' },
  button: { background: '#3b82f6', color: '#fff', border: 'none', padding: '11px 20px', borderRadius: '6px', fontWeight: '500', cursor: 'pointer', height: '40px' },
  error: { background: '#7f1d1d', color: '#fca5a5', padding: '10px', borderRadius: '6px', fontSize: '14px', marginBottom: '16px', border: '1px solid #b91c1c' },
  warningContainer: { display: 'flex', alignItems: 'center', background: '#78350f', border: '1px solid #b45309', color: '#fef3c7', padding: '12px', borderRadius: '6px', marginTop: '16px', fontSize: '13px', lineHeight: '1.4' },
  tableContainer: { overflowX: 'auto' as const },
  table: { width: '100%', borderCollapse: 'collapse' as const, marginTop: '8px' },
  thRow: { background: '#0f172a', borderBottom: '2px solid #334155' },
  th: { textAlign: 'left' as const, padding: '12px', fontSize: '14px', fontWeight: '600', color: '#94a3b8' },
  tr: { borderBottom: '1px solid #334155' },
  td: { padding: '12px', fontSize: '14px', color: '#e2e8f0' },
  tdEmpty: { padding: '20px', textAlign: 'center' as const, color: '#64748b', fontSize: '14px' },
  badgeReceita: { background: '#064e3b', color: '#a7f3d0', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: '500' },
  badgeDespesa: { background: '#7f1d1d', color: '#fca5a5', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: '500' }
};