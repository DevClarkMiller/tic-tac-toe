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
      <div className='w-100 h-100'>
        <h1>Tic-Tac-Toe</h1>
        <div className='container'>
          <div className='row flex-lg-row flex-column'>
            <GameTools />
            <Grid />
          </div>
        </div>
      </div>
    </GridContextProvider>
  )
}

export default App;