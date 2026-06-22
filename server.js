const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Joke APIs
const JOKE_APIS = {
  official: 'https://official-joke-api.appspot.com/random_joke',
  jokeking: 'https://v2.jokeapi.dev/joke/Any',
  uselessfacts: 'https://uselessfacts.jsph.pl/random.json?language=en',
  dad: 'https://icanhazdadjoke.com/?format=json',
  programming: 'https://v2.jokeapi.dev/joke/Programming'
};

// Cache for jokes to reduce API calls
const jokeCache = {
  jokes: [],
  lastUpdated: null,
  maxAge: 5 * 60 * 1000 // 5 minutes
};

// Get random joke from Official Joke API
app.get('/api/joke/official', async (req, res) => {
  try {
    const response = await axios.get(JOKE_APIS.official, { timeout: 5000 });
    const { setup, punchline, type } = response.data;
    
    res.json({
      success: true,
      joke: `${setup} ${punchline}`,
      source: 'Official Joke API',
      type: type,
      fullResponse: response.data
    });
  } catch (error) {
    console.error('Error fetching from Official Joke API:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch joke from Official API',
      message: error.message
    });
  }
});

// Get random joke from JokeAPI
app.get('/api/joke/jokeapi', async (req, res) => {
  try {
    const response = await axios.get(JOKE_APIS.jokeking, { timeout: 5000 });
    let joke = '';
    
    if (response.data.type === 'twopart') {
      joke = `${response.data.setup} ${response.data.delivery}`;
    } else {
      joke = response.data.joke;
    }
    
    res.json({
      success: true,
      joke: joke,
      source: 'JokeAPI',
      category: response.data.category,
      fullResponse: response.data
    });
  } catch (error) {
    console.error('Error fetching from JokeAPI:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch joke from JokeAPI',
      message: error.message
    });
  }
});

// Get programming jokes
app.get('/api/joke/programming', async (req, res) => {
  try {
    const response = await axios.get(JOKE_APIS.programming, { timeout: 5000 });
    let joke = '';
    
    if (response.data.type === 'twopart') {
      joke = `${response.data.setup} ${response.data.delivery}`;
    } else {
      joke = response.data.joke;
    }
    
    res.json({
      success: true,
      joke: joke,
      source: 'JokeAPI - Programming',
      category: 'Programming',
      fullResponse: response.data
    });
  } catch (error) {
    console.error('Error fetching programming joke:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch programming joke',
      message: error.message
    });
  }
});

// Get dad joke
app.get('/api/joke/dad', async (req, res) => {
  try {
    const response = await axios.get(JOKE_APIS.dad, { timeout: 5000 });
    
    res.json({
      success: true,
      joke: response.data.joke,
      source: 'icanhazdadjoke',
      id: response.data.id,
      fullResponse: response.data
    });
  } catch (error) {
    console.error('Error fetching dad joke:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch dad joke',
      message: error.message
    });
  }
});

// Get random fun fact
app.get('/api/joke/fact', async (req, res) => {
  try {
    const response = await axios.get(JOKE_APIS.uselessfacts, { timeout: 5000 });
    
    res.json({
      success: true,
      joke: response.data.text,
      source: 'Useless Facts API',
      type: 'fact',
      fullResponse: response.data
    });
  } catch (error) {
    console.error('Error fetching useless fact:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch fact',
      message: error.message
    });
  }
});

// Get random joke from any API (Random selection)
app.get('/api/joke/random', async (req, res) => {
  try {
    const apis = ['official', 'jokeapi', 'programming', 'dad', 'fact'];
    const randomApi = apis[Math.floor(Math.random() * apis.length)];
    
    const response = await axios.get(`http://localhost:${process.env.PORT || 5000}/api/joke/${randomApi}`);
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching random joke:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch random joke',
      message: error.message
    });
  }
});

// Get multiple jokes at once
app.get('/api/jokes/batch', async (req, res) => {
  try {
    const count = Math.min(parseInt(req.query.count) || 3, 10); // Max 10
    const jokes = [];
    
    for (let i = 0; i < count; i++) {
      try {
        const apis = ['official', 'jokeapi', 'programming', 'dad'];
        const randomApi = apis[Math.floor(Math.random() * apis.length)];
        
        const response = await axios.get(`http://localhost:${process.env.PORT || 5000}/api/joke/${randomApi}`);
        jokes.push(response.data);
      } catch (error) {
        console.error(`Error fetching joke ${i + 1}:`, error.message);
      }
    }
    
    res.json({
      success: true,
      count: jokes.length,
      jokes: jokes
    });
  } catch (error) {
    console.error('Error fetching batch jokes:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch batch jokes',
      message: error.message
    });
  }
});

// Get available joke categories
app.get('/api/jokes/categories', (req, res) => {
  res.json({
    success: true,
    categories: [
      { name: 'Official', endpoint: '/api/joke/official', description: 'Random joke from Official Joke API' },
      { name: 'JokeAPI', endpoint: '/api/joke/jokeapi', description: 'Random joke from JokeAPI' },
      { name: 'Programming', endpoint: '/api/joke/programming', description: 'Programming-related jokes' },
      { name: 'Dad Jokes', endpoint: '/api/joke/dad', description: 'Funny dad jokes' },
      { name: 'Fun Facts', endpoint: '/api/joke/fact', description: 'Useless but fun facts' },
      { name: 'Random', endpoint: '/api/joke/random', description: 'Random joke from any source' }
    ]
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'Server is running',
    timestamp: new Date(),
    uptime: process.uptime()
  });
});

// Home route
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`😂 Joke Generator API running on http://localhost:${PORT}`);
  console.log(`📚 API Documentation: http://localhost:${PORT}/`);
});
