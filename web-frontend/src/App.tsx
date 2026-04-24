import { useState } from 'react';
import { useEffect } from 'react';

interface Contagem {
  quantidadePulpito: number;
  quantidadeCadeirasA: number;
  quantidadeCadeirasB: number;
  quantidadeCadeirasC: number;
  quantidadeCadeirasD: number;
  quantidadeGaleria: number;
  quantidadeSalas: number;
  quantidadeExterno: number;
  quantidadeOnline: number;
  total?: number; 
}

interface Culto {
  id: string;
  data: string;
  turno: number;
  liderRecepcao: string;
  grupoRecepcao: number;
  contagens: Contagem[];
}

function App() {
  const dataHoje = new Date().toISOString().split('T')[0];

  const [editandoId, setEditandoId] = useState<string | null>(null);

  const [form, setForm] = useState({
    data: dataHoje,
    turno: 1, 
    liderRecepcao: '',
    quantidadePulpito: 0,
    quantidadeCadeirasA: 0,
    quantidadeCadeirasB: 0,
    quantidadeCadeirasC: 0,
    quantidadeCadeirasD: 0,
    quantidadeGaleria: 0,
    quantidadeSalas: 0,
    quantidadeExterno: 0,
    quantidadeOnline: 0,
  });

  const [mensagem, setMensagem] = useState<string>('');
  const [listaCultos, setListaCultos] = useState<Culto[]>([]);

  const totalEmTempoReal = 
    form.quantidadePulpito + form.quantidadeCadeirasA + form.quantidadeCadeirasB + 
    form.quantidadeCadeirasC + form.quantidadeCadeirasD + form.quantidadeGaleria + 
    form.quantidadeSalas + form.quantidadeExterno + form.quantidadeOnline;

  const diaSelecionado = parseInt(form.data.split('-')[2], 10) || 1;
  const grupoRecepcaoCalculado = Math.floor((diaSelecionado - 1) / 7) + 1;

  const carregarCultos = async () => {
    try {
      const resposta = await fetch('http://localhost:5115/api/Cultos');
      if (resposta.ok) {
        const dados: Culto[] = await resposta.json();
        
        // Ordenação por data ascendente (da mais antiga para a mais recente)
        const dadosOrdenados = dados.sort((a, b) => a.data.localeCompare(b.data));
        
        setListaCultos(dadosOrdenados);
      }
    } catch (error) {
      console.error("Erro ao buscar dados da API", error);
    }
  };

  useEffect(() => {
    const inicializarDados = async () => {
      await carregarCultos();
    };
    inicializarDados();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setForm({
      ...form,
      [name]: type === 'number' || name === 'turno' ? Number(value) : value
    });
  };

  const limparFormulario = () => {
    setEditandoId(null);
    setForm({
      data: dataHoje,
      turno: 1,
      liderRecepcao: '',
      quantidadePulpito: 0, quantidadeCadeirasA: 0, quantidadeCadeirasB: 0, 
      quantidadeCadeirasC: 0, quantidadeCadeirasD: 0, quantidadeGaleria: 0, 
      quantidadeSalas: 0, quantidadeExterno: 0, quantidadeOnline: 0,
    });
  };

  const prepararEdicao = (culto: Culto) => {
    setEditandoId(culto.id);
    const contagem = culto.contagens[0] || {};

    setForm({
      data: culto.data.split('T')[0],
      turno: culto.turno,
      liderRecepcao: culto.liderRecepcao,
      quantidadePulpito: contagem.quantidadePulpito || 0,
      quantidadeCadeirasA: contagem.quantidadeCadeirasA || 0,
      quantidadeCadeirasB: contagem.quantidadeCadeirasB || 0,
      quantidadeCadeirasC: contagem.quantidadeCadeirasC || 0,
      quantidadeCadeirasD: contagem.quantidadeCadeirasD || 0,
      quantidadeGaleria: contagem.quantidadeGaleria || 0,
      quantidadeSalas: contagem.quantidadeSalas || 0,
      quantidadeExterno: contagem.quantidadeExterno || 0,
      quantidadeOnline: contagem.quantidadeOnline || 0,
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });
    setMensagem('Modo de edição ativado.');
  };

  const salvarCulto = async () => {
    setMensagem(editandoId ? 'Atualizando...' : 'Salvando...');

    const dadosCulto = {
      id: editandoId || undefined,
      data: form.data,
      turno: form.turno,
      liderRecepcao: form.liderRecepcao,
      contagens: [
        {
          quantidadePulpito: form.quantidadePulpito,
          quantidadeCadeirasA: form.quantidadeCadeirasA,
          quantidadeCadeirasB: form.quantidadeCadeirasB,
          quantidadeCadeirasC: form.quantidadeCadeirasC,
          quantidadeCadeirasD: form.quantidadeCadeirasD,
          quantidadeGaleria: form.quantidadeGaleria,
          quantidadeSalas: form.quantidadeSalas,
          quantidadeExterno: form.quantidadeExterno,
          quantidadeOnline: form.quantidadeOnline
        }
      ]
    };

    try {
      const url = editandoId 
        ? `http://localhost:5115/api/Cultos/${editandoId}` 
        : 'http://localhost:5115/api/Cultos';
      
      const metodo = editandoId ? 'PUT' : 'POST';

      const resposta = await fetch(url, {
        method: metodo,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dadosCulto)
      });

      if (resposta.ok) {
        setMensagem(editandoId ? 'Atualizado com sucesso!' : 'Salvo com sucesso!');
        limparFormulario();
        carregarCultos();
      } else {
        setMensagem('Erro ao salvar.');
      }
    } catch {
      setMensagem('Falha de conexão.');
    }
  };

  const excluirCulto = async (id: string) => {
    if (!window.confirm("Excluir registro?")) return;
    try {
      const resposta = await fetch(`http://localhost:5115/api/Cultos/${id}`, { method: 'DELETE' });
      if (resposta.ok) carregarCultos();
    } catch {
      alert('Erro ao excluir.');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', padding: '1rem', fontFamily: 'sans-serif' }}>

      <main style={{ textAlign: 'center', marginTop: '2rem', maxWidth: '900px', margin: '0 auto', width: '100%' }}>
        <h1>Recepção IBE</h1>
        <p>Controle de Contagem Setorial</p>

        <div style={{ border: editandoId ? '2px solid #0056b3' : '1px solid #ccc', padding: '20px', borderRadius: '8px', marginTop: '20px', backgroundColor: editandoId ? '#f0f8ff' : '#f9f9f9', textAlign: 'left' }}>
          
          <h3 style={{ marginTop: 0, marginBottom: '20px', color: editandoId ? '#0056b3' : '#333' }}>
            {editandoId ? '✏️ Editar Registro' : 'Nova Contagem'}
          </h3>

          <div style={{ display: 'flex', gap: '15px', marginBottom: '20px', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: '200px' }}>
              <label style={{ display: 'block', fontWeight: 'bold' }}>Data do Culto:</label>
              <input type="date" name="data" value={form.data} onChange={handleChange} style={{ width: '100%', padding: '8px' }} />
            </div>
            <div style={{ flex: 1, minWidth: '200px' }}>
              <label style={{ display: 'block', fontWeight: 'bold' }}>Turno:</label>
              <select name="turno" value={form.turno} onChange={handleChange} style={{ width: '100%', padding: '8px' }}>
                <option value={1}>Manhã</option>
                <option value={2}>Noite</option>
              </select>
            </div>
            <div style={{ flex: 1, minWidth: '200px' }}>
              <label style={{ display: 'block', fontWeight: 'bold' }}>Líder da Recepção:</label>
              <input type="text" name="liderRecepcao" value={form.liderRecepcao} onChange={handleChange} placeholder="Nome do Líder" style={{ width: '100%', padding: '8px' }} />
            </div>
          </div>

          <div style={{ backgroundColor: '#e2f0d9', padding: '10px', borderRadius: '5px', marginBottom: '20px', color: '#385723', textAlign: 'center' }}>
            <strong>Escala: {grupoRecepcaoCalculado}º Domingo</strong>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '15px' }}>
            <div><label>Púlpito</label><input type="number" name="quantidadePulpito" value={form.quantidadePulpito} onChange={handleChange} style={{ width: '100%', padding: '8px' }} /></div>
            <div><label>Cadeiras A</label><input type="number" name="quantidadeCadeirasA" value={form.quantidadeCadeirasA} onChange={handleChange} style={{ width: '100%', padding: '8px' }} /></div>
            <div><label>Cadeiras B</label><input type="number" name="quantidadeCadeirasB" value={form.quantidadeCadeirasB} onChange={handleChange} style={{ width: '100%', padding: '8px' }} /></div>
            <div><label>Cadeiras C</label><input type="number" name="quantidadeCadeirasC" value={form.quantidadeCadeirasC} onChange={handleChange} style={{ width: '100%', padding: '8px' }} /></div>
            <div><label>Cadeiras D</label><input type="number" name="quantidadeCadeirasD" value={form.quantidadeCadeirasD} onChange={handleChange} style={{ width: '100%', padding: '8px' }} /></div>
            <div><label>Galeria</label><input type="number" name="quantidadeGaleria" value={form.quantidadeGaleria} onChange={handleChange} style={{ width: '100%', padding: '8px' }} /></div>
            <div><label>Salas</label><input type="number" name="quantidadeSalas" value={form.quantidadeSalas} onChange={handleChange} style={{ width: '100%', padding: '8px' }} /></div>
            <div><label>Externo</label><input type="number" name="quantidadeExterno" value={form.quantidadeExterno} onChange={handleChange} style={{ width: '100%', padding: '8px' }} /></div>
            <div><label>Online</label><input type="number" name="quantidadeOnline" value={form.quantidadeOnline} onChange={handleChange} style={{ width: '100%', padding: '8px' }} /></div>
          </div>

          <div style={{ marginTop: '25px', padding: '15px', backgroundColor: '#e9ecef', borderRadius: '5px', textAlign: 'center' }}>
            <h2>Total: {totalEmTempoReal}</h2>
          </div>

          <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
            <button onClick={salvarCulto} style={{ flex: 1, padding: '15px', backgroundColor: '#0056b3', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
              {editandoId ? 'Atualizar' : 'Salvar'}
            </button>
            {editandoId && (
              <button onClick={limparFormulario} style={{ padding: '15px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
                Cancelar
              </button>
            )}
          </div>

          {mensagem && <p style={{ marginTop: '15px', textAlign: 'center', fontWeight: 'bold', color: mensagem.includes('sucesso') ? 'green' : '#0056b3' }}>{mensagem}</p>}
        </div>

        <div style={{ marginTop: '40px', overflowX: 'auto' }}>
          <h3>Histórico (Ordem Cronológica)</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'center', backgroundColor: '#fff', border: '1px solid #ccc' }}>
            <thead style={{ backgroundColor: '#eee' }}>
              <tr>
                <th style={{ padding: '10px', borderBottom: '1px solid #ccc' }}>Data</th>
                <th style={{ padding: '10px', borderBottom: '1px solid #ccc' }}>Turno</th>
                <th style={{ padding: '10px', borderBottom: '1px solid #ccc' }}>Líder (Grupo)</th>
                <th style={{ padding: '10px', borderBottom: '1px solid #ccc', color: '#0056b3' }}>Total</th>
                <th style={{ padding: '10px', borderBottom: '1px solid #ccc' }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {listaCultos.map((culto) => (
                <tr key={culto.id} style={{ borderBottom: '1px solid #eee', backgroundColor: editandoId === culto.id ? '#f0f8ff' : 'transparent' }}>
                  <td style={{ padding: '10px' }}>{culto.data.split('-').reverse().join('/')}</td>
                  <td style={{ padding: '10px' }}>{culto.turno === 1 ? 'Manhã' : 'Noite'}</td>
                  <td style={{ padding: '10px' }}>{culto.liderRecepcao} ({culto.grupoRecepcao}º)</td>
                  <td style={{ padding: '10px', fontWeight: 'bold' }}>{culto.contagens[0]?.total || 0}</td>
                  <td style={{ padding: '10px', display: 'flex', justifyContent: 'center', gap: '8px' }}>
                    <button onClick={() => prepararEdicao(culto)} style={{ padding: '5px 10px', backgroundColor: '#ffc107', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Editar</button>
                    <button onClick={() => excluirCulto(culto.id)} style={{ padding: '5px 10px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Excluir</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      <footer style={{ textAlign: 'center', padding: '1.5rem', fontSize: '12px', color: 'gray' }}>
        <p><strong>Copyright &copy; 2026 - Igreja Batista Emanuel.</strong></p>
      </footer>
    </div>
  );
}

export default App;