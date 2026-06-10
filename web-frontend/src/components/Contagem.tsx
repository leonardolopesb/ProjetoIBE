import { useState, type ChangeEvent } from 'react';
import type { Cores, FormState } from '../types';

interface ContagemProps {
  form: FormState;
  totalEmTempoReal: number;
  setTela: (tela: 'home' | 'contagem') => void;
  incrementar: (campo: keyof FormState) => void;
  decrementar: (campo: keyof FormState) => void;
  salvarCulto: () => void;
  handleChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  cores?: Cores;
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
    // Container ocupando 100vh (tela inteira) e centralizado (maxWidth para desktop não quebrar)
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', width: '100%', maxWidth: '500px', margin: '0 auto', backgroundColor: '#FFFFFF', fontFamily: "'Inter', sans-serif", padding: '24px', boxSizing: 'border-box' }}>
      
      <style>{`
        input[type="number"]::-webkit-inner-spin-button,
        input[type="number"]::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
        input[type="number"] { -moz-appearance: textfield; }
      `}</style>

      {/* Header: Voltar, Total e Salvar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2vh' }}>
        <button 
          onClick={() => setTela('home')} 
          style={{ padding: '12px 18px', backgroundColor: '#F1F5F9', color: '#64748B', border: 'none', borderRadius: '12px', fontWeight: 700, cursor: 'pointer', fontSize: '0.95rem' }}>
          Voltar
        </button>
        
        <div style={{ textAlign: 'center' }}>
          <span style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '1.5px' }}>Total</span>
          <h2 style={{ margin: 0, color: '#2a70f1', fontSize: '2.2rem', fontWeight: 800, lineHeight: '1' }}>{totalEmTempoReal}</h2>
        </div>

        <button 
          onClick={salvarCulto} 
          style={{ padding: '12px 18px', backgroundColor: '#2a70f1', color: '#FFFFFF', border: 'none', borderRadius: '12px', fontWeight: 700, cursor: 'pointer', fontSize: '0.95rem', boxShadow: '0 4px 12px rgba(42, 112, 241, 0.3)' }}>
          Salvar
        </button>
      </div>

      {/* Área Central: Carrossel e Input Escuro (Ocupa o espaço disponível) */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', position: 'relative' }}>
        
        {/* Setas de navegação melhor posicionadas e maiores */}
        <button onClick={anterior} disabled={indiceAtual === 0} style={{ position: 'absolute', left: '-10px', background: 'none', border: 'none', fontSize: '3rem', color: indiceAtual === 0 ? '#F1F5F9' : '#94A3B8', cursor: indiceAtual === 0 ? 'default' : 'pointer', transition: 'color 0.2s', padding: '20px' }}>
          ‹
        </button>
        <button onClick={proximo} disabled={indiceAtual === totalPaginas - 1} style={{ position: 'absolute', right: '-10px', background: 'none', border: 'none', fontSize: '3rem', color: indiceAtual === totalPaginas - 1 ? '#F1F5F9' : '#94A3B8', cursor: indiceAtual === totalPaginas - 1 ? 'default' : 'pointer', transition: 'color 0.2s', padding: '20px' }}>
          ›
        </button>

        <h3 style={{ fontSize: '1.5rem', color: '#0F172A', fontWeight: 800, margin: '0 0 24px 0', textTransform: 'uppercase', letterSpacing: '1px' }}>
          {setorAtual.nome}
        </h3>
        
        {/* Input Maior */}
        <input 
          type="number"
          name={setorAtual.id}
          pattern="[0-9]*"
          value={form[setorAtual.id as keyof FormState] === 0 ? '' : form[setorAtual.id as keyof FormState]}
          onChange={handleChange}
          placeholder="0"
          style={{ width: '200px', height: '140px', fontSize: '5rem', textAlign: 'center', backgroundColor: '#27272A', color: '#FFFFFF', border: 'none', borderRadius: '24px', fontWeight: 800, outline: 'none', boxSizing: 'border-box', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}
        />

        {/* Pontos de paginação */}
        <div style={{ display: 'flex', gap: '8px', marginTop: '32px' }}>
          {setores.map((_, index) => (
            <div key={index} style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: index === indiceAtual ? '#2a70f1' : '#E2E8F0', transition: 'background-color 0.3s' }} />
          ))}
        </div>
      </div>

      {/* Zona Inferior: Botões Gigantes (+ enorme, - compacto) */}
      <div style={{ display: 'flex', gap: '16px', height: '35vh', minHeight: '200px', marginTop: '20px' }}>
        <button 
          onClick={() => decrementar(setorAtual.id as keyof FormState)}
          style={{ width: '90px', backgroundColor: '#FEE2E2', color: '#EF4444', border: 'none', borderRadius: '24px', fontSize: '3.5rem', fontWeight: 400, cursor: 'pointer', transition: 'transform 0.1s', display: 'flex', justifyContent: 'center', alignItems: 'center', paddingBottom: '10px' }}
        >
          -
        </button> 
        <button 
          onClick={() => incrementar(setorAtual.id as keyof FormState)}
          // flex: 1 faz o botão de + engolir todo o resto do espaço disponível na tela
          style={{ flex: 1, backgroundColor: '#2a70f1', color: '#FFFFFF', border: 'none', borderRadius: '24px', fontSize: '6rem', fontWeight: 300, cursor: 'pointer', boxShadow: '0 10px 30px rgba(42, 112, 241, 0.4)', transition: 'transform 0.1s', display: 'flex', justifyContent: 'center', alignItems: 'center', paddingBottom: '15px' }}
        >
          +
        </button>
      </div>

    </div>
  );
} 