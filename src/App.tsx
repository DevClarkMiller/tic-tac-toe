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
      <Grid />
    </GridContextProvider>
  )
}

export default App;