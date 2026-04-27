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
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '10px' }} >
      
      {/* Injeção de CSS puro para sumir com as setinhas nativas dos navegadores 
        sem precisar criar um arquivo App.css externo.
      */}
      <style>{`
        /* Esconde no Chrome, Edge e Safari */
        input[type="number"]::-webkit-inner-spin-button,
        input[type="number"]::-webkit-outer-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        /* Esconde no Firefox */
        input[type="number"] {
          -moz-appearance: textfield;
        }
      `}</style>

      {/* Cabeçalho simples */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <button onClick={() => setTela('home')} style={{ padding: '10px 15px', cursor: 'pointer', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '4px' }}>← Voltar</button>
        <h2 style={{ margin: 0, color: '#333' }}>Total: {totalEmTempoReal}</h2>
        <button onClick={salvarCulto} style={{ padding: '10px 20px', backgroundColor: 'green', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>FINALIZAR</button>
      </div>

      {/* Card do Setor */}
      <div style={{ position: 'relative', border: '1px solid #ccc', borderRadius: '8px', padding: '40px 20px', textAlign: 'center', backgroundColor: '#fff' }}>
        
        {/* Botões de navegação lateral (dentro do card) */}
        <button 
          onClick={anterior}
          disabled={indiceAtual === 0}
          style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', fontSize: '2rem', cursor: indiceAtual === 0 ? 'not-allowed' : 'pointer', color: indiceAtual === 0 ? '#eee' : '#666' }}
        >
          ←
        </button>

        <button 
          onClick={proximo}
          disabled={indiceAtual === totalPaginas - 1}
          style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', fontSize: '2rem', cursor: indiceAtual === totalPaginas - 1 ? 'not-allowed' : 'pointer', color: indiceAtual === totalPaginas - 1 ? '#eee' : '#666' }}
        >
          →
        </button>
        
        <h3 style={{ fontSize: '1.8rem', margin: '0 0 20px 0', color: '#333' }}>{setorAtual.nome}</h3>

        {/* Input Numérico Direto */}
        <div style={{ marginBottom: '30px' }}>
          <input 
            type="number"
            name={setorAtual.id}
            pattern="[0-9]*" // Garante o teclado numérico em celulares
            value={form[setorAtual.id as keyof FormState] === 0 ? '' : form[setorAtual.id as keyof FormState]}
            onChange={handleChange}
            placeholder="0"
            style={{ 
              width: '120px', 
              height: '80px', 
              fontSize: '3rem', 
              textAlign: 'center', 
              border: '2px solid #ccc', 
              borderRadius: '8px', 
              fontWeight: 'bold', 
              outline: 'none' 
            }}
          />
        </div>

        {/* Botões de + e - */}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '20px' }}>
          <button 
            onClick={() => decrementar(setorAtual.id as keyof FormState)}
            style={{ width: '50px', height: '50px', fontSize: '1.5rem', borderRadius: '50%', border: '1px solid #ccc', cursor: 'pointer', backgroundColor: '#f9f9f9', color: '#dc3545', fontWeight: 'bold' }}
          >
            -
          </button>
          
          <button 
            onClick={() => incrementar(setorAtual.id as keyof FormState)}
            style={{ width: '90px', height: '90px', fontSize: '3.5rem', borderRadius: '50%', backgroundColor: '#0056b3', color: 'white', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}
          >
            +
          </button>
        </div>
      </div>

      {/* Bolinhas Indicadoras (Dots) */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '20px' }}>
        {setores.map((_, index) => (
          <div 
            key={index} 
            onClick={() => setIndiceAtual(index)}
            style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: index === indiceAtual ? '#0056b3' : '#ccc', cursor: 'pointer' }}
          />
        ))}
      </div>

    </div>
  );
}