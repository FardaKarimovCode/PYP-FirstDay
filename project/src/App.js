import logo from './logo.svg';
import './index.scss'
import List from './components/List';
import Addİtem, {AddItem} from './components/Addİtem'
import Pagination from './components/pagination'
function App() {
  return (
    <div className="App">
      <div className="container">
      <Addİtem />
      </div>
     <List />
     <Pagination />
    </div>
  );
}

export default App;
