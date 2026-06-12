import { useState, useEffect, type ChangeEvent } from 'react';
import type { Culto, FormState, Cores } from './types';
import { Home } from './components/Home';
import { Contagem } from './components/Contagem';
import { Login } from './components/Login';
import { Usuarios } from './components/Usuarios'; // Novo Import

export interface Usuario {
  username: string;
  role: 'admin' | 'lider' | 'equipe';
}

function App() {
  const dataHoje = new Date().toISOString().split('T')[0];

  const [tela, setTela] = useState<'login' | 'home' | 'contagem' | 'config'>('login');
  const [usuarioLogado, setUsuarioLogado] = useState<Usuario | null>(null);
  
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [listaCultos, setListaCultos] = useState<Culto[]>([]);
  const [mensagem, setMensagem] = useState<{ texto: string; tipo: 'sucesso' | 'erro' | 'info' } | null>(null);

  const [isDarkMode, setIsDarkMode] = useState(() => {
    const salvo = localStorage.getItem('theme');
    return salvo === 'dark';
  });

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    localStorage.setItem('theme', !isDarkMode ? 'dark' : 'light');
  };

  const [form, setForm] = useState<FormState>({
    data: dataHoje, turno: 1, liderRecepcao: '',
    quantidadePulpito: 0, quantidadeCadeirasA: 0, quantidadeCadeirasB: 0,
    quantidadeCadeirasC: 0, quantidadeCadeirasD: 0,
    quantidadeGaleria: 0, quantidadeSalas: 0, quantidadeExterno: 0, quantidadeOnline: 0,
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
    setTimeout(() => { setMensagem(null); }, 5000); 
  };

  const carregarCultos = async () => {
    try {
      const resposta = await fetch('https://projetoibe.onrender.com/api/Cultos');
      if (resposta.ok) {
        const dados: Culto[] = await resposta.json();
        setListaCultos(dados.sort((a, b) => b.data.localeCompare(a.data)));
      }
    } catch (error) { console.error('Erro na API', error); }
  };

  useEffect(() => {
    const inicializarDados = async () => {
      if (usuarioLogado && tela === 'home') carregarCultos();
    };
    inicializarDados();
  }, [usuarioLogado, tela]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setForm({ ...form, [name]: type === 'number' || name === 'turno' ? Number(value) : value });
  };

  const incrementar = (campo: keyof FormState) => setForm(prev => ({ ...prev, [campo]: (prev[campo] as number) + 1 }));
  const decrementar = (campo: keyof FormState) => setForm(prev => ({ ...prev, [campo]: Math.max(0, (prev[campo] as number) - 1) }));

  const limparFormulario = () => {
    setEditandoId(null);
    setForm({
      data: dataHoje, turno: 1, liderRecepcao: '',
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
      data: culto.data.split('T')[0], turno: culto.horario === 'Manhã' ? 1 : 2, liderRecepcao: culto.lider_recepcao || '',
      quantidadePulpito: cont.pulpito || 0, quantidadeCadeirasA: cadeiras.A || 0, quantidadeCadeirasB: cadeiras.B || 0,
      quantidadeCadeirasC: cadeiras.C || 0, quantidadeCadeirasD: cadeiras.D || 0, quantidadeGaleria: cont.galeria || 0,
      quantidadeSalas: cont.salas || 0, quantidadeExterno: cont.externo || 0, quantidadeOnline: cont.online || 0,
    });
  };

  const salvarCulto = async () => {
    if (form.liderRecepcao.trim() === '') return;
    const dadosCulto = {
      ...(editandoId && { id: editandoId }),
      data: form.data, horario: form.turno === 1 ? 'Manhã' : 'Noite', lider_recepcao: form.liderRecepcao,
      contagens: {
        pulpito: form.quantidadePulpito,
        cadeiras: { A: form.quantidadeCadeirasA, B: form.quantidadeCadeirasB, C: form.quantidadeCadeirasC, D: form.quantidadeCadeirasD },
        galeria: form.quantidadeGaleria, salas: form.quantidadeSalas, externo: form.quantidadeExterno, online: form.quantidadeOnline,
      },
    };
    try {
      const url = editandoId ? `https://projetoibe.onrender.com/api/Cultos/${editandoId}` : 'https://projetoibe.onrender.com/api/Cultos';
      const resposta = await fetch(url, { method: editandoId ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(dadosCulto) });
      if (resposta.ok) { 
        setTela('home'); limparFormulario(); carregarCultos(); 
        mostrarMensagem('Registro salvo com sucesso!', 'sucesso'); 
      }
    } catch { mostrarMensagem('Erro de conexão.', 'erro'); }
  };

  const excluirCulto = async (id: string) => {
    if (!window.confirm('Excluir registro permanentemente?')) return;
    try {
      const resposta = await fetch(`https://projetoibe.onrender.com/api/Cultos/${id}`, { method: 'DELETE' });
      if (resposta.ok) {
        carregarCultos();
        mostrarMensagem('Registro excluído.', 'info');
      }
    } catch { mostrarMensagem('Erro ao excluir.', 'erro'); }
  };

  const handleLoginSuccess = (usuario: Usuario) => {
    setUsuarioLogado(usuario);
    setTela('home');
  };

  const theme: Cores = {
    primaria: '#B00022', fundo: isDarkMode ? '#0F172A' : '#F8FAFC', texto: isDarkMode ? '#F8FAFC' : '#1E293B',
    subtexto: isDarkMode ? '#94A3B8' : '#64748B', hint: isDarkMode ? '#475569' : '#94A3B8', borda: isDarkMode ? '#334155' : '#E2E8F0',
    cartao: isDarkMode ? '#1E293B' : '#FFFFFF', inputFundo: isDarkMode ? '#111827' : '#27272A', inputTexto: '#FFFFFF',
    botaoInativoFundo: isDarkMode ? '#1E293B' : '#F1F5F9', botaoInativoTexto: isDarkMode ? '#475569' : '#94A3B8',
    chipFundo: isDarkMode ? '#111827' : '#F1F5F9', chipTexto: isDarkMode ? '#F8FAFC' : '#1E293B',
  };  

  return (
    <div style={{ minHeight: '100vh', backgroundColor: theme.fundo, color: theme.texto, transition: 'all 0.3s ease', position: 'relative' }}>
      
      {(tela === 'home' || tela === 'login') && (
        <button onClick={toggleTheme} style={{ position: 'fixed', top: '20px', right : '20px', zIndex: 1000, background: theme.cartao, border: `1px solid ${theme.borda}`, borderRadius: '12px', padding: '10px', cursor: 'pointer', fontSize: '1.2rem', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
          {isDarkMode ? '☀️' : '🌙'}
        </button>
      )}

      {mensagem && (
        <div style={{ position: 'fixed', top: '20px', left: '50%', transform: 'translateX(-50%)', zIndex: 9999, padding: '12px 20px', borderRadius: '10px', fontSize: '14px', backgroundColor: mensagem.tipo === 'sucesso' ? '#D1FAE5' : mensagem.tipo === 'erro' ? '#FEE2E2' : '#EFF6FF', color: mensagem.tipo === 'sucesso' ? '#065F46' : mensagem.tipo === 'erro' ? '#991B1B' : '#1E293B', boxShadow: '0 4px 20px rgba(0,0,0,0.15)', display: 'flex', alignItems: 'center', gap: '15px' }}>
          <strong>{mensagem.texto}</strong>
          <button onClick={() => setMensagem(null)} style={{ background: 'none', border: 'none', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', color: 'inherit', opacity: 0.6, padding: 0 }}>✖</button>
        </div>
      )}

      {/* ROTEAMENTO DE TELAS */}
      {tela === 'login' && (
        <Login cores={theme} onLoginSuccess={handleLoginSuccess} mostrarMensagem={mostrarMensagem} />
      )}

      {/* Rota modularizada de Usuários */}
      {tela === 'config' && usuarioLogado && (
        <Usuarios cores={theme} setTela={setTela} usuarioLogado={usuarioLogado} mostrarMensagem={mostrarMensagem} />
      )}

      {tela === 'home' && usuarioLogado && (
        <Home form={form} editandoId={editandoId} listaCultos={listaCultos} textoEscala={textoEscala} handleChange={handleChange} setTela={setTela} prepararEdicao={prepararEdicao} limparFormulario={limparFormulario} excluirCulto={excluirCulto} cores={theme} usuarioLogado={usuarioLogado} />
      )}
      {tela === 'contagem' && usuarioLogado && (
        <Contagem form={form} totalEmTempoReal={totalEmTempoReal} setTela={setTela} incrementar={incrementar} decrementar={decrementar} salvarCulto={salvarCulto} handleChange={handleChange} cores={theme} />
      )}
    </div>
  );
}

export default App;