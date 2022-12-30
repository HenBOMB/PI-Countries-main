import { Switch, Route } from 'react-router-dom'

import Index from './routes/Home/Index';
import Home from './routes/Home/Home';
import Detail from './routes/Detail/Detail';
import Form from './routes/Form/Form';

function App() {
  return (
    <Switch>
      <Route path="/" exact render={() => <Index />} />
      <Route path="/home" exact render={() => <Home />} />
      <Route path="/form" exact render={() => <Form />} />
      <Route path="/detail/:id" exact render={() => <Detail />} />
    </Switch>
  );
}

export default App;
