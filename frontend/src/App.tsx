 import { useState, useEffect } from 'react';
 import api from './services/api';
 import type { Pessoa } from './types';
 import CadastroPessoas from './components/CadastroPessoas';
 import CadastroTransacoes from './components/CadastroTransacoes';
 import ConsultaTotais from './components/ConsultaTotais'


function App() {
  const [pessoas, setPessoas]= useState<Pessoa[]>([]);
  const [atualizarSinal, setAtualizaSinal]= useState(0);


  const fetchPessoas=async ()=>{
    try{
      const response= await api.get<Pessoa[]>('/pessoas');
      setPessoas(response.data);
    }
    catch(er){
      console.error("Erro ao buscar pessoa na lista: ",er)
    }
  };
  useEffect(()=>{
    fetchPessoas();

  },[])

  //Fuinção para sincronizar atualização mutua das telas
  const dispararAtuliazacao=()=>{
    setAtualizaSinal(prev=>prev+1)
  }

  return (
    <>
      <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.mainTitle}>💰 Sistema de Controle de Gastos Residenciais</h1>
        <p style={styles.subtitle}>Gerencie despesas, receitas e balanço familiar de forma transparente</p>
      </header>

      <main style={styles.mainLayout}>
        {/* Lado Esquerdo do Painel: Cadastros */}
        <div style={styles.coluna}>
          <CadastroPessoas 
            pessoas={pessoas} 
            fetchPessoas={fetchPessoas} 
            onPessoasModificadas={dispararAtuliazacao} 
          />
          <CadastroTransacoes 
            pessoas={pessoas} 
            onTransacaoCriada={dispararAtuliazacao} 
          />
        </div>

        {/* Lado Direito do Painel: Resultados Financeiros consolidados */}
        <div style={styles.coluna}>
          <ConsultaTotais atualizarSinal={atualizarSinal} />
        </div>
      </main>
    </div>
    </>
  )
}
//estilização da pagina principal
const styles = {
  container: { background: '#f0f4f8', minHeight: '100vh', padding: '32px 24px', fontFamily: '"Segoe UI", Roboto, sans-serif' },
  header: { marginBottom: '32px', textAlign: 'center' as const },
  mainTitle: { margin: '0 0 8px 0', fontSize: '26px', color: '#1a202c', fontWeight: '700' },
  subtitle: { margin: 0, fontSize: '15px', color: '#4a5568' },
  mainLayout: { display: 'flex', gap: '24px', maxWidth: '1400px', margin: '0 auto', flexWrap: 'wrap' as const },
  coluna: { flex: 1, minWidth: '450px', display: 'flex', flexDirection: 'column' as const }
};
export default App
