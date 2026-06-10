import { useState, useEffect, type ChangeEvent } from 'react';
import type { Culto, FormState } from './types';
import { Home } from './components/Home';
import { Contagem } from './components/Contagem';

function App() {
  const dataHoje = new Date().toISOString().split('T')[0];

  const [tela, setTela] = useState<'home' | 'contagem'>('home');
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [listaCultos, setListaCultos] = useState<Culto[]>([]);
  const [mensagem, setMensagem] = useState<{ texto: string; tipo: 'sucesso' | 'erro' | 'info' } | null>(null);

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
  const textoEscala = ehSabado ? 'Renove' : `${Math.floor((diaSelecionado - 1) / 7) + 1}º Domingo`;

  const mostrarMensagem = (texto: string, tipo: 'sucesso' | 'erro' | 'info' = 'info') => {
    setMensagem({ texto, tipo });
    setTimeout(() => setMensagem(null), 3000);
  };

  const carregarCultos = async () => {
    try {
      const resposta = await fetch('https://projetoibe.onrender.com/api/Cultos');
      if (resposta.ok) {
        const dados: Culto[] = await resposta.json();
        // Ordena do mais recente para o mais antigo (melhor UX no histórico)
        setListaCultos(dados.sort((a, b) => b.data.localeCompare(a.data)));
      }
    } catch (error) {
      console.error('Erro na API', error);
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
      mostrarMensagem('Informe o nome do Líder da Recepção.', 'erro');
      return;
    }

    mostrarMensagem('Salvando...', 'info');

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
          D: form.quantidadeCadeirasD,
        },
        galeria: form.quantidadeGaleria,
        salas: form.quantidadeSalas,
        externo: form.quantidadeExterno,
        online: form.quantidadeOnline,
      },
    };

    try {
      const url = editandoId
        ? `https://projetoibe.onrender.com/api/Cultos/${editandoId}`
        : 'https://projetoibe.onrender.com/api/Cultos';

      const resposta = await fetch(url, {
        method: editandoId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dadosCulto),
      });

      if (resposta.ok) {
        mostrarMensagem(editandoId ? 'Atualizado com sucesso!' : 'Salvo com sucesso!', 'sucesso');
        setTela('home');
        limparFormulario();
        carregarCultos();
      } else {
        mostrarMensagem('Erro ao salvar. Verifique o console.', 'erro');
        console.error(await resposta.text());
      }
    } catch {
      mostrarMensagem('Erro de conexão.', 'erro');
    }
  };

  const excluirCulto = async (id: string) => {
    if (!window.confirm('Excluir este registro permanentemente?')) return;

    try {
      const resposta = await fetch(`https://projetoibe.onrender.com/api/Cultos/${id}`, { method: 'DELETE' });
      if (resposta.ok) {
        if (editandoId === id) limparFormulario();
        carregarCultos();
      } else {
        mostrarMensagem('Erro ao excluir.', 'erro');
      }
    } catch {
      mostrarMensagem('Falha na conexão ao excluir.', 'erro');
    }
  };

  const cores = {
    primaria: '#4F46E5', // Cor roxa/azul das ações/chips
    fundo: '#F7F8FA',    // Fundo da página
    texto: '#0F172A',    // Títulos principais
    subtexto: '#64748B',  // Rótulos e subtítulos
    hint: '#94A3B8',      // Placeholder, botão desativado texto
    borda: '#E2E8F0',     // Bordas suaves
    cartao: '#FFFFFF',    // Fundo do cartão/formulário

    // Cores adicionais para inputs escuros e inativos
    inputFundo: '#1A1A1A',  // Cinza muito escuro para inputs
    inputTexto: '#FFFFFF',   // Texto branco dentro dos inputs
    botaoInativoFundo: '#F1F5F9', // Fundo cinza claro para botão desativado
    botaoInativoTexto: '#94A3B8', // Texto cinza para botão desativado
    chipFundo: '#F1F5F9',      // Fundo cinza claro para chip de escala
    chipTexto: '#1A1A1A',      // Texto escuro para chip de escala
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: cores.fundo, fontFamily: "'Inter', sans-serif" }}>

      {/* Toast de mensagem */}
      {mensagem && (
        <div style={{
          position: 'fixed', top: '20px', left: '50%', transform: 'translateX(-50%)',
          zIndex: 9999, padding: '12px 20px', borderRadius: '10px', fontSize: '14px',
          fontWeight: 600, boxShadow: '0 4px 20px rgba(0,0,0,0.15)', whiteSpace: 'nowrap',
          backgroundColor: mensagem.tipo === 'sucesso' ? '#D1FAE5' : mensagem.tipo === 'erro' ? '#FEE2E2' : '#EEF2FF',
          color: mensagem.tipo === 'sucesso' ? '#065F46' : mensagem.tipo === 'erro' ? '#991B1B' : '#3730A3',
        }}>
          {mensagem.texto}
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
          cores={cores}
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
          cores={cores}
        />
      )}
    </div>
  );
}

export default App;