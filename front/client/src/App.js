// App.js
/* import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [context, setContext] = useState('');
  const [screenshots, setScreenshots] = useState([]);
  const [instructions, setInstructions] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleContextChange = (e) => {
    setContext(e.target.value);
  };

  const handleScreenshotChange = (e) => {
    setScreenshots(Array.from(e.target.files));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setInstructions('');

    if (screenshots.length === 0) {
      setError('Please upload at least one screenshot.');
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append('context', context);
    screenshots.forEach((file) => {
      formData.append('screenshots', file);
    });

    try {
      const response = await axios.post('http://localhost:3001/api/generate-instructions', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setInstructions(response.data.instructions);
    } catch (error) {
      setError('An error occurred while generating instructions. Please try again.');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <h1>Testing Instructions Generator</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="context">Context (optional):</label>
          <textarea
            id="context"
            value={context}
            onChange={handleContextChange}
            placeholder="Provide any additional context for the testing instructions"
          />
        </div>
        <div>
          <label htmlFor="screenshots">Screenshots (required):</label>
          <input
            type="file"
            id="screenshots"
            accept="image/*"
            multiple
            onChange={handleScreenshotChange}
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Generating...' : 'Generate Instructions'}
        </button>
      </form>
      {error && <p className="error">{error}</p>}
      {instructions && (
        <div className="instructions">
          <h2>Testing Instructions:</h2>
          <pre>{instructions}</pre>
        </div>
      )}
    </div>
  );
}

export default App;  */

// frontend/src/App.js
/* import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [context, setContext] = useState('');
  const [screenshots, setScreenshots] = useState([]);
  const [instructions, setInstructions] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleContextChange = (e) => {
    setContext(e.target.value);
  };

  const handleScreenshotChange = (e) => {
    setScreenshots(Array.from(e.target.files));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setInstructions('');

    if (screenshots.length === 0) {
      setError('Please upload at least one screenshot.');
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append('context', context);
    screenshots.forEach((file) => {
      formData.append('screenshots', file);
    });

    try {
      const response = await axios.post('http://localhost:3001/api/generate-instructions', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setInstructions(response.data.instructions);
    } catch (error) {
      setError('An error occurred while generating instructions. Please try again.');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <header>
        <h1>Testing Instructions Generator</h1>
      </header>
      <form className="form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="context">Context (optional):</label>
          <textarea
            id="context"
            value={context}
            onChange={handleContextChange}
            placeholder="Provide any additional context for the testing instructions"
            className="input"
          />
        </div>
        <div className="form-group">
          <label htmlFor="screenshots">Screenshots (required):</label>
          <input
            type="file"
            id="screenshots"
            accept="image/*"
            multiple
            onChange={handleScreenshotChange}
            className="input"
          />
        </div>
        <button type="submit" className="button" disabled={loading}>
          {loading ? 'Generating...' : 'Generate Instructions'}
        </button>
      </form>
      {error && <p className="error">{error}</p>}
      {instructions && (
        <div className="instructions">
          <h2>Testing Instructions:</h2>
          <pre className="output">{instructions}</pre>
        </div>
      )}
    </div>
  );
}

export default App;
*/

// frontend/src/App.js
import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [context, setContext] = useState('');
  const [screenshots, setScreenshots] = useState([]);
  const [instructions, setInstructions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleContextChange = (e) => {
    setContext(e.target.value);
  };

  const handleScreenshotChange = (e) => {
    const files = Array.from(e.target.files);
    setScreenshots(prevScreenshots => [...prevScreenshots, ...files]);
  };

  const removeScreenshot = (index) => {
    setScreenshots(prevScreenshots => prevScreenshots.filter((_, i) => i !== index));
  };

  const parseInstructions = (rawInstructions) => {
    const testCases = rawInstructions.split(/Test Case \d+:/).filter(Boolean);
    return testCases.map(testCase => {
      const [title, ...steps] = testCase.trim().split('\n');
      return {
        title: title.trim(),
        steps: steps.filter(step => step.trim() !== '').map(step => step.trim())
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setInstructions([]);

    if (screenshots.length === 0) {
      setError('Please upload at least one screenshot.');
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append('context', context);
    screenshots.forEach((file, index) => {
      formData.append('screenshots', file, `Step_${index + 1}_${file.name}`);
    });

    try {
      const response = await axios.post('http://localhost:3001/api/generate-instructions', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const parsedInstructions = parseInstructions(response.data.instructions);
      setInstructions(parsedInstructions);
    } catch (error) {
      setError('An error occurred while generating instructions. Please try again.');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <header>
        <h1>Testing Instructions Generator</h1>
      </header>
      <form className="form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="context">Context (optional):</label>
          <textarea
            id="context"
            value={context}
            onChange={handleContextChange}
            placeholder="Provide any additional context for the testing instructions"
            className="input"
          />
        </div>
        <div className="form-group">
          <label htmlFor="screenshots">Step-by-step Screenshots (required):</label>
          <input
            type="file"
            id="screenshots"
            accept="image/*"
            multiple
            onChange={handleScreenshotChange}
            className="input"
          />
        </div>
        <div className="screenshot-preview">
          {screenshots.map((file, index) => (
            <div key={index} className="screenshot-item">
              <img src={URL.createObjectURL(file)} alt={`Step ${index + 1}`} />
              <button type="button" onClick={() => removeScreenshot(index)}>Remove</button>
            </div>
          ))}
        </div>
        <button type="submit" className="button" disabled={loading}>
          {loading ? 'Generating...' : 'Generate Instructions'}
        </button>
      </form>
      {error && <p className="error">{error}</p>}
      {instructions.length > 0 && (
        <div className="instructions">
          <h2>Testing Instructions:</h2>
          {instructions.map((testCase, index) => (
            <div key={index} className="test-case">
              <h3>Test Case {index + 1}: {testCase.title}</h3>
              <ol>
                {testCase.steps.map((step, stepIndex) => (
                  <li key={stepIndex}>{step}</li>
                ))}
              </ol>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;  