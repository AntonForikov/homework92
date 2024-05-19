import Header from './components/Header/Header.tsx';
import {Container} from '@mui/material';
import {Route, Routes} from 'react-router-dom';
import {useAppSelector} from './app/hooks.ts';
import {selectUser} from './store/user/userSlice.ts';
import Login from './containers/Login.tsx';
import Register from './containers/Register.tsx';
import Chat from './containers/chat.tsx';

function App() {
  const user = useAppSelector(selectUser);

  return (
    <>
      <header>
        <Header/>
      </header>
      <main>
        <Container maxWidth="xl">
          <Routes>
            <Route path="/" element={
              !user
                ? <h1 style={{textAlign: 'center'}}>Please login to start chat</h1>
                : <Chat/>
            }/>

            <Route path="/register" element={<Register/>}/>
            <Route path="/login" element={<Login/>}/>
            <Route path="*" element={<h1>Not found</h1>}/>
          </Routes>
        </Container>
      </main>
    </>
  );
}

export default App;
