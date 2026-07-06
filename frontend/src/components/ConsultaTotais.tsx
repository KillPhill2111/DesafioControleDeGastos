// src/components/ConsultaTotais.tsx
import { useState, useEffect } from 'react';
import api from '../services/api';
import type { ResumoGeral } from '../types';
import { BarChart3, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';

interface ConsultaTotaisProps {
  atualizarSinal: number; // Número usado como gatilho para atualizar a tabela quando algo mudar nos outros componentes
}

export default function ConsultaTotais({ atualizarSinal }: ConsultaTotaisProps) {
  const [dados, setDados] = useState<ResumoGeral | null>(null);
  const [carregando, setCarregando] = useState(true);

  // Busca os totais individuais e gerais calculados pelo back-end .NET
  const fetchTotais = async () => {
    try {
      setCarregando(true);
      const response = await api.get<ResumoGeral>('/totais');
      setDados(response.data);
    } catch (err) {
      console.error('Erro ao buscar totais de gastos', err);
    } finally {
      setCarregando(false);
    }
  };

  // Recarrega as informações sempre que o sinal de atualização disparar nos outros componentes
  useEffect(() => {
    fetchTotais();
  }, [atualizarSinal]);

  if (carregando) {
    return <div style={{ padding: '20px', textAlign: 'center', color: '#718096' }}>Carregando dados financeiros...</div>;
  }

  if (!dados ||!dados.geral) {
    return (
      <div style={{ background: '#fff', padding: '24px', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', textAlign: 'center', color: '#718096' }}>
        Nenhum dado financeiro a ser apresentado no momento...
      </div>
    )
  }

  return (
    <div style={styles.card}>
      <h2 style={styles.title}>
        <BarChart3 size={20} style={{ marginRight: '8px' }} /> Consulta de Totais e Balanço Geral
      </h2>

      {/* Cards de Resumo Visual no topo do componente */}
      <div style={styles.gridCards}>
        <div style={{ ...styles.miniCard, borderLeft: '4px solid #38a169' }}>
          <div style={styles.miniCardHeader}>
            <span style={styles.miniCardTitle}>Total Receitas</span>
            <TrendingUp size={20} color="#38a169" />
          </div>
          <div style={{ ...styles.miniCardValue, color: '#2f855a' }}>R$ {dados.geral.totalReceitas.toFixed(2)}</div>
        </div>

        <div style={{ ...styles.miniCard, borderLeft: '4px solid #e53e3e' }}>
          <div style={styles.miniCardHeader}>
            <span style={styles.miniCardTitle}>Total Despesas</span>
            <TrendingDown size={20} color="#e53e3e" />
          </div>
          <div style={{ ...styles.miniCardValue, color: '#9b2c2c' }}>R$ {dados.geral.totalDespesas.toFixed(2)}</div>
        </div>

        <div style={{ ...styles.miniCard, borderLeft: '4px solid #3182ce' }}>
          <div style={styles.miniCardHeader}>
            <span style={styles.miniCardTitle}>Saldo Líquido</span>
            <DollarSign size={20} color="#3182ce" />
          </div>
          <div style={{ ...styles.miniCardValue, color: dados.geral.saldoLiquido >= 0 ? '#2b6cb0' : '#9b2c2c' }}>
            R$ {dados.geral.saldoLiquido.toFixed(2)}
          </div>
        </div>
      </div>

      {/* Tabela Principal exigida nas especificações do desafio */}
      <div style={styles.tableContainer}>
        <table style={styles.table}>
          <thead>
            <tr style={styles.thRow}>
              <th style={styles.th}>Pessoa</th>
              <th style={styles.th}>Receitas</th>
              <th style={styles.th}>Despesas</th>
              <th style={styles.th}>Saldo Individual</th>
            </tr>
          </thead>
          <tbody>
            {dados.pessoas.length === 0 ? (
              <tr>
                <td colSpan={4} style={styles.tdEmpty}>Nenhum registro financeiro disponível.</td>
              </tr>
            ) : (
              dados.pessoas.map((p) => (
                <tr key={p.id} style={styles.tr}>
                  <td style={{ ...styles.td, fontWeight: '500' }}>{p.nome}</td>
                  <td style={{ ...styles.td, color: '#38a169' }}>R$ {p.totalReceitas.toFixed(2)}</td>
                  <td style={{ ...styles.td, color: '#e53e3e' }}>R$ {p.totalDespesas.toFixed(2)}</td>
                  <td style={{ ...styles.td, fontWeight: '600', color: p.saldo >= 0 ? '#2f855a' : '#9b2c2c' }}>
                    R$ {p.saldo.toFixed(2)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
          {/* Rodapé calculando o Total Geral conforme as regras de negócio */}
          {dados.pessoas.length > 0 && (
            <tfoot>
              <tr style={styles.tfootRow}>
                <td style={styles.tdFoot}>TOTAL GERAL</td>
                <td style={{ ...styles.tdFoot, color: '#2f855a' }}>R$ {dados.geral.totalReceitas.toFixed(2)}</td>
                <td style={{ ...styles.tdFoot, color: '#9b2c2c' }}>R$ {dados.geral.totalDespesas.toFixed(2)}</td>
                <td style={{ ...styles.tdFoot, background: dados.geral.saldoLiquido >= 0 ? '#ebf8ff' : '#fff5f5', color: dados.geral.saldoLiquido >= 0 ? '#2b6cb0' : '#9b2c2c' }}>
                  R$ {dados.geral.saldoLiquido.toFixed(2)}
                </td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>
    </div>
  );
}

const styles = {
  card: { background: '#fff', padding: '24px', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', marginBottom: '24px' },
  title: { margin: '0 0 20px 0', fontSize: '18px', display: 'flex', alignItems: 'center', color: '#1a202c' },
  gridCards: { display: 'flex', gap: '16px', marginBottom: '28px', flexWrap: 'wrap' as const },
  miniCard: { flex: 1, minWidth: '200px', background: '#f7fafc', padding: '16px', borderRadius: '6px', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' },
  miniCardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' },
  miniCardTitle: { fontSize: '13px', color: '#718096', fontWeight: '500' },
  miniCardValue: { fontSize: '20px', fontWeight: '700' },
  tableContainer: { overflowX: 'auto' as const },
  table: { width: '100%', borderCollapse: 'collapse' as const, marginTop: '8px' },
  thRow: { background: '#f7fafc', borderBottom: '2px solid #e2e8f0' },
  th: { textAlign: 'left' as const, padding: '12px', fontSize: '14px', fontWeight: '600', color: '#4a5568' },
  tr: { borderBottom: '1px solid #e2e8f0' },
  td: { padding: '12px', fontSize: '14px', color: '#2d3748' },
  tdEmpty: { padding: '20px', textAlign: 'center' as const, color: '#718096', fontSize: '14px' },
  tfootRow: { background: '#edf2f7', borderTop: '3px solid #cbd5e0', fontWeight: '700' as const },
  tdFoot: { padding: '14px 12px', fontSize: '14px', color: '#1a202c' }
};
