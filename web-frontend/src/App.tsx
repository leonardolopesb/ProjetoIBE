import './App.css'

function App() {
  return (
    <>

    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', justifyContent: 'space-between', padding: '1rem' }}>
      
      <main style={{ textAlign: 'center', marginTop: '2rem' }}>
        <h1>Recepção IBE</h1>
        <p>Sistema interno para controle de contagens e cultos.</p>
        <p style={{ color: 'gray', fontStyle: 'italic' }}>Em breve: Relatórios e formulários de cadastro.</p>
      </main>

      <footer style={{ textAlign: 'center', padding: '1rem', fontSize: '12px', color: 'gray' }}>
        <p><strong>Copyright &copy; 2026 - Igreja Batista Emanuel. Todos os direitos reservados.</strong></p>
      </footer>

    </div>

    </>
  )
}

export default App
