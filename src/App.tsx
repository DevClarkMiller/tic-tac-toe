// CSS
import './App.css'

// COMPONENT
import Grid from './component/grid/Grid';

// CONTEXT
import { GridContextProvider } from './context/GridContext';
import GameTools from './component/grid/GameTools';

const App = () => {
  
  return (
    <GridContextProvider>
      <div className='w-100 h-100'>
        <h1>Tic-Tac-Toe</h1>
        <GameTools />
        <Grid />
      </div>
    </GridContextProvider>
  )
}

export default App;