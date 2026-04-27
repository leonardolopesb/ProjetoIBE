import { useState, useEffect, type ChangeEvent } from 'react';
import type { Culto, FormState } from './types';
import { Home } from './components/Home';
import { Contagem } from './components/Contagem';

function App() {
  const dataHoje = new Date().toISOString().split('T')[0];

  const [tela, setTela] = useState<'home' | 'contagem'>('home');
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [listaCultos, setListaCultos] = useState<Culto[]>([]);
  const [mensagem, setMensagem] = useState<string>('');

  const [form, setForm] = useState<FormState>({
    data: dataHoje,
    turno: 1,
    liderRecepcao: '',
    quantidadePulpito: 0, quantidadeCadeirasA: 0, quantidadeCadeirasB: 0,
    quantidadeCadeirasC: 0, quantidadeCadeirasD: 0, quantidadeGaleria: 0,
    quantidadeSalas: 0, quantidadeExterno: 0, quantidadeOnline: 0,
  });

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
        setListaCultos(dados.sort((a, b) => a.data.localeCompare(b.data)));
      }
    } catch (error) {
      console.error("Erro na API", error);
    }
  };

  useEffect(() => {
    const inicializarDados = async () => {
      await carregarCultos();
    };
    inicializarDados();
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setForm({ ...form, [name]: type === 'number' || name === 'turno' ? Number(value) : value });
  };

  const incrementar = (campo: keyof FormState) => {
    setForm(prev => ({ ...prev, [campo]: (prev[campo] as number) + 1 }));
  };

  const decrementar = (campo: keyof FormState) => {
    setForm(prev => ({ ...prev, [campo]: Math.max(0, (prev[campo] as number) - 1) }));
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
  };

  const salvarCulto = async () => {
    setMensagem('Salvando...');
    const dadosCulto = {
      id: editandoId || undefined,
      data: form.data,
      turno: form.turno,
      liderRecepcao: form.liderRecepcao,
      contagens: [{
        quantidadePulpito: form.quantidadePulpito,
        quantidadeCadeirasA: form.quantidadeCadeirasA,
        quantidadeCadeirasB: form.quantidadeCadeirasB,
        quantidadeCadeirasC: form.quantidadeCadeirasC,
        quantidadeCadeirasD: form.quantidadeCadeirasD,
        quantidadeGaleria: form.quantidadeGaleria,
        quantidadeSalas: form.quantidadeSalas,
        quantidadeExterno: form.quantidadeExterno,
        quantidadeOnline: form.quantidadeOnline
      }]
    };

    try {
      const url = editandoId ? `http://localhost:5115/api/Cultos/${editandoId}` : 'http://localhost:5115/api/Cultos';
      const metodo = editandoId ? 'PUT' : 'POST';
      const resposta = await fetch(url, {
        method: metodo,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dadosCulto)
      });

      if (resposta.ok) {
        setMensagem(editandoId ? 'Atualizado com sucesso!' : 'Salvo com sucesso!');
        setTela('home');
        limparFormulario(); 
        carregarCultos();
        setTimeout(() => setMensagem(''), 3000); 
      }
    } catch { setMensagem('Erro de conexão.'); }
  };

  const excluirCulto = async (id: string) => {
    if (!window.confirm("Atenção: Excluir este registro permanentemente?")) return;
    
    try {
      const resposta = await fetch(`http://localhost:5115/api/Cultos/${id}`, { method: 'DELETE' });
      if (resposta.ok) {
        carregarCultos();
      } else {
        alert('Erro ao excluir no banco de dados.');
      }
    } catch {
      alert('Falha na API ao tentar excluir.');
    }
  };

  return (
    <div style={{ minHeight: '100vh', padding: '1rem', backgroundColor: '#f0f2f5', fontFamily: 'sans-serif' }}>
      <header style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1 style={{ marginBottom: '5px', color: '#333' }}>Recepção IBE</h1>
        <p style={{ margin: 0, color: '#666' }}>{tela === 'home' ? 'Configuração do Culto' : 'Contagem em Tempo Real'}</p>
      </header>

      {mensagem && (
        <div style={{ maxWidth: '600px', margin: '0 auto 20px auto', padding: '10px', backgroundColor: mensagem.includes('sucesso') ? '#d4edda' : '#fff3cd', color: mensagem.includes('sucesso') ? '#155724' : '#856404', borderRadius: '5px', textAlign: 'center', fontWeight: 'bold' }}>
          {mensagem}
        </div>
      )}

      {tela === 'home' ? (
        <Home 
          form={form} 
          editandoId={editandoId} 
          listaCultos={listaCultos} 
          grupoRecepcaoCalculado={grupoRecepcaoCalculado}
          handleChange={handleChange} 
          setTela={setTela} 
          prepararEdicao={prepararEdicao}
          limparFormulario={limparFormulario}
          excluirCulto={excluirCulto}
        />
      ) : (
        <Contagem 
          form={form} 
          totalEmTempoReal={totalEmTempoReal} 
          setTela={setTela} 
          incrementar={incrementar} 
          decrementar={decrementar} 
          salvarCulto={salvarCulto}
          handleChange={handleChange}
        />
      )}
    </div>
  );
}

export default App;