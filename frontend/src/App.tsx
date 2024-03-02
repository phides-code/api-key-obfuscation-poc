import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import './App.css';
import { Counter } from './features/counter/Counter';
// import { Quotes } from './features/quotes/Quotes';
// import logo from './logo.svg';
import Home from './components/Home';
import About from './components/About';

const App = () => {
    return (
        <div className='App'>
            <BrowserRouter>
                <Link to='/'>Home</Link>
                {` `}
                <Link to='/about'>About</Link>
                <Routes>
                    <Route path='/' element={<Home />} />
                    <Route path='/about' element={<About />} />
                </Routes>
            </BrowserRouter>
            <header className='App-header'>
                {/* <img src={logo} className='App-logo' alt='logo' /> */}
                <Counter />
                <p>
                    Edit <code>src/App.tsx</code> and save to reload.
                </p>
                {/* <Quotes /> */}
                {/* <span>
                    <span>Learn </span>
                    <a
                        className='App-link'
                        href='https://reactjs.org'
                        target='_blank'
                        rel='noopener noreferrer'
                    >
                        React
                    </a>
                    <span>, </span>
                    <a
                        className='App-link'
                        href='https://redux.js.org'
                        target='_blank'
                        rel='noopener noreferrer'
                    >
                        Redux
                    </a>
                    <span>, </span>
                    <a
                        className='App-link'
                        href='https://redux-toolkit.js.org'
                        target='_blank'
                        rel='noopener noreferrer'
                    >
                        Redux Toolkit
                    </a>
                    <span>, </span>
                    <a
                        className='App-link'
                        href='https://react-redux.js.org'
                        target='_blank'
                        rel='noopener noreferrer'
                    >
                        React Redux
                    </a>
                    ,<span> and </span>
                    <a
                        className='App-link'
                        href='https://reselect.js.org'
                        target='_blank'
                        rel='noopener noreferrer'
                    >
                        Reselect
                    </a>
                </span> */}
            </header>
        </div>
    );
};

export default App;
