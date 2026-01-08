import React from 'react';
import './App.css';
import { ThemeProvider } from './context/ThemeContext';
import Button from './components/Button';
import Counter from './components/Counter';
import UserList from './components/UserList';

function App() {
  const handleClick = () => {
    alert('Button clicked!');
  };

  return (
    <ThemeProvider>
      <div className="App">
        <header className="App-header">
          <h1>Jest Testing Demonstration</h1>
          <p>
            A comprehensive React app showcasing various Jest testing patterns
          </p>
        </header>

        <main className="App-main">
          <section className="demo-section">
            <h2>Button Component</h2>
            <p>Demonstrates: Basic component testing, props, event handlers</p>
            <div className="button-demo">
              <Button onClick={handleClick}>Primary Button</Button>
              <Button variant="secondary" onClick={handleClick}>
                Secondary Button
              </Button>
              <Button variant="danger" onClick={handleClick}>
                Danger Button
              </Button>
              <Button disabled>Disabled Button</Button>
            </div>
          </section>

          <section className="demo-section">
            <h2>Counter Component</h2>
            <p>
              Demonstrates: State management, user interactions, conditional
              rendering
            </p>
            <Counter initialCount={0} min={0} max={10} />
          </section>

          <section className="demo-section">
            <h2>User List Component</h2>
            <p>
              Demonstrates: Async operations, loading states, error handling,
              mocking
            </p>
            <UserList limit={5} />
          </section>
        </main>

        <footer className="App-footer">
          <p>
            Run tests with: <code>npm test</code>
          </p>
          <p>
            View coverage: <code>npm test -- --coverage</code>
          </p>
        </footer>
      </div>
    </ThemeProvider>
  );
}

export default App;
