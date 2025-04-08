import { useEffect, useState } from 'react';
import lottery from '../lottery';
import web3 from '../web3';
import './App.css';

function App() {
  const [manager, setManager] = useState('');
  const [players, setPlayers] = useState([]);
  const [balance, setBalance] = useState('');
  const [value, setValue] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const init = async () => {
      try {
        const manager = await lottery.methods.manager().call();
        console.log(manager)
        const players = await lottery.methods.getPlayers().call();
        const balance = await web3.eth.getBalance(lottery.options.address);
        
        setManager(manager);
        setPlayers(players);
        setBalance(web3.utils.fromWei(balance, 'ether'));
      } catch (err) {
        setMessage('Error loading contract data');
      }
    };
    init();
  }, []);

  const onSubmit = async (event) => {
    event.preventDefault();
    setMessage('Waiting on transaction...');

    try {
      const accounts = await web3.eth.getAccounts();
      await lottery.methods.enter().send({
        from: accounts[0],
        value: web3.utils.toWei(value, 'ether')
      });
      setMessage('You have successfully entered!');
    } catch (err) {
      setMessage('Transaction failed. Please try again.');
    }
  };

  const pickWinner = async () => {
    setMessage('Picking a winner...');

    try {
      const accounts = await web3.eth.getAccounts();
      await lottery.methods.pickWinner().send({
        from: accounts[0]
      });
      setMessage('A winner has been picked!');
    } catch (err) {
      setMessage('Failed to pick winner. Please try again.');
    }
  };

  return (
    <div className="lottery-container">
      <h2>Lottery Contract</h2>
      <p>This contract is managed by: {manager}</p>
      <p>There are currently {players.length} people competing to win {balance} ether!</p>

      <hr />

      <form onSubmit={onSubmit}>
        <h4>Want to try your luck?</h4>
        <div>
          <label>Amount of ether to enter: </label>
          <input
            value={value}
            onChange={e => setValue(e.target.value)}
            type="text"
          />
        </div>
        <button type="submit">Enter</button>
      </form>

      <hr />

      <h4>Ready to pick a winner?</h4>
      <button className="pick-winner" onClick={pickWinner}>Pick a Winner!</button>

      <hr />

      <h2>{message}</h2>
    </div>
  );
}

export default App;