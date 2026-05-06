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

  const proximo = () => {
    if (indiceAtual < totalPaginas - 1) setIndiceAtual(indiceAtual + 1);
  };

  const anterior = () => {
    if (indiceAtual > 0) setIndiceAtual(indiceAtual - 1);
  };

  return (
    <div style={{ maxWidth: '500px', margin: '0 auto', padding: '20px 10px', height: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      <style>{`
        input[type="number"]::-webkit-inner-spin-button,
        input[type="number"]::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
        input[type="number"] { -moz-appearance: textfield; }
      `}</style>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <button onClick={() => setTela('home')} style={{ padding: '8px 12px', cursor: 'pointer', backgroundColor: '#e2e8f0', color: '#475569', border: 'none', borderRadius: '6px', fontWeight: 'bold' }}>Voltar</button>
        <h2 style={{ margin: 0, color: '#2a70f1', fontSize: '1.5rem' }}>Total: {totalEmTempoReal}</h2>
        <button onClick={salvarCulto} style={{ padding: '8px 16px', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>Salvar</button>
      </div>

      {/* Card Content - Flex grow pushes the + button down */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
        
        {/* Nav Buttons (Absolute) */}
        <button onClick={anterior} disabled={indiceAtual === 0} style={{ position: 'absolute', left: 0, top: '20%', background: 'none', border: 'none', fontSize: '2rem', cursor: indiceAtual === 0 ? 'default' : 'pointer', color: indiceAtual === 0 ? '#e2e8f0' : '#94a3b8' }}>←</button>
        <button onClick={proximo} disabled={indiceAtual === totalPaginas - 1} style={{ position: 'absolute', right: 0, top: '20%', background: 'none', border: 'none', fontSize: '2rem', cursor: indiceAtual === totalPaginas - 1 ? 'default' : 'pointer', color: indiceAtual === totalPaginas - 1 ? '#e2e8f0' : '#94a3b8' }}>→</button>

        {/* Sector Info */}
        <h3 style={{ fontSize: '2rem', color: '#1e293b', margin: '10px 0 30px 0' }}>{setorAtual.nome}</h3>

        {/* Number Input */}
        <input 
          type="number"
          name={setorAtual.id}
          pattern="[0-9]*"
          value={form[setorAtual.id as keyof FormState] === 0 ? '' : form[setorAtual.id as keyof FormState]}
          onChange={handleChange}
          placeholder="0"
          style={{ width: '150px', height: '100px', fontSize: '4rem', textAlign: 'center', border: '2px solid #cbd5e1', borderRadius: '12px', fontWeight: 'bold', color: '#0f172a', outlineColor: '#0ea5e9', marginBottom: '20px' }}
        />

        {/* Dots */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: 'auto' }}>
          {setores.map((_, index) => (
            <div key={index} style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: index === indiceAtual ? '#2a70f1' : '#cbd5e1' }} />
          ))}
        </div>

        {/* Fixed Bottom Controls */}
        <div style={{ width: '100%', position: 'fixed', bottom: '5%', left: 0, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '30px' }}>
          <button 
            onClick={() => decrementar(setorAtual.id as keyof FormState)}
            style={{ width: '60px', height: '60px', fontSize: '2rem', borderRadius: '50%', border: 'none', backgroundColor: '#d0d0d080', color: '#ef4444', fontWeight: 'bold', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
          >
            -
          </button>
          
          <button 
            onClick={() => incrementar(setorAtual.id as keyof FormState)}
            style={{ width: '300px', height: '300px', fontSize: '5rem', borderRadius: '50%', backgroundColor: '#2a70f1', color: 'white', border: 'none', boxShadow: '0 10px 15px -3px rgba(14, 165, 233, 0.5)', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', paddingBottom: '10px' }}
          >
            +
          </button>
        </div>

      </div>
    </div>
  );
}