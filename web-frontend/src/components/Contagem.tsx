import { useState, type ChangeEvent } from 'react';
import type { FormState } from '../types';

interface ContagemProps {
  form: FormState;
  totalEmTempoReal: number;
  setTela: (tela: 'home' | 'contagem') => void;
  incrementar: (campo: keyof FormState) => void;
  decrementar: (campo: keyof FormState) => void;
  salvarCulto: () => void;
  handleChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

export function Contagem({
  form,
  totalEmTempoReal,
  setTela,
  incrementar,
  decrementar,
  salvarCulto,
  handleChange
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
  const totalPaginas = setores.length;

  const proximo = () => { if (indiceAtual < totalPaginas - 1) setIndiceAtual(indiceAtual + 1); };
  const anterior = () => { if (indiceAtual > 0) setIndiceAtual(indiceAtual - 1); };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '10vh', height: '75vh', maxWidth: '600px', margin: '0 auto', padding: '16px', boxSizing: 'border-box', fontFamily: 'sans-serif' }}>
      
      <style>{`
        input[type="number"]::-webkit-inner-spin-button,
        input[type="number"]::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
        input[type="number"] { -moz-appearance: textfield; }
      `}</style>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button onClick={() => setTela('home')} style={{ padding: '10px 15px', backgroundColor: '#e2e8f0', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>Voltar</button>
        <h2 style={{ margin: 0, color: '#0ea5e9' }}>{totalEmTempoReal}</h2>
        <button onClick={salvarCulto} style={{ padding: '10px 20px', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>Salvar</button>
      </div>

      {/* Main Content (Setor, Input, Setas) */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', position: 'relative' }}>
        <button onClick={anterior} disabled={indiceAtual === 0} style={{ position: 'absolute', left: 0, background: 'none', border: 'none', fontSize: '2.5rem', color: indiceAtual === 0 ? '#f1f5f9' : '#94a3b8' }}>←</button>
        <button onClick={proximo} disabled={indiceAtual === totalPaginas - 1} style={{ position: 'absolute', right: 0, background: 'none', border: 'none', fontSize: '2.5rem', color: indiceAtual === totalPaginas - 1 ? '#f1f5f9' : '#94a3b8' }}>→</button>

        <h3 style={{ fontSize: '2rem', color: '#1e293b', marginBottom: '15px' }}>{setorAtual.nome}</h3>
        
        <input 
          type="number"
          name={setorAtual.id}
          pattern="[0-9]*"
          value={form[setorAtual.id as keyof FormState] === 0 ? '' : form[setorAtual.id as keyof FormState]}
          onChange={handleChange}
          placeholder="0"
          style={{ width: '150px', height: '90px', fontSize: '4rem', textAlign: 'center', border: '2px solid #cbd5e1', borderRadius: '12px', fontWeight: 'bold', color: '#0f172a', outlineColor: '#0ea5e9', marginBottom: '15px' }}
        />

        <div style={{ display: 'flex', gap: '8px' }}>
          {setores.map((_, index) => (
            <div key={index} style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: index === indiceAtual ? '#0ea5e9' : '#d0d0d0' }} />
          ))}
        </div>
      </div>

      {/* Zona Inferior de Ação Cega (Fixed Height) */}
      <div style={{ height: '32vh', display: 'flex', gap: '16px' }}>
        <button 
          onClick={() => decrementar(setorAtual.id as keyof FormState)}
          style={{ flex: 1, backgroundColor: '#fee2e2', color: '#ef4444', border: 'none', borderRadius: '32px', fontSize: '2.5rem', fontWeight: 'bold' }}
        >
          -
        </button> 
        <button 
          onClick={() => incrementar(setorAtual.id as keyof FormState)}
          style={{ flex: 3, backgroundColor: '#0ea5e9', color: 'white', border: 'none', borderRadius: '32px', fontSize: '6rem', fontWeight: 'bold' }}
        >
          +
        </button>
      </div>

    </div>
  );
}