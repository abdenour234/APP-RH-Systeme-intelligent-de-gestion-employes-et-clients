import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Home() {
  const [message, setMessage] = useState('');
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios.get('/api/hello')
      .then(response => setMessage(response.data))
      .catch(error => console.error('Erreur:', error));

    axios.get('/api/users')
      .then(response => setUsers(response.data))
      .catch(error => console.error('Erreur:', error));
  }, []);

  return (
    <div>
      <h1>Bienvenue sur MyApp</h1>
      <p>Message du backend : {message}</p>
      <h2>Utilisateurs</h2>
      <ul>
        {users.map(user => (
          <li key={user.id}>{user.name} - {user.email}</li>
        ))}
      </ul>
    </div>
  );
}

export default Home;
