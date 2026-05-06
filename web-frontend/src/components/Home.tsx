import { type ChangeEvent, useState } from 'react';
import type { Culto, FormState } from '../types';

interface HomeProps {
  form: FormState;
  editandoId: string | null;
  listaCultos: Culto[];
  grupoRecepcaoCalculado: number;
  handleChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  setTela: (tela: 'home' | 'contagem') => void;
  prepararEdicao: (culto: Culto) => void;
  limparFormulario: () => void;
  excluirCulto: (id: string) => void;
}

export function Home({
  form,
  editandoId,
  listaCultos,
  grupoRecepcaoCalculado,
  handleChange,
  setTela,
  prepararEdicao,
  limparFormulario,
  excluirCulto
}: HomeProps) {

  const [mostrarHistorico, setMostrarHistorico] = useState(false);
  const [cultoSelecionado, setCultoSelecionado] = useState<Culto | null>(null);

  return (
    <>
      <div style={{ maxWidth: '500px', margin: '0 auto', textAlign: 'left' }}>
        <div style={{ border: editandoId ? '2px solid #ffc107' : 'none', padding: '30px', borderRadius: '16px', backgroundColor: '#fff', boxShadow: '0 10px 30px rgba(0,0,0,0.15)' }}>
          <h3 style={{ textAlign: 'center', marginTop: 0, marginBottom: '25px', color: editandoId ? '#d39e00' : '#1A1A1A', fontSize: '1.5rem' }}>
            {editandoId ? '✏️ Editando Culto' : 'Novo Culto'}
          </h3>

          <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px', color: '#555' }}>Data:</label>
          <input type="date" name="data" value={form.data} onChange={handleChange} style={{ width: '100%', padding: '12px', marginBottom: '15px', fontSize: '1rem', boxSizing: 'border-box', borderRadius: '8px', border: '1px solid #ccc' }} />

          <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px', color: '#555' }}>Turno:</label>
          <select name="turno" value={form.turno} onChange={handleChange} style={{ width: '100%', padding: '12px', marginBottom: '15px', fontSize: '1rem', boxSizing: 'border-box', borderRadius: '8px', border: '1px solid #ccc' }}>
            <option value={1}>Manhã</option>
            <option value={2}>Noite</option>
          </select>

          <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px', color: '#555' }}>Líder da Recepção:</label>
          <input type="text" name="liderRecepcao" value={form.liderRecepcao} onChange={handleChange} placeholder="" style={{ width: '100%', padding: '12px', marginBottom: '20px', fontSize: '1rem', boxSizing: 'border-box', borderRadius: '8px', border: '1px solid #ccc' }} />

          <div style={{ backgroundColor: '#F8F9FA', padding: '12px', borderRadius: '8px', textAlign: 'center', marginBottom: '25px', border: '1px solid #E9ECEF' }}>
            <strong style={{ color: '#2a70f1' }}>Escala: {grupoRecepcaoCalculado}º Domingo</strong>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={() => setTela('contagem')}
              style={{ flex: 1, padding: '15px', backgroundColor: '#2a70f1', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1.1rem', boxShadow: '0 4px 10px rgba(195,0,34,0.3)' }}
            >
              Realizar Contagem
            </button>

            {editandoId && (
              <button
                onClick={limparFormulario}
                style={{ padding: '15px 20px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1.1rem' }}
                title="Cancelar Edição"
              >
                ✖
              </button>
            )}
          </div>
        </div>
      </div>

      <button
        onClick={() => setMostrarHistorico(true)}
        style={{
          position: 'fixed', bottom: '30px', right: '30px', width: '65px', height: '65px',
          borderRadius: '50%', backgroundColor: '#fff', color: '#C30022', border: 'none',
          boxShadow: '0 6px 15px rgba(0,0,0,0.4)', cursor: 'pointer', fontSize: '28px',
          display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 999,
          transition: 'transform 0.2s'
        }}
        title="Ver Histórico"
      >
        📋
      </button>

      {mostrarHistorico && (
        <div
          onClick={() => setMostrarHistorico(false)}
          style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.7)',
            display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, padding: '20px'
          }}>
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: 'white', padding: '30px', borderRadius: '16px', width: '100%',
              maxWidth: '650px', maxHeight: '85vh', overflowY: 'auto', position: 'relative',
              boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
            }}>

            <button
              onClick={() => setMostrarHistorico(false)}
              style={{ position: 'absolute', top: '5px', right: '5px', background: '#eee', border: 'none', borderRadius: '50%', width: '35px', height: '35px', fontSize: '1rem', cursor: 'pointer', fontWeight: 'bold' }}
            >
              ✖
            </button>

            <h3 style={{ marginTop: 0, marginBottom: '25px', textAlign: 'center', fontSize: '1.5rem', color: '#1A1A1A' }}>
              Histórico de Lançamentos
            </h3>

            {listaCultos.length === 0 ? (
              <p style={{ textAlign: 'center', color: 'gray', margin: '40px 0' }}>Nenhuma contagem salva ainda.</p>
            ) : (
              listaCultos.map(c => (
                <div key={c.id} style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', padding: '15px', border: '1px solid #eaeaea', alignItems: 'center', backgroundColor: '#fcfcfc', marginBottom: '10px', borderRadius: '8px' }}>

                  <div style={{ minWidth: '200px', marginBottom: '10px' }}>
                    <strong style={{ fontSize: '1.1rem', color: '#1A1A1A' }}>{c.data.split('-').reverse().join('/')}</strong> - {c.turno === 1 ? 'Manhã' : 'Noite'}
                    <br />
                    <small style={{ color: '#666', fontSize: '0.9rem' }}>
                      Líder: {c.liderRecepcao} • Total: <strong style={{ color: '#C30022' }}>{c.contagens[0]?.total || 0}</strong>
                    </small>
                  </div>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => setCultoSelecionado(c)}
                      style={{ padding: '8px 16px', backgroundColor: '#2a70f1', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
                    >
                      Ver Dados
                    </button>

                    <button
                      onClick={() => {
                        prepararEdicao(c);
                        setMostrarHistorico(false);
                      }}
                      style={{ padding: '8px 16px', backgroundColor: '#dfa843', color: '#1A1A1A', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
                    >
                      Editar
                    </button>

                    <button
                      onClick={() => excluirCulto(c.id)}
                      style={{ padding: '8px 16px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
                    >
                      Excluir
                    </button>
                  </div>

                </div>
              ))
            )}
          </div>
        </div>
      )}

      {cultoSelecionado && (
        <div
          onClick={() => setCultoSelecionado(null)}
          style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1001, padding: '20px' }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{ backgroundColor: 'white', padding: '30px', borderRadius: '16px', width: '100%', maxWidth: '400px', position: 'relative', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}
          >
            <button
              onClick={() => setCultoSelecionado(null)}
              style={{ position: 'absolute', top: '20px', right: '20px', background: '#eee', border: 'none', borderRadius: '50%', width: '35px', height: '35px', fontSize: '1rem', cursor: 'pointer', fontWeight: 'bold' }}
            >
              ✖
            </button>
            <h3 style={{ marginTop: 0, marginBottom: '20px', textAlign: 'center', color: '#1A1A1A' }}>Dados da Contagem</h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', fontSize: '1rem', color: '#555' }}>
              <div>Púlpito: <strong style={{ color: '#1A1A1A' }}>{cultoSelecionado.contagens[0]?.quantidadePulpito || 0}</strong></div>
              <div>Cadeiras A: <strong style={{ color: '#1A1A1A' }}>{cultoSelecionado.contagens[0]?.quantidadeCadeirasA || 0}</strong></div>
              <div>Cadeiras B: <strong style={{ color: '#1A1A1A' }}>{cultoSelecionado.contagens[0]?.quantidadeCadeirasB || 0}</strong></div>
              <div>Cadeiras C: <strong style={{ color: '#1A1A1A' }}>{cultoSelecionado.contagens[0]?.quantidadeCadeirasC || 0}</strong></div>
              <div>Cadeiras D: <strong style={{ color: '#1A1A1A' }}>{cultoSelecionado.contagens[0]?.quantidadeCadeirasD || 0}</strong></div>
              <div>Galeria: <strong style={{ color: '#1A1A1A' }}>{cultoSelecionado.contagens[0]?.quantidadeGaleria || 0}</strong></div>
              <div>Salas: <strong style={{ color: '#1A1A1A' }}>{cultoSelecionado.contagens[0]?.quantidadeSalas || 0}</strong></div>
              <div>Externo: <strong style={{ color: '#1A1A1A' }}>{cultoSelecionado.contagens[0]?.quantidadeExterno || 0}</strong></div>
              <div>Online: <strong style={{ color: '#1A1A1A' }}>{cultoSelecionado.contagens[0]?.quantidadeOnline || 0}</strong></div>
            </div>

            <div style={{ marginTop: '25px', paddingTop: '15px', borderTop: '1px solid #eee', textAlign: 'center', fontSize: '1.2rem', color: '#2a70f1' }}>
              Total: <strong>{cultoSelecionado.contagens[0]?.total || 0}</strong>
            </div>
          </div>
        </div>
      )}
    </>
  );
}