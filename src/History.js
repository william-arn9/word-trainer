import './History.scss';

function History({ history }) {
  return (
    <div className="history">
      <h3>History</h3>
      <ul>
        {history.map((entry, index) => (
          <li key={index}>
            <span className="word">{entry.word}</span>
            <span className="time">{entry.time}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default History;