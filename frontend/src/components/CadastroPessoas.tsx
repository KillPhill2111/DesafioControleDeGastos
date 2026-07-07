import { useState, useEffect } from 'react';
import api from '../services/api';
import type { Pessoa } from '../types';
import { UserPlus, Trash2 } from 'lucide-react';

interface CadastroPessoasProps {
  onPessoasModificadas: () => void; // avisa os outros componentes para se atualizarem
  pessoas: Pessoa[];
  fetchPessoas: () => void;
}

export default function CadastroPessoas({ onPessoasModificadas, pessoas, fetchPessoas }: CadastroPessoasProps) {
  const [nome, setNome] = useState('');
  const [idade, setIdade] = useState('');
  const [erro, setErro] = useState('');

  // envia os dados para a API do .NET
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro('');

    if (!nome.trim() || !idade) {
      setErro('Por favor, preencha todos os campos.');
      return;
    }

    try {
      await api.post('/pessoas', {
        nome,
        idade: parseInt(idade, 10),
      });

      // limpa os campos apos sucesso
      setNome('');
      setIdade('');
      fetchPessoas();
      onPessoasModificadas(); 
    } catch (err: any) {
      console.error("Erro completo retornado pela API:", err.response?.data);
      
      
      if (err.response?.data?.errors) {
        const mensagensDeErro = Object.values(err.response.data.errors).flat().join(' ');
        setErro(mensagensDeErro);
      } 
      
      else if (typeof err.response?.data === 'string') {
        setErro(err.response.data);
      } 
      
      else {
        setErro('Erro ao processar o cadastro no servidor.');
      }
    }
  };

  // Exclui a pessoa e suas transações (Regra de negocio)
  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta pessoa? Todas as transações vinculadas a ela serão apagadas.')) {
      try {
        await api.delete(`/pessoas/${id}`);
        fetchPessoas();
        onPessoasModificadas();
      } catch (err) {
        alert('Erro ao deletar pessoa.');
      }
    }
  };

  return (
    <div style={styles.card}>
      <h2 style={styles.title}>
        <UserPlus size={20} style={{ marginRight: '8px' }} /> Cadastro de Pessoas
      </h2>

      {erro && <div style={styles.error}>{erro}</div>}

      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.inputGroup}>
          <label style={styles.label}>Nome Completo</label>
          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            style={styles.input}
            placeholder="Ex: João Silva"
          />
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label}>Idade</label>
          <input
            type="number"
            value={idade}
            onChange={(e) => setIdade(e.target.value)}
            style={styles.input}
            placeholder="Ex: 25"
            min="0"
          />
        </div>

        <button type="submit" style={styles.button}>Cadastrar Pessoa</button>
      </form>

      <h3 style={styles.subtitle}>Pessoas Cadastradas</h3>
      <div style={styles.tableContainer}>
        <table style={styles.table}>
          <thead>
            <tr style={styles.thRow}>
              <th style={styles.th}>Nome</th>
              <th style={styles.th}>Idade</th>
              <th style={styles.th}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {pessoas.length === 0 ? (
              <tr>
                <td colSpan={3} style={styles.tdEmpty}>Nenhuma pessoa cadastrada.</td>
              </tr>
            ) : (
              pessoas.map((pessoa) => (
                <tr key={pessoa.id} style={styles.tr}>
                  <td style={styles.td}>{pessoa.nome}</td>
                  <td style={styles.td}>{pessoa.idade} anos</td>
                  <td style={styles.td}>
                    <button
                      onClick={() => handleDelete(pessoa.id)}
                      style={styles.deleteButton}
                      title="Excluir pessoa e transações"
                    >
                      <Trash2 size={16} />
                    </button>
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

// Estilização 
const styles = {
  card: { background: '#1e293b', padding: '24px', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.2)', marginBottom: '24px' },
  title: { margin: '0 0 16px 0', fontSize: '18px', display: 'flex', alignItems: 'center', color: '#f8fafc' },
  subtitle: { fontSize: '16px', color: '#cbd5e1', margin: '24px 0 12px 0' },
  form: { display: 'flex', gap: '16px', alignItems: 'flex-end', flexWrap: 'wrap' as const },
  inputGroup: { display: 'flex', flexDirection: 'column' as const, flex: 1, minWidth: '200px' },
  label: { fontSize: '14px', fontWeight: '500', color: '#94a3b8', marginBottom: '6px' },
  input: { padding: '10px', borderRadius: '6px', border: '1px solid #334155', background: '#0f172a', color: '#f8fafc', fontSize: '14px', outline: 'none' },
  button: { background: '#3b82f6', color: '#fff', border: 'none', padding: '11px 20px', borderRadius: '6px', fontWeight: '500', cursor: 'pointer', height: '40px' },
  error: { background: '#7f1d1d', color: '#fca5a5', padding: '10px', borderRadius: '6px', fontSize: '14px', marginBottom: '16px', border: '1px solid #b91c1c' },
  tableContainer: { overflowX: 'auto' as const },
  table: { width: '100%', borderCollapse: 'collapse' as const, marginTop: '8px' },
  thRow: { background: '#0f172a', borderBottom: '2px solid #334155' },
  th: { textAlign: 'left' as const, padding: '12px', fontSize: '14px', fontWeight: '600', color: '#94a3b8' },
  tr: { borderBottom: '1px solid #334155' },
  td: { padding: '12px', fontSize: '14px', color: '#e2e8f0' },
  tdEmpty: { padding: '20px', textAlign: 'center' as const, color: '#64748b', fontSize: '14px' },
  deleteButton: { background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '4px', borderRadius: '4px' },
};
