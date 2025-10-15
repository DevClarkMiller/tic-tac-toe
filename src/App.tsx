// CSS
import './App.css'

// COMPONENT
import Grid from './component/grid/Grid';

// CONTEXT
import { GridContextProvider } from './context/GridContext';
import GameTools from './component/GameTools/GameTools';

const App = () => {
  
  return (
    <GridContextProvider>
      <div className='w-100 min-vh-100 d-flex align-content-between flex-column'>
        <h1>Tic-Tac-Toe</h1>
        <div className='d-flex flex-column flex-grow-1'>
            <GameTools />
            <Grid />
          </div>
      </div>
    </GridContextProvider>
  )
}

export default App;