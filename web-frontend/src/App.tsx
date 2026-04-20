import { useState } from 'react';
import { useEffect } from 'react';

// Interfaces tipadas para o TypeScript
interface Contagem {
  quantidade: number;
}

interface Culto {
  id: string;
  data: string;
  turno: number;
  contagens: Contagem[];
}

function App() {
  // Pega a data de hoje no formato YYYY-MM-DD para preencher o calendário por padrão
  const dataHoje = new Date().toISOString().split('T')[0];

  // Estados do formulário e da tabela
  const [data, setData] = useState<string>(dataHoje);
  const [turno, setTurno] = useState<number>(1);
  const [quantidade, setQuantidade] = useState<number>(0);
  const [mensagem, setMensagem] = useState<string>('');
  const [listaCultos, setListaCultos] = useState<Culto[]>([]);

  // Função para buscar os cultos (READ)
  const carregarCultos = async () => {
    try {
      const resposta = await fetch('http://localhost:5115/api/Cultos');
      if (resposta.ok) {
        const dados = await resposta.json();
        setListaCultos(dados);
      }
    } catch (error) {
      console.error("Erro ao buscar dados da API", error);
    }
  };

  // Executa o "carregarCultos" automaticamente apenas uma vez quando a tela abre
  useEffect(() => {
    const inicializarDados = async () => {
      await carregarCultos();
    };
    inicializarDados();
  }, []);

  // Função para Salvar (CREATE)
  const salvarCulto = async () => {
    setMensagem('Salvando...');

    const dadosCulto = {
      data: data,
      turno: turno,
      contagens: [{ quantidade: quantidade }]
    };

    try {
      const resposta = await fetch('http://localhost:5115/api/Cultos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dadosCulto)
      });

      if (resposta.ok) {
        setMensagem('Culto salvo com sucesso!');
        setQuantidade(0);
        carregarCultos(); // Recarrega a tabela para mostrar o novo culto na hora
      } else {
        setMensagem('Erro ao salvar no banco.');
      }
    } catch {
      setMensagem('Falha de conexão com a API.');
    }
  };

  // Função para Excluir (DELETE)
  const excluirCulto = async (id: string) => {
    if (!window.confirm("Tem certeza que deseja excluir esta contagem?")) return;

    try {
      const resposta = await fetch(`http://localhost:5115/api/Cultos/${id}`, {
        method: 'DELETE'
      });

      if (resposta.ok) {
        carregarCultos(); // Recarrega a tabela após apagar
      } else {
        alert('Erro ao excluir culto.');
      }
    } catch {
      alert('Falha na conexão com a API ao tentar excluir.');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', justifyContent: 'space-between', padding: '1rem', fontFamily: 'sans-serif' }}>

      <main style={{ textAlign: 'center', marginTop: '2rem', maxWidth: '800px', margin: '0 auto', width: '100%' }}>
        <h1>Recepção IBE</h1>
        <p>Sistema interno para controle de contagens e cultos.</p>

        {/* Formulário */}
        <div style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '8px', marginTop: '20px', backgroundColor: '#f9f9f9', color: '#333', maxWidth: '400px', margin: '20px auto' }}>
          <div style={{ marginBottom: '15px', textAlign: 'left' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Data do Culto:</label>
            <input type="date" value={data} onChange={(e) => setData(e.target.value)} style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }} />
          </div>

          <div style={{ marginBottom: '15px', textAlign: 'left' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Turno:</label>
            <select value={turno} onChange={(e) => setTurno(Number(e.target.value))} style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}>
              <option value={1}>Manhã</option>
              <option value={2}>Noite</option>
            </select>
          </div>

          <div style={{ marginBottom: '20px', textAlign: 'left' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Quantidade de Pessoas:</label>
            <input type="number" value={quantidade} onChange={(e) => setQuantidade(Number(e.target.value))} style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }} />
          </div>

          <button onClick={salvarCulto} style={{ width: '100%', padding: '10px', backgroundColor: '#0056b3', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
            Salvar no Banco
          </button>

          {mensagem && <p style={{ marginTop: '15px', fontWeight: 'bold', color: mensagem.includes('sucesso') ? 'green' : 'red' }}>{mensagem}</p>}
        </div>

        {/* Tabela de Visualização do CRUD */}
        <div style={{ marginTop: '36px' }}>
          <h3>Registros Salvos</h3>
          <table style={{ marginTop: '16px', width: '100%', borderCollapse: 'collapse', textAlign: 'center', backgroundColor: '#fff', border: '1px solid #ccc' }}>
            <thead style={{ backgroundColor: '#eeeeee' }}>
              <tr>
                <th style={{ padding: '10px', borderBottom: '1px solid #ccc' }}>Data</th>
                <th style={{ padding: '10px', borderBottom: '1px solid #ccc' }}>Turno</th>
                <th style={{ padding: '10px', borderBottom: '1px solid #ccc' }}>Quantidade</th>
                <th style={{ padding: '10px', borderBottom: '1px solid #ccc' }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {listaCultos.map((culto) => (
                <tr key={culto.id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '10px' }}>{culto.data.split('-').reverse().join('/')}</td>
                  <td style={{ padding: '10px' }}>{culto.turno === 1 ? 'Manhã' : 'Noite'}</td>
                  <td style={{ padding: '10px' }}>{culto.contagens[0]?.quantidade || 0}</td>
                  <td style={{ padding: '10px' }}>
                    <button
                      onClick={() => excluirCulto(culto.id)}
                      style={{ padding: '5px 10px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                    >
                      Excluir
                    </button>
                  </td>
                </tr>
              ))}
              {listaCultos.length === 0 && (
                <tr>
                  <td colSpan={4} style={{ padding: '20px', color: 'gray' }}>Nenhuma contagem registrada ainda.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

      </main>

      <footer style={{ textAlign: 'center', padding: '1rem', fontSize: '12px', color: 'gray' }}>
        <p><strong>Copyright &copy; 2026 - Igreja Batista Emanuel. Todos os direitos reservados.</strong></p>
      </footer>

    </div>
  );
}

export default App;