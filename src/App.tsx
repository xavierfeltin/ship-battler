import './App.css';
import { GameRenderer } from './components/GameRenderer';

function App() {
  return (
    <div className="App">
      <h1>Ship Battler</h1>
      <GameRenderer width={1200} height={800}></GameRenderer>
    </div>
  );
}

export default App;