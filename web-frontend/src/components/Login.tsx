import { useState } from 'react';
import type { Cores } from '../types';
import type { Usuario } from '../App';

interface LoginProps {
  cores: Cores;
  onLoginSuccess: (usuario: Usuario) => void;
  mostrarMensagem: (texto: string, tipo: 'sucesso' | 'erro' | 'info') => void;
}

export function Login({ cores, onLoginSuccess, mostrarMensagem }: LoginProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [carregando, setCarregando] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username.trim() || !password.trim()) {
      mostrarMensagem('Preencha todos os campos.', 'erro');
      return;
    }

    setCarregando(true);

    try {
      // Faz a requisição para o seu C# (Render)
      const resposta = await fetch('https://projetoibe.onrender.com/api/User/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      if (resposta.ok) {
        // Se a senha bater, o C# devolve o usuário e a role (Admin, Lider, Equipe)
        const dados = await resposta.json();
        onLoginSuccess({ username: dados.username, role: dados.role });
      } else {
        // Se der 401 Unauthorized, cai aqui
        mostrarMensagem('Usuário ou senha inválidos.', 'erro');
      }
    } catch {
      mostrarMensagem('Erro de conexão com o servidor.', 'erro');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', padding: '20px', boxSizing: 'border-box' }}>
      <form 
        onSubmit={handleLogin} 
        style={{ width: '100%', maxWidth: '380px', backgroundColor: cores.cartao, padding: '40px 30px', borderRadius: '24px', boxShadow: '0 10px 40px rgba(0,0,0,0.1)', border: `1px solid ${cores.borda}` }}
      >
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h2 style={{ color: cores.texto, margin: 0, fontSize: '1.8rem', fontWeight: 800 }}>Acesso</h2>
          <p style={{ color: cores.subtexto, margin: '5px 0 0 0', fontSize: '0.9rem' }}>Insira suas credenciais</p>
        </div>
        
        <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: cores.subtexto, marginBottom: '8px', textTransform: 'uppercase' }}>Usuário</label>
        <input 
          type="text" 
          value={username} 
          onChange={e => setUsername(e.target.value)} 
          placeholder="admin"
          style={{ width: '100%', padding: '16px', backgroundColor: cores.inputFundo, color: cores.inputTexto, borderRadius: '12px', border: 'none', marginBottom: '20px', outline: 'none', boxSizing: 'border-box' }} 
        />
        
        <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: cores.subtexto, marginBottom: '8px', textTransform: 'uppercase' }}>Senha</label>
        <input 
          type="password" 
          value={password} 
          onChange={e => setPassword(e.target.value)} 
          placeholder="••••••••"
          style={{ width: '100%', padding: '16px', backgroundColor: cores.inputFundo, color: cores.inputTexto, borderRadius: '12px', border: 'none', marginBottom: '32px', outline: 'none', boxSizing: 'border-box' }} 
        />
        
        <button 
          type="submit" 
          disabled={carregando}
          style={{ width: '100%', padding: '16px', backgroundColor: cores.primaria, color: '#fff', border: 'none', borderRadius: '12px', fontWeight: 'bold', fontSize: '1.1rem', cursor: carregando ? 'default' : 'pointer', opacity: carregando ? 0.7 : 1, transition: 'opacity 0.2s' }}
        >
          {carregando ? 'Autenticando...' : 'Entrar'}
        </button>
      </form>
    </div>
  );
}