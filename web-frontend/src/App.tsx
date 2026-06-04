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

  const dataObjeto = new Date(`${form.data}T12:00:00`);
  const ehSabado = dataObjeto.getDay() === 6;
  const diaSelecionado = parseInt(form.data.split('-')[2], 10) || 1;

  // Se for sábado, o texto é 'Renove'. Se não, faz a conta normal do domingo.
  const textoEscala = ehSabado ? 'Renove' : `${Math.floor((diaSelecionado - 1) / 7) + 1}º Domingo`;

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
    const cont = culto.contagens || {};
    const cadeiras = cont.cadeiras || {};

    setForm({
      data: culto.data.split('T')[0],
      turno: culto.horario === 'Manhã' ? 1 : 2,
      liderRecepcao: culto.lider_recepcao || '',
      quantidadePulpito: cont.pulpito || 0,
      quantidadeCadeirasA: cadeiras.A || 0,
      quantidadeCadeirasB: cadeiras.B || 0,
      quantidadeCadeirasC: cadeiras.C || 0,
      quantidadeCadeirasD: cadeiras.D || 0,
      quantidadeGaleria: cont.galeria || 0,
      quantidadeSalas: cont.salas || 0,
      quantidadeExterno: cont.externo || 0,
      quantidadeOnline: cont.online || 0,
    });
  };

  const salvarCulto = async () => {
    if (form.liderRecepcao.trim() === '') {
      setMensagem('Erro: O nome do Líder da Recepção é obrigatório!');
      setTimeout(() => setMensagem(''), 1000);
      return;
    }

    setMensagem('Salvando...');
    const dadosCulto = {
      ...(editandoId && { id: editandoId }),
      data: form.data,
      horario: form.turno === 1 ? 'Manhã' : 'Noite',
      lider_recepcao: form.liderRecepcao,
      contagens: {
        pulpito: form.quantidadePulpito,
        cadeiras: {
          A: form.quantidadeCadeirasA,
          B: form.quantidadeCadeirasB,
          C: form.quantidadeCadeirasC,
          D: form.quantidadeCadeirasD
        },
        galeria: form.quantidadeGaleria,
        salas: form.quantidadeSalas,
        externo: form.quantidadeExterno,
        online: form.quantidadeOnline
      }
    };

    try {
      const url = editandoId ? `http://localhost:5115/api/Cultos/${editandoId}` : 'http://localhost:5115/api/Cultos';
      const resposta = await fetch(url, {
        method: editandoId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dadosCulto)
      });

      if (resposta.ok) {
        setMensagem(editandoId ? 'Atualizado com sucesso!' : 'Salvo com sucesso!');
        setTela('home');
        limparFormulario();
        carregarCultos();
        setTimeout(() => setMensagem(''), 3000);
      } else {
        setMensagem('Erro ao salvar. Verifique o console.');
        console.error(await resposta.text());
      }
    } catch {
      setMensagem('Erro de conexão.');
    }
  };

  const excluirCulto = async (id: string) => {
    if (!window.confirm("Atenção: Excluir este registro permanentemente?")) return;

    try {
      const resposta = await fetch(`http://localhost:5115/api/Cultos/${id}`, { method: 'DELETE' });
      if (resposta.ok) {
        if (editandoId === id) limparFormulario();
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
          textoEscala={textoEscala}
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