import { useState, useEffect, type FormEvent } from 'react';
import type { Cores } from '../types';
import type { Usuario } from '../App';

interface UsuariosProps {
  cores: Cores;
  setTela: (tela: 'login' | 'home' | 'contagem' | 'config') => void;
  usuarioLogado: Usuario;
  mostrarMensagem: (texto: string, tipo?: 'sucesso' | 'erro' | 'info') => void;
}

export function Usuarios({ cores, setTela, usuarioLogado, mostrarMensagem }: UsuariosProps) {
  const [listaUsuarios, setListaUsuarios] = useState<{ id: string; username: string; role: string }[]>([]);
  const [novoUserForm, setNovoUserForm] = useState({ username: '', password: '', role: 'analista' });

  const carregarUsuarios = async () => {
    try {
      const resposta = await fetch('https://projetoibe.onrender.com/api/User');
      if (resposta.ok) {
        const dados = await resposta.json();
        setListaUsuarios(dados);
      }
    } catch (error) {
      console.error('Erro ao buscar usuários', error);
    }
  };

  useEffect(() => {
    const inicializarDados = async () => {
      if (usuarioLogado) carregarUsuarios();
    };
    inicializarDados();
  }, [usuarioLogado]);

  const handleCriarUsuario = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const resposta = await fetch('https://projetoibe.onrender.com/api/User/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(novoUserForm)
      });
      if (resposta.ok) {
        mostrarMensagem(`Usuário ${novoUserForm.username} criado com sucesso!`, 'sucesso');
        setNovoUserForm({ username: '', password: '', role: 'equipe' });
        if (usuarioLogado?.role === 'admin') carregarUsuarios();
      } else {
        const erros = await resposta.json();
        mostrarMensagem('Erro ao criar: ' + (Array.isArray(erros) ? erros[0] : 'Dados inválidos'), 'erro');
      }
    } catch {
      mostrarMensagem('Erro de conexão com o servidor.', 'erro');
    }
  };

  const excluirUsuario = async (id: string, username: string) => {
    if (username === usuarioLogado?.username) {
      mostrarMensagem('Você não pode excluir a sua própria conta ativa.', 'erro');
      return;
    }
    
    if (!window.confirm(`Tem certeza que deseja excluir o usuário ${username}?`)) return;
    
    try {
      const resposta = await fetch(`https://projetoibe.onrender.com/api/User/${id}`, { method: 'DELETE' });
      if (resposta.ok) {
        mostrarMensagem('Usuário excluído com sucesso.', 'info');
        carregarUsuarios();
      } else {
        mostrarMensagem('Erro ao excluir usuário.', 'erro');
      }
    } catch {
      mostrarMensagem('Falha na comunicação com o servidor.', 'erro');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '40px 20px' }}>
      
      {/* Header Voltar */}
      <div style={{ width: '100%', maxWidth: '420px', display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <button onClick={() => setTela('home')} style={{ background: 'none', border: 'none', color: cores.subtexto, fontSize: '1rem', cursor: 'pointer', fontWeight: 'bold' }}>← Voltar</button>
        <h2 style={{ margin: 0 }}>Gerenciar Usuários</h2>
        <div style={{ width: '50px' }}></div>
      </div>

      {/* FORMULÁRIO DE CRIAÇÃO */}
      <form onSubmit={handleCriarUsuario} style={{ width: '100%', maxWidth: '420px', backgroundColor: cores.cartao, padding: '32px', borderRadius: '16px', border: `1px solid ${cores.borda}`, marginBottom: '32px' }}>
        <h3 style={{ marginTop: 0, color: cores.texto }}>Novo Usuário</h3>
        
        <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: cores.subtexto, marginBottom: '8px', textTransform: 'uppercase' }}>Username</label>
        <input type="text" value={novoUserForm.username} onChange={e => setNovoUserForm({...novoUserForm, username: e.target.value})} style={{ width: '100%', padding: '14px', backgroundColor: cores.inputFundo, color: cores.inputTexto, borderRadius: '8px', border: 'none', marginBottom: '16px' }} required />

        <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: cores.subtexto, marginBottom: '8px', textTransform: 'uppercase' }}>Senha</label>
        <input type="password" value={novoUserForm.password} onChange={e => setNovoUserForm({...novoUserForm, password: e.target.value})} style={{ width: '100%', padding: '14px', backgroundColor: cores.inputFundo, color: cores.inputTexto, borderRadius: '8px', border: 'none', marginBottom: '16px' }} required minLength={8} />

        <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: cores.subtexto, marginBottom: '8px', textTransform: 'uppercase' }}>Permissão</label>
        <select value={novoUserForm.role} onChange={e => setNovoUserForm({...novoUserForm, role: e.target.value})} style={{ width: '100%', padding: '14px', backgroundColor: cores.inputFundo, color: cores.inputTexto, borderRadius: '8px', border: 'none', marginBottom: '24px' }}>
          <option value="analista">Analista de Dados</option>
          <option value="lider">Líder de Escala</option>
          {usuarioLogado.role === 'admin' && <option value="admin">Administrador</option>}
        </select>

        <button type="submit" style={{ width: '100%', padding: '16px', backgroundColor: cores.primaria, color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>Criar Conta</button>
      </form>

      {/* LISTA DE USUÁRIOS (Apenas Admin vê) */}
      {usuarioLogado.role === 'admin' && (
        <div style={{ width: '100%', maxWidth: '420px', backgroundColor: cores.cartao, padding: '24px', borderRadius: '16px', border: `1px solid ${cores.borda}` }}>
          <h3 style={{ marginTop: 0, color: cores.texto, marginBottom: '20px' }}>Usuários Cadastrados</h3>
          
          {listaUsuarios.length === 0 ? (
            <p style={{ color: cores.subtexto, textAlign: 'center' }}>Carregando usuários...</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {listaUsuarios.map((u) => (
                <div key={u.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', backgroundColor: cores.fundo, borderRadius: '8px', border: `1px solid ${cores.borda}` }}>
                  <div>
                    <strong style={{ display: 'block', color: cores.texto, fontSize: '1rem' }}>{u.username}</strong>
                    <span style={{ color: cores.subtexto, fontSize: '0.8rem', textTransform: 'uppercase', fontWeight: 600 }}>{u.role}</span>
                  </div>
                  
                  <button 
                    onClick={() => excluirUsuario(u.id, u.username)}
                    style={{ backgroundColor: '#EF4444', color: 'white', border: 'none', borderRadius: '6px', padding: '8px 12px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.8rem' }}
                  >
                    Excluir
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