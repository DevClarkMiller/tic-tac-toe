// BOOTSTRAP
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js'; // Includes Popper.js

// CSS
import './App.css'

// COMPONENT
import Grid from './component/grid/Grid';

// CONTEXT
import { GridContextProvider } from './context/GridContext';

const App = () => {
  
  return (
    <GridContextProvider>
      <div className='w-100 h-100'>
        <h1>Tic-Tac-Toe</h1>
        <Grid />
      </div>
    </GridContextProvider>
  )
}

export default App;