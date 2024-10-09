import { useEffect, useRef, useState } from 'react';
import './App.scss';
import wordList from './assets/words.json';
import History from './History';
import { parseWordCorrectness } from './utils/ParserUtil';
import { shuffleArray } from './utils/RandomUtil';

function App() {
  const [activeWords, setActiveWords] = useState(shuffleArray(wordList));
  const [chipState, setChipState] = useState(['longs', 'hyphens']);
  const [currentWord, setCurrentWord] = useState('');
  const [correctSpan, setCorrectSpan] = useState('');
  const [incorrectSpan, setIncorrectSpan] = useState('');
  const [remainingSpan, setRemainingSpan] = useState('');
  const [userInput, setUserInput] = useState('');
  const [wordIndex, setWordIndex] = useState(0);
  const [history, setHistory] = useState([]);
  const [startTime, setStartTime] = useState(null);

  const inputRef = useRef(null);

  useEffect(() => {
    setCurrentWord(activeWords[wordIndex].word);
    setRemainingSpan(activeWords[wordIndex].word);
    setCorrectSpan('');
    setIncorrectSpan('');
  }, [activeWords, wordIndex]);

  useEffect(() => {
    const words = wordList.filter((word) => chipState.includes(...word.tags));
    setActiveWords(shuffleArray(words));
  }, [chipState]);
  
  const toggleChip = (chipName) => {
    if(chipState.find((chip) => chip === chipName)) {
      setChipState(chipState.filter((chip) => chip!== chipName));
    }
    else {
      setChipState([...chipState, chipName]);
    }
  };

  const handleInputChange = (e) => {
    const input = e.target.value;
    setUserInput(input);

    if(input.length === 1) setStartTime(new Date());
    
    const [correct, incorrect, remaining] = parseWordCorrectness(currentWord, input);

    setCorrectSpan(correct);
    setIncorrectSpan(incorrect);
    setRemainingSpan(remaining);

    if (e.target.value === currentWord) {
      const endTime = new Date();
      const timeTaken = (endTime - startTime) / 1000;

      setHistory((prevHistory) => [
        ...prevHistory,
        { word: currentWord, time: timeTaken.toFixed(2) + 's' }
      ]);
      setUserInput('');
      setWordIndex((prevIndex) => (prevIndex + 1) % activeWords.length);
    }
  };

  const handleFrameClick = () => {
    inputRef.current.focus();
  };

  return (
    <div className="App" onClick={handleFrameClick}>
      <div className="content">
        <div className="chip-bar">
          <button type="button" className={chipState.includes('longs') ? 'active' : ''} onClick={() => {toggleChip('longs')}}>Longs</button>
          <button type="button" className={chipState.includes('hyphens') ? 'active' : ''} onClick={() => {toggleChip('hyphens')}}>Hyphens</button>
          <button type="button" className={chipState.includes('max1') ? 'active' : ''} onClick={() => {toggleChip('max1')}}>Max 1</button>
        </div>
        <div className="word-container">
          <h2><span className="correct">{correctSpan}</span><span className="incorrect">{incorrectSpan}</span>{remainingSpan}</h2>
          <input
            type="text"
            ref={inputRef}
            value={userInput}
            onChange={handleInputChange}
            placeholder="Type the word here..."
          />
        </div>
      </div>
      <History history={history} />
    </div>
  );
}

export default App;
