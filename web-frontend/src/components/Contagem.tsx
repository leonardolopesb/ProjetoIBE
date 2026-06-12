import { useState, type ChangeEvent } from 'react';
import type { Cores, FormState } from '../types';

interface ContagemProps {
  form: FormState;
  totalEmTempoReal: number;
  setTela: (tela: 'home' | 'contagem' | 'config' | 'login') => void;
  incrementar: (campo: keyof FormState) => void;
  decrementar: (campo: keyof FormState) => void;
  salvarCulto: () => void;
  handleChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  cores: Cores;
}

export function Contagem({
  form, totalEmTempoReal, setTela, incrementar, decrementar, salvarCulto, handleChange, cores
}: ContagemProps) {
  
  const [indiceAtual, setIndiceAtual] = useState(0);
  const setores = [
    { id: 'quantidadePulpito', nome: 'Púlpito' },
    { id: 'quantidadeCadeirasA', nome: 'Cadeiras A' },
    { id: 'quantidadeCadeirasB', nome: 'Cadeiras B' },
    { id: 'quantidadeCadeirasC', nome: 'Cadeiras C' },
    { id: 'quantidadeCadeirasD', nome: 'Cadeiras D' },
    { id: 'quantidadeGaleria', nome: 'Galeria' },
    { id: 'quantidadeSalas', nome: 'Salas' },
    { id: 'quantidadeExterno', nome: 'Externo' },
    { id: 'quantidadeOnline', nome: 'Online' },
  ];

  const setorAtual = setores[indiceAtual];
  const proximo = () => { if (indiceAtual < setores.length - 1) setIndiceAtual(indiceAtual + 1); };
  const anterior = () => { if (indiceAtual > 0) setIndiceAtual(indiceAtual - 1); };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', width: '100%', maxWidth: '500px', margin: '0 auto', backgroundColor: cores.fundo, color: cores.texto, padding: '24px', boxSizing: 'border-box' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <button onClick={() => setTela('home')} style={{ padding: '12px', backgroundColor: cores.chipFundo, color: cores.texto, border: 'none', borderRadius: '12px', fontWeight: 700, cursor: 'pointer' }}>Voltar</button>
        <div style={{ textAlign: 'center' }}>
          <span style={{ fontSize: '0.7rem', fontWeight: 800, color: cores.subtexto, textTransform: 'uppercase' }}>Total</span>
          <h2 style={{ margin: 0, color: cores.primaria, fontSize: '2.2rem', fontWeight: 800 }}>{totalEmTempoReal}</h2>
        </div>
        <button onClick={salvarCulto} style={{ padding: '12px 20px', backgroundColor: cores.primaria, color: '#FFFFFF', border: 'none', borderRadius: '12px', fontWeight: 700, cursor: 'pointer' }}>Salvar</button>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', position: 'relative' }}>
        <button onClick={anterior} disabled={indiceAtual === 0} style={{ position: 'absolute', left: 0, background: 'none', border: 'none', fontSize: '3rem', color: indiceAtual === 0 ? cores.hint : cores.subtexto, cursor: indiceAtual === 0 ? 'default' : 'pointer' }}>‹</button>
        <button onClick={proximo} disabled={indiceAtual === setores.length - 1} style={{ position: 'absolute', right: 0, background: 'none', border: 'none', fontSize: '3rem', color: indiceAtual === setores.length - 1 ? cores.hint : cores.subtexto, cursor: indiceAtual === setores.length - 1 ? 'default' : 'pointer' }}>›</button>

        <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '20px', textTransform: 'uppercase' }}>{setorAtual.nome}</h3>
        
        <input 
          type="number"
          name={setorAtual.id}
          value={form[setorAtual.id as keyof FormState]}
          onChange={handleChange}
          style={{ width: '180px', height: '120px', fontSize: '4.5rem', textAlign: 'center', backgroundColor: cores.inputFundo, color: cores.inputTexto, border: 'none', borderRadius: '24px', fontWeight: 800, outline: 'none' }}
        />
      </div>

      <div style={{ display: 'flex', gap: '16px', height: '30vh', marginBottom: '20px' }}>
        <button onClick={() => decrementar(setorAtual.id as keyof FormState)} style={{ width: '80px', backgroundColor: '#FEE2E2', color: '#EF4444', border: 'none', borderRadius: '24px', fontSize: '3rem', cursor: 'pointer' }}>-</button> 
        <button onClick={() => incrementar(setorAtual.id as keyof FormState)} style={{ flex: 1, backgroundColor: cores.primaria, color: '#FFFFFF', border: 'none', borderRadius: '24px', fontSize: '5rem', cursor: 'pointer', boxShadow: `0 10px 20px ${cores.primaria}40` }}>+</button>
      </div>

      <div style={{ textAlign: 'center', color: cores.hint, fontSize: '0.75rem', fontWeight: 600, paddingBottom: '10px' }}>
        IBE © 2026
      </div>
    </div>
  );
}