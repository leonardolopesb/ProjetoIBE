import { useState, useEffect, useCallback } from 'react';
import type { Cores, Culto } from '../types';
import type { Usuario } from '../App';

interface ProfileProps {
  cores: Cores;
  setTela: (tela: 'home' | 'contagem' | 'config' | 'login' | 'perfil') => void;
  usuarioLogado: Usuario;
  mostrarMensagem: (texto: string, tipo: 'sucesso' | 'erro' | 'info') => void;
}

interface InputSenhaProps {
  label: string;
  valor: string;
  setValor: (valor: string) => void;
  ver: boolean;
  setVer: (ver: boolean) => void;
  cores: Cores; // Adicionado para receber as cores do componente pai
  placeholder?: string;
}

// 1. COMPONENTE AUXILIAR (Extraído para fora para melhor performance e não perder o foco)
const InputSenha = ({ label, valor, setValor, ver, setVer, cores, placeholder = "Repita a senha acima" }: InputSenhaProps) => (
  <div style={{ marginBottom: '20px' }}>
    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: cores.subtexto, marginBottom: '8px', textTransform: 'uppercase' }}>
      {label}
    </label>
    <div style={{ position: 'relative' }}>
      <input 
        type={ver ? "text" : "password"} 
        value={valor} 
        onChange={e => setValor(e.target.value)} 
        required 
        minLength={8} 
        placeholder={placeholder} 
        style={{ width: '100%', padding: '14px', paddingRight: '48px', backgroundColor: cores.inputFundo, color: cores.inputTexto, borderRadius: '8px', border: 'none', outline: 'none', boxSizing: 'border-box' }} 
      />
      <button 
        type="button" 
        onClick={() => setVer(!ver)} 
        style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: cores.subtexto, cursor: 'pointer', fontSize: '1.2rem', padding: '0' }}
      >
        {ver ? '🙊' : '🙈​'}
      </button>
    </div>
  </div>
);

// 2. COMPONENTE PRINCIPAL
export function Profile({ cores, setTela, usuarioLogado, mostrarMensagem }: ProfileProps) {
  // Estados do Formulário de Senha
  const [senhaAntiga, setSenhaAntiga] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [carregando, setCarregando] = useState(false);

  // Estados dos Olhinhos
  const [verAntiga, setVerAntiga] = useState(false);
  const [verNova, setVerNova] = useState(false);
  const [verConfirmacao, setVerConfirmacao] = useState(false);

  // Estados do Painel Admin
  const isAdmin = usuarioLogado.role === 'admin';
  const [cultosDeletados, setCultosDeletados] = useState<Culto[]>([]);

  // 3. FUNÇÕES DE DADOS E API
  const carregarDeletados = useCallback(async () => {
    try {
      const resposta = await fetch('https://projetoibe.onrender.com/api/Cultos/deletados');
      if (resposta.ok) {
        const dados = await resposta.json();
        setCultosDeletados(dados);
      }
    } catch {
      mostrarMensagem('Erro ao buscar a lixeira.', 'erro');
    }
  }, [mostrarMensagem]);

  useEffect(() => {
    if (isAdmin) carregarDeletados();
  }, [isAdmin, carregarDeletados]);

  const handleMudarSenha = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (novaSenha !== confirmarSenha) {
      mostrarMensagem('A nova senha e a confirmação não batem.', 'erro');
      return;
    }
    if (novaSenha.length < 8) {
      mostrarMensagem('A nova senha deve ter no mínimo 8 caracteres.', 'erro');
      return;
    }

    setCarregando(true);
    try {
      const resposta = await fetch('https://projetoibe.onrender.com/api/User/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: usuarioLogado.username, currentPassword: senhaAntiga, newPassword: novaSenha })
      });

      if (resposta.ok) {
        mostrarMensagem('Senha alterada com sucesso!', 'sucesso');
        setSenhaAntiga(''); setNovaSenha(''); setConfirmarSenha('');
        setTimeout(() => setTela('home'), 1500);
      } else {
        const erros = await resposta.json();
        mostrarMensagem('Erro: ' + (Array.isArray(erros) ? erros[0] : 'Senha atual incorreta.'), 'erro');
      }
    } catch {
      mostrarMensagem('Falha de conexão com o servidor.', 'erro');
    } finally {
      setCarregando(false);
    }
  };

  const excluirPermanente = async (id: string) => {
    if (!window.confirm('Excluir este culto PERMANENTEMENTE? Esta ação não pode ser desfeita.')) return;
    
    try {
      const resposta = await fetch(`https://projetoibe.onrender.com/api/Cultos/${id}/permanente`, { method: 'DELETE' });
      if (resposta.ok) {
        mostrarMensagem('Culto apagado para sempre.', 'sucesso');
        carregarDeletados();
      }
    } catch {
      mostrarMensagem('Erro ao excluir definitivamente.', 'erro');
    }
  };

  // 4. RENDERIZAÇÃO DA INTERFACE
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '40px 20px', minHeight: '100vh', boxSizing: 'border-box' }}>
      
      {/* CABEÇALHO */}
      <div style={{ width: '100%', maxWidth: '420px', display: 'flex', justifyContent: 'space-between', marginBottom: '30px' }}>
        <button onClick={() => setTela('home')} style={{ background: 'none', border: 'none', color: cores.subtexto, fontSize: '1rem', cursor: 'pointer', fontWeight: 'bold' }}>← Voltar</button>
        <h2 style={{ margin: 0, color: cores.texto }}>Meu Perfil</h2>
        <div style={{ width: '50px' }}></div>
      </div>

      {/* FORMULÁRIO DE SENHA */}
      <form onSubmit={handleMudarSenha} style={{ width: '100%', maxWidth: '420px', backgroundColor: cores.cartao, padding: '32px', borderRadius: '16px', border: `1px solid ${cores.borda}`, boxShadow: '0 10px 30px rgba(0,0,0,0.05)', marginBottom: '32px' }}>
        
        <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: cores.subtexto, marginBottom: '8px', textTransform: 'uppercase' }}>Usuário Logado</label>
        <div style={{ width: '100%', padding: '16px', backgroundColor: cores.botaoInativoFundo, color: cores.subtexto, borderRadius: '8px', border: 'none', marginBottom: '32px', fontWeight: 'bold', boxSizing: 'border-box' }}>
          {usuarioLogado.username} 
          <span style={{ float: 'right', fontWeight: 'normal', fontSize: '0.8rem', textTransform: 'uppercase' }}>({usuarioLogado.role})</span>
        </div>

        <h3 style={{ marginTop: 0, color: cores.texto, borderBottom: `1px solid ${cores.borda}`, paddingBottom: '10px', marginBottom: '20px', fontSize: '1.1rem' }}>Segurança</h3>
        
        <InputSenha label="Senha Atual" valor={senhaAntiga} setValor={setSenhaAntiga} ver={verAntiga} setVer={setVerAntiga} cores={cores} placeholder="Sua senha atual..." />
        <InputSenha label="Nova Senha" valor={novaSenha} setValor={setNovaSenha} ver={verNova} setVer={setVerNova} cores={cores} placeholder="Mínimo de 8 caracteres" />
        <InputSenha label="Confirmar Nova Senha" valor={confirmarSenha} setValor={setConfirmarSenha} ver={verConfirmacao} setVer={setVerConfirmacao} cores={cores} />

        <button type="submit" disabled={carregando} style={{ width: '100%', padding: '16px', backgroundColor: cores.primaria, color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '1rem', cursor: carregando ? 'default' : 'pointer', opacity: carregando ? 0.7 : 1, marginTop: '10px' }}>
          {carregando ? 'Salvando...' : 'Atualizar Senha'}
        </button>
      </form>

      {/* PAINEL DO ADMIN: LIXEIRA */}
      {isAdmin && (
        <div style={{ width: '100%', maxWidth: '420px', backgroundColor: cores.cartao, padding: '24px', borderRadius: '16px', border: `1px solid ${cores.borda}` }}>
          <h3 style={{ marginTop: 0, color: cores.texto, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            🗑️ Lixeira de Cultos
          </h3>
          
          {cultosDeletados.length === 0 ? (
            <p style={{ color: cores.hint, textAlign: 'center', fontSize: '0.9rem', margin: '10px 0' }}>Nenhum culto excluído no momento.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {cultosDeletados.map(c => (
                <div key={c.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', backgroundColor: cores.fundo, borderRadius: '8px', border: `1px solid ${cores.borda}` }}>
                  <div>
                    <strong style={{ display: 'block', color: cores.texto, fontSize: '0.9rem' }}>
                      {c.data.split('-').reverse().join('/')}
                    </strong>
                    <span style={{ color: cores.subtexto, fontSize: '0.8rem' }}>Líder: {c.lider_recepcao}</span>
                  </div>
                  <button 
                    onClick={() => excluirPermanente(c.id)} 
                    style={{ backgroundColor: '#EF4444', color: 'white', border: 'none', borderRadius: '6px', padding: '6px 12px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.8rem' }} 
                    title="Excluir Permanentemente"
                  >
                    Apagar
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}