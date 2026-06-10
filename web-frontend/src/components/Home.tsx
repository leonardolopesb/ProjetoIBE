import { type ChangeEvent, useState } from 'react';
import type { Cores, Culto, FormState } from '../types';

interface HomeProps {
  form: FormState;
  editandoId: string | null;
  listaCultos: Culto[];
  textoEscala: string;
  handleChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  setTela: (tela: 'home' | 'contagem') => void;
  prepararEdicao: (culto: Culto) => void;
  limparFormulario: () => void;
  excluirCulto: (id: string) => void;
  cores?: Cores;
}

export function Home({
  form,
  editandoId,
  listaCultos,
  textoEscala,
  handleChange,
  setTela,
  prepararEdicao,
  limparFormulario,
  excluirCulto
}: HomeProps) {

  const [mostrarHistorico, setMostrarHistorico] = useState(false);
  const [cultoSelecionado, setCultoSelecionado] = useState<Culto | null>(null);

  const liderPreenchido = form.liderRecepcao.trim() !== '';

  const alterarTurno = (valor: number) => {
    handleChange({
      target: { name: 'turno', value: valor.toString(), type: 'select-one' }
    } as unknown as ChangeEvent<HTMLSelectElement>);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', backgroundColor: '#F8F8F8', fontFamily: "'Inter', sans-serif", padding: '20px' }}>
      
      {/* Títulos alinhados à esquerda do cartão */}
      <div style={{ width: '100%', maxWidth: '420px', textAlign: 'center', marginBottom: '2rem' }}>
        <h1 style={{color: '#0F172A', fontSize: '2rem', fontWeight: 700 }}>
          Registro de Presença
        </h1>
      </div>

      {/* Cartão Principal */}
      <div style={{ width: '100%', maxWidth: '420px', backgroundColor: '#FFFFFF', borderRadius: '16px', padding: '32px', boxSizing: 'border-box', border: '1px solid gray', boxShadow: '0 10px 30px rgba(0,0,0,0.03)', position: 'relative' }}>
        
        {editandoId && (
          <h3 style={{ textAlign: 'center', marginTop: 0, marginBottom: '25px', color: '#d39e00', fontSize: '1.2rem' }}>
            Editando Culto
          </h3>
        )}

        {/* DATA */}
        <div style={{ marginBottom: '48px' }}>
          <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#64748B', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Data
          </label>
          <input 
            type="date" 
            name="data" 
            value={form.data} 
            onChange={handleChange} 
            style={{ width: '100%', padding: '14px 16px', backgroundColor: '#27272A', color: '#FFFFFF', borderRadius: '8px', border: 'none', fontSize: '1rem', boxSizing: 'border-box', outline: 'none', colorScheme: 'dark' }} 
          />
        </div>

        {/* TURNO */}
        {textoEscala !== 'Renove' && (
          <div style={{ marginBottom: '48px' }}>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#64748B', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Turno
            </label>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                type="button"
                onClick={() => alterarTurno(1)}
                style={{
                  flex: 1, padding: '16px', borderRadius: '8px', fontSize: '1rem', fontWeight: 600, cursor: 'pointer', transition: 'all 1s',
                  backgroundColor: form.turno === 1 ? '#27272A' : 'transparent',
                  color: form.turno === 1 ? '#FFFFFF' : '#27272A',
                  border: form.turno === 1 ? 'none' : '1px solid #F8FAFC'
                }}
              >
                Manhã
              </button>
              <button
                type="button"
                onClick={() => alterarTurno(2)}
                style={{
                  flex: 1, padding: '16px', borderRadius: '8px', fontSize: '1rem', fontWeight: 600, cursor: 'pointer', transition: 'all 1s',
                  backgroundColor: form.turno === 2 ? '#27272A' : 'transparent',
                  color: form.turno === 2 ? '#FFFFFF' : '#27272A',
                  border: form.turno === 2 ? 'none' : '1px solid #F8FAFC'
                }}
              >
                Noite
              </button>
            </div>
          </div>
        )}

        {/* LÍDER DA RECEPÇÃO */}
        <div style={{ marginBottom: '8px' }}>
          <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#64748B', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Líder da Recepção
          </label>
          <input 
            type="text" 
            name="liderRecepcao" 
            value={form.liderRecepcao} 
            onChange={handleChange} 
            placeholder="Nome do líder da escala" 
            style={{ 
              width: '100%', padding: '14px 16px', backgroundColor: '#27272A', color: '#F8FAFC', borderRadius: '8px', fontSize: '1rem', boxSizing: 'border-box', outline: 'none',
              border: !liderPreenchido ? '1px solid #ffcccc' : '1px solid transparent'
            }} 
          />
        </div>

        {/* ESCALA */}
        <div style={{ display: 'inline-flex', alignItems: 'center', backgroundColor: '#F8FAFC', padding: '12px', borderRadius: '999px', marginBottom: '24px' }}>
          <div style={{ width: '6px', height: '6px', backgroundColor: '#3B82F6', borderRadius: '50%', marginRight: '8px' }}></div>
          <span style={{ color: '#475569', fontSize: '0.9rem', fontWeight: 600 }}>{textoEscala}</span>
        </div>

        {/* Botões de Ação */}
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => {
              if (!liderPreenchido) {
                alert('Por favor, informe o nome do Líder da Recepção antes de iniciar a contagem.');
                return;
              }
              setTela('contagem');
            }}
            disabled={!liderPreenchido}
            style={{ 
              flex: 1, padding: '16px', borderRadius: '8px', fontWeight: 700, fontSize: '1rem', cursor: liderPreenchido ? 'pointer' : 'default', transition: 'all 0.2s',
              backgroundColor: liderPreenchido ? '#2a70f1' : '#2a70f170',
              color: liderPreenchido ? '#FFFFFF' : '#F1F5F9',
              border: liderPreenchido ? 'none' : '1px solid #F8FAFC'
            }}
          >
            Realizar contagem
          </button>

          {editandoId && (
            <button
              onClick={limparFormulario}
              style={{ padding: '16px 20px', backgroundColor: '#64748B', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem' }}
              title="Cancelar Edição"
            >
              ✖
            </button>
          )}
        </div>
      </div>
      
      <div style={{ marginTop: '30px', color: 'black', fontSize: '0.8rem', fontWeight: 600, letterSpacing: '0.5px' }}>
        Igreja Batista Emanuel em Boa Viagem © 2026
      </div>

      {/* Histórico de Contagens */}
      <button
        onClick={() => setMostrarHistorico(true)}
        style={{
          position: 'fixed', bottom: '40px', right: '40px', width: '56px', height: '56px',
          borderRadius: '16px', backgroundColor: '#FFFFFF', border: '1px solid #F1F5F9',
          boxShadow: '0 8px 24px rgba(0,0,0,0.06)', cursor: 'pointer', fontSize: '24px',
          display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 999,
          transition: 'transform 0.2s'
        }}
        title="Ver Histórico"
      >
        📋
      </button>

      {/* MODAL HISTÓRICO */}
      {mostrarHistorico && (
        <div
          onClick={() => setMostrarHistorico(false)}
          style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, padding: '20px' }}>
          <div
            onClick={(e) => e.stopPropagation()}
            style={{ backgroundColor: '#FFFFFF', padding: '30px', borderRadius: '20px', width: '100%', maxWidth: '650px', maxHeight: '85vh', overflowY: 'auto', position: 'relative', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>

            <button
              onClick={() => setMostrarHistorico(false)}
              style={{ position: 'absolute', top: '20px', right: '20px', background: '#F1F5F9', color: '#64748B', border: 'none', borderRadius: '50%', width: '32px', height: '32px', fontSize: '0.9rem', cursor: 'pointer', fontWeight: 'bold' }}
            >
              ✖
            </button>

            <h3 style={{ marginTop: 0, marginBottom: '25px', textAlign: 'center', fontSize: '1.4rem', color: '#0F172A', fontWeight: 700 }}>
              Histórico de Lançamentos
            </h3>

            {listaCultos.length === 0 ? (
              <p style={{ textAlign: 'center', color: '#94A3B8', margin: '40px 0' }}>Nenhuma contagem salva ainda.</p>
            ) : (
              listaCultos.map(c => (
                <div key={c.id} style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', padding: '16px', border: '1px solid #F1F5F9', alignItems: 'center', backgroundColor: '#F8FAFC', marginBottom: '12px', borderRadius: '12px' }}>

                  <div style={{ minWidth: '200px', marginBottom: '10px' }}>
                    <strong style={{ fontSize: '1.1rem', color: '#0F172A' }}>{c.data.split('-').reverse().join('/')}</strong> <span style={{ color: '#64748B' }}>- {c.horario}</span>
                    <br />
                    <small style={{ color: '#64748B', fontSize: '0.9rem', marginTop: '4px', display: 'block' }}>
                      Líder: {c.lider_recepcao} • Total: <strong style={{ color: '#2a70f1' }}>{c.contagens?.total || 0}</strong>
                    </small>
                  </div>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button onClick={() => setCultoSelecionado(c)} style={{ padding: '8px 16px', backgroundColor: '#2a70f1', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem' }}>
                      Ver
                    </button>
                    <button onClick={() => { prepararEdicao(c); setMostrarHistorico(false); }} style={{ padding: '8px 16px', backgroundColor: '#F59E0B', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem' }}>
                      Editar
                    </button>
                    <button onClick={() => excluirCulto(c.id)} style={{ padding: '8px 16px', backgroundColor: '#EF4444', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem' }}>
                      Excluir
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* MODAL DETALHES */}
      {cultoSelecionado && (
        <div
          onClick={() => setCultoSelecionado(null)}
          style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1001, padding: '20px' }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{ backgroundColor: '#FFFFFF', padding: '32px', borderRadius: '20px', width: '100%', maxWidth: '400px', position: 'relative', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}
          >
            <button
              onClick={() => setCultoSelecionado(null)}
              style={{ position: 'absolute', top: '20px', right: '20px', background: '#F1F5F9', color: '#64748B', border: 'none', borderRadius: '50%', width: '32px', height: '32px', fontSize: '0.9rem', cursor: 'pointer', fontWeight: 'bold' }}
            >
              ✖
            </button>
            <h3 style={{ marginTop: 0, marginBottom: '24px', textAlign: 'center', color: '#0F172A', fontSize: '1.3rem', fontWeight: 700 }}>Dados da Contagem</h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', fontSize: '1rem', color: '#64748B' }}>
              <div>Púlpito: <strong style={{ color: '#0F172A' }}>{cultoSelecionado.contagens?.pulpito || 0}</strong></div>
              <div>Cadeiras A: <strong style={{ color: '#0F172A' }}>{cultoSelecionado.contagens?.cadeiras?.A || 0}</strong></div>
              <div>Cadeiras B: <strong style={{ color: '#0F172A' }}>{cultoSelecionado.contagens?.cadeiras?.B || 0}</strong></div>
              <div>Cadeiras C: <strong style={{ color: '#0F172A' }}>{cultoSelecionado.contagens?.cadeiras?.C || 0}</strong></div>
              <div>Cadeiras D: <strong style={{ color: '#0F172A' }}>{cultoSelecionado.contagens?.cadeiras?.D || 0}</strong></div>
              <div>Galeria: <strong style={{ color: '#0F172A' }}>{cultoSelecionado.contagens?.galeria || 0}</strong></div>
              <div>Salas: <strong style={{ color: '#0F172A' }}>{cultoSelecionado.contagens?.salas || 0}</strong></div>
              <div>Externo: <strong style={{ color: '#0F172A' }}>{cultoSelecionado.contagens?.externo || 0}</strong></div>
              <div>Online: <strong style={{ color: '#0F172A' }}>{cultoSelecionado.contagens?.online || 0}</strong></div>
            </div>

            <div style={{ marginTop: '28px', paddingTop: '20px', borderTop: '1px solid #F1F5F9', textAlign: 'center', fontSize: '1.3rem', color: '#2a70f1', fontWeight: 700 }}>
              Total: <strong>{cultoSelecionado.contagens?.total || 0}</strong>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}