import { useState } from 'react';
import type { Cores } from '../types';
import type { Usuario } from '../App';

interface ProfileProps {
  cores: Cores;
  setTela: (tela: 'home' | 'contagem' | 'config' | 'login' | 'perfil') => void;
  usuarioLogado: Usuario;
  mostrarMensagem: (texto: string, tipo: 'sucesso' | 'erro' | 'info') => void;
}

export function Profile({ cores, setTela, usuarioLogado, mostrarMensagem }: ProfileProps) {
  const [senhaAntiga, setSenhaAntiga] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [carregando, setCarregando] = useState(false);

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
        body: JSON.stringify({
          username: usuarioLogado.username,
          currentPassword: senhaAntiga,
          newPassword: novaSenha
        })
      });

      if (resposta.ok) {
        mostrarMensagem('Senha alterada com sucesso!', 'sucesso');
        setSenhaAntiga('');
        setNovaSenha('');
        setConfirmarSenha('');
        setTimeout(() => setTela('home'), 1500); // Volta pra Home após o sucesso
      } else {
        const erros = await resposta.json();
        mostrarMensagem('Erro: ' + (Array.isArray(erros) ? erros[0] : 'Senha atual incorreta ou nova senha fraca.'), 'erro');
      }
    } catch {
      mostrarMensagem('Falha de conexão com o servidor.', 'erro');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '40px 20px', minHeight: '100vh', boxSizing: 'border-box' }}>
      
      {/* Header Voltar */}
      <div style={{ width: '100%', maxWidth: '420px', display: 'flex', justifyContent: 'space-between', marginBottom: '30px' }}>
        <button onClick={() => setTela('home')} style={{ background: 'none', border: 'none', color: cores.subtexto, fontSize: '1rem', cursor: 'pointer', fontWeight: 'bold' }}>← Voltar</button>
        <h2 style={{ margin: 0, color: cores.texto }}>Meu Perfil</h2>
        <div style={{ width: '50px' }}></div>
      </div>

      <form onSubmit={handleMudarSenha} style={{ width: '100%', maxWidth: '420px', backgroundColor: cores.cartao, padding: '32px', borderRadius: '16px', border: `1px solid ${cores.borda}`, boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
        
        {/* Username Bloqueado */}
        <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: cores.subtexto, marginBottom: '8px', textTransform: 'uppercase' }}>Usuário</label>
        <div style={{ width: '100%', padding: '16px', backgroundColor: cores.botaoInativoFundo, color: cores.subtexto, borderRadius: '8px', border: 'none', marginBottom: '24px', fontWeight: 'bold', boxSizing: 'border-box' }}>
          {usuarioLogado.username} <span style={{ float: 'right', fontWeight: 'normal', fontSize: '0.8rem', textTransform: 'uppercase' }}>({usuarioLogado.role})</span>
        </div>

        <h3 style={{ marginTop: 0, color: cores.texto, borderBottom: `1px solid ${cores.borda}`, paddingBottom: '10px', marginBottom: '20px', fontSize: '1.1rem' }}>Trocar Senha</h3>

        <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: cores.subtexto, marginBottom: '8px', textTransform: 'uppercase' }}>Senha Atual</label>
        <input type="password" value={senhaAntiga} onChange={e => setSenhaAntiga(e.target.value)} required style={{ width: '100%', padding: '14px', backgroundColor: cores.inputFundo, color: cores.inputTexto, borderRadius: '8px', border: 'none', marginBottom: '20px', outline: 'none', boxSizing: 'border-box' }} />

        <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: cores.subtexto, marginBottom: '8px', textTransform: 'uppercase' }}>Nova Senha</label>
        <input type="password" value={novaSenha} onChange={e => setNovaSenha(e.target.value)} required minLength={8} placeholder="Mínimo de 8 caracteres" style={{ width: '100%', padding: '14px', backgroundColor: cores.inputFundo, color: cores.inputTexto, borderRadius: '8px', border: 'none', marginBottom: '20px', outline: 'none', boxSizing: 'border-box' }} />

        <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: cores.subtexto, marginBottom: '8px', textTransform: 'uppercase' }}>Confirmar Nova Senha</label>
        <input type="password" value={confirmarSenha} onChange={e => setConfirmarSenha(e.target.value)} required minLength={8} style={{ width: '100%', padding: '14px', backgroundColor: cores.inputFundo, color: cores.inputTexto, borderRadius: '8px', border: 'none', marginBottom: '30px', outline: 'none', boxSizing: 'border-box' }} />

        <button type="submit" disabled={carregando} style={{ width: '100%', padding: '16px', backgroundColor: cores.primaria, color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '1rem', cursor: carregando ? 'default' : 'pointer', opacity: carregando ? 0.7 : 1 }}>
          {carregando ? 'Salvando...' : 'Atualizar Senha'}
        </button>
      </form>
    </div>
  );
}