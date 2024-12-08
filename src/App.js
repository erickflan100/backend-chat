import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import axios from 'axios';

const socket = io('http://localhost:3000');

function App() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [receivedMessage, setReceivedMessage] = useState([]);
  const [username, setUsername] = useState('');
  const [isRegistered, setIsRegistered] = useState(false);
  const [isMessage, setIsMessage] = useState(false);

  const registerUser = () => {
    socket.emit('set_username', username);
    setIsRegistered(true);
  };
  
  useEffect(() => {
    receiveMessage();
    setIsMessage(false);
  }, [isMessage]);

  useEffect(() => {
    socket.on('receive_message', (data) => {
      setMessages((prev) => [...prev, data]);
    });
    
    return () => {
      socket.off('receive_message'); // Evita múltiplos listeners
    };
  }, []);

  useEffect(() => {
    setMessages([])
    receivedMessage.map((message) => (
      setMessages((prev) => [...prev, message])
    ));
  }, [receivedMessage]);

  const saveMessage = async (user, message) => {
    try {
      const response = await axios.post('http://localhost:3000/api/messages', user, message);
      console.log('Message saved:', response.data);
    } catch (error) {
      console.error('Error saving message:', error);
    }
  };

  const receiveMessage = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/messages');
      setReceivedMessage(response.data);
      // console.log('Receive Message:', response.data);
    } catch (error) {
      console.error('Error received message:', error);
    }
  };

  const sendMessage = () => {
    socket.emit('send_message', {content: message});
    saveMessage({ user: username, content: message });
    setMessage('');
    setIsMessage(true);
  };

  return (
    <div>
      {!isRegistered ? (
        <div>
          <h1>Digite seu nome</h1>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <button onClick={registerUser}>Entrar</button>
        </div>
      ) : (
        <div>
          <h1>Chat em Tempo Real</h1>
          {/* <div>
            <h2>Usuários Ativos</h2>
            {users.map((user, idx) => (
              <p key={idx}>{user}</p>
            ))}
          </div> */}
          <div>
            {messages.map((msg, idx) => (
              <p key={idx}>{msg.content}</p>
            ))}
          </div>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button onClick={sendMessage}>Enviar</button>
        </div>
      )}
    </div>
  );  
}

export default App;
