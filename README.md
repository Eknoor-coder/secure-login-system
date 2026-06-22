# 😂 Random Joke Generator

A fun and interactive joke generator web app that fetches jokes from multiple external APIs. Get random jokes, categorized jokes, programming jokes, dad jokes, and fun facts!

## ✨ Features

- 🎲 **Random Joke Generation** - Get random jokes from any source
- 📂 **Multiple Categories** - Choose from different joke sources:
  - Official Joke API
  - JokeAPI (All categories)
  - Programming Jokes
  - Dad Jokes
  - Fun Facts
- 🎯 **Batch Loading** - Get 5 jokes at once
- 📊 **Statistics** - Track jokes loaded and last update time
- 🎨 **Beautiful UI** - Modern, responsive design
- ⚡ **Real-time Updates** - Instant joke loading
- 💾 **No Installation** - Pure JavaScript, no frameworks

## 🌐 External APIs Used

1. **Official Joke API** - `https://official-joke-api.appspot.com`
   - Simple, clean joke format
   - Two-part jokes (setup & punchline)

2. **JokeAPI** - `https://v2.jokeapi.dev`
   - Multiple categories
   - Both single and two-part jokes

3. **icanhazdadjoke** - `https://icanhazdadjoke.com`
   - Dad jokes
   - Simple text format

4. **Useless Facts** - `https://uselessfacts.jsph.pl`
   - Fun and useless facts
   - Great conversation starters

## 🚀 Quick Start

### Installation

```bash
# Navigate to the directory (if in main repo)
cd joke-generator

# Install dependencies
npm install
```

### Running the Application

```bash
# Development mode (with auto-reload)
npm run dev

# OR Production mode
npm start
```

Server will run on `http://localhost:5000`

### Access the App

Open `http://localhost:5000` in your browser

## 📡 API Endpoints

### Get Jokes

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/joke/official` | GET | Random joke from Official API |
| `/api/joke/jokeapi` | GET | Random joke from JokeAPI |
| `/api/joke/programming` | GET | Programming-related jokes |
| `/api/joke/dad` | GET | Dad jokes |
| `/api/joke/fact` | GET | Random fun facts |
| `/api/joke/random` | GET | Random from any source |
| `/api/jokes/batch` | GET | Get multiple jokes (default: 3, max: 10) |
| `/api/jokes/categories` | GET | Get available categories |
| `/api/health` | GET | Health check |

### Example Requests

```bash
# Get a random joke
curl http://localhost:5000/api/joke/random

# Get programming jokes
curl http://localhost:5000/api/joke/programming

# Get 5 jokes at once
curl http://localhost:5000/api/jokes/batch?count=5

# Get categories list
curl http://localhost:5000/api/jokes/categories
```

### Example Response

```json
{
  "success": true,
  "joke": "Why do Java developers wear glasses? Because they don't C#",
  "source": "JokeAPI - Programming",
  "category": "Programming"
}
```

## 🎨 Usage Guide

### Getting Started

1. Open the application in your browser
2. Click "Get Joke" button to get a random joke
3. Use category buttons to filter jokes by type
4. Click "Get 5 Jokes" to load multiple jokes at once

### Features Explanation

- **Stats Section** - Shows total jokes loaded, current category, and last update time
- **Category Selection** - Choose from 6 different joke sources
- **Main Controls** - Get single jokes or batch jokes
- **Batch Mode** - Load up to 5 jokes and browse through them

## 🛠️ Tech Stack

**Backend:**
- Node.js
- Express.js
- Axios (HTTP client)
- CORS middleware

**Frontend:**
- HTML5
- CSS3 (modern styling, animations)
- Vanilla JavaScript (no frameworks)
- Responsive design

## 📂 Project Structure

```
joke-generator/
├── server.js           # Express server with API endpoints
├── public/
│   └── index.html      # Frontend UI
├── package.json        # Dependencies
├── .env                # Environment variables
├── .gitignore          # Git ignore rules
└── README.md           # This file
```

## 🎨 Features Breakdown

### 1. Multiple Joke Sources
The app integrates with 4 different joke APIs, each with unique content:
- Mix of programming jokes, dad jokes, and fun facts
- Load from specific categories or get random selections

### 2. Batch Loading
Get multiple jokes at once for entertainment:
- Load up to 10 jokes in a single request
- View them organized in a clean list
- Each joke shows its source

### 3. Error Handling
- Graceful error messages
- API timeout handling (5-second timeout)
- Fallback to alternative sources if one fails

### 4. Responsive Design
- Works on desktop, tablet, and mobile
- Touch-friendly buttons
- Optimized layout for all screen sizes

### 5. Real-time Statistics
- Track total jokes loaded
- See current category
- Display last update time

## 🔧 Configuration

### Environment Variables (.env)

```env
NODE_ENV=development
PORT=5000
```

### Modify API Endpoints

Edit the `JOKE_APIS` object in `server.js` to add more APIs:

```javascript
const JOKE_APIS = {
  official: 'https://official-joke-api.appspot.com/random_joke',
  jokeking: 'https://v2.jokeapi.dev/joke/Any',
  // Add more APIs here
};
```

## 🐛 Troubleshooting

### API Timeouts
- Some external APIs may be slow
- Default timeout is 5 seconds
- Modify in `server.js`: `{ timeout: 5000 }`

### CORS Issues
- CORS is enabled for all origins by default
- Modify in `server.js` if needed: `cors({ origin: 'your-origin' })`

### Jokes Not Loading
- Check if external APIs are accessible
- Test API endpoints directly: `curl https://official-joke-api.appspot.com/random_joke`
- Check browser console for errors

## 🚀 Future Enhancements

- ✅ Joke favorites/bookmarking
- ✅ Share jokes on social media
- ✅ Search jokes by keyword
- ✅ Local caching of jokes
- ✅ Dark mode
- ✅ Joke history
- ✅ Rating system
- ✅ Database integration

## 📚 Learning Outcomes

By exploring this project, you'll learn:
- ✅ Working with external APIs
- ✅ Async/await in JavaScript
- ✅ CORS and API integration
- ✅ Error handling
- ✅ Modern CSS animations
- ✅ Responsive web design
- ✅ Express.js basics
- ✅ State management with JavaScript

## 🤝 Contributing

Feel free to fork and submit pull requests!

## 📄 License

MIT License - Use freely in your projects

## 👨‍💻 Author

**Eknoor-coder**
- GitHub: [@Eknoor-coder](https://github.com/Eknoor-coder)

## 🙏 Acknowledgments

- Official Joke API
- JokeAPI
- icanhazdadjoke
- Useless Facts API

---

**⭐ If you found this helpful, please give it a star!**
