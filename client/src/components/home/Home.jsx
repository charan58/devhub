import { useEffect, useState } from "react";
import axios from "axios";
import "./Home.css";

function Home() {
  const [counts, setCounts] = useState({
    snippets: 0,
    logs: 0,
    bookmarks: 0,
    learnings: 0,
  });

  const [quote, setQuote] = useState({
    text: "",
    author: ""
  });

  const token = localStorage.getItem("token");
  const API_BASE = import.meta.env.VITE_API_URL;
  const QUOTES_API_KEY = import.meta.env.VITE_QUOTES_API_KEY;
  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const headers = {
          Authorization: `Bearer ${token}`
        };

        const [snippetRes, logRes, bookmarkRes, learningRes] = await Promise.all([
          axios.get(`${API_BASE}/snippet-api/get-snippet-count`, { headers }),
          axios.get(`${API_BASE}/log-api/get-log-count`, { headers }),
          axios.get(`${API_BASE}/bookmark-api/get-bookmark-count`, { headers }),
          axios.get(`${API_BASE}/learning-api/get-learning-count`, { headers }),
        ]);

        setCounts({
          snippets: snippetRes.data.payload,
          logs: logRes.data.payload,
          bookmarks: bookmarkRes.data.payload,
          learnings: learningRes.data.payload,
        });
      } catch (error) {
        console.error("Error fetching counts", error);
      }
    };

    const fetchQuote = async () => {
      try {
        const response = await axios.get("https://api.api-ninjas.com/v1/quotes", {
          headers: {
            'X-Api-Key': QUOTES_API_KEY  
          }
        });

        if (response.data && response.data.length > 0) {
          setQuote({
            text: response.data[0].quote,
            author: response.data[0].author
          });
        }
      } catch (error) {
        console.error("Error fetching quote:", error);
        setQuote({
          text: "Stay positive, work hard, make it happen.",
          author: "Unknown"
        });
      }
    };

    fetchCounts();
    fetchQuote();
  }, [token]);

  return (
    <div className="home-container">
      <h2 className="home-heading">Welcome to Your Dashboard</h2>

      <div className="count-grid">
        <div className="count-card">
          <div className="count-number">{counts.snippets}</div>
          <div className="count-label">Snippets</div>
        </div>
        <div className="count-card">
          <div className="count-number">{counts.logs}</div>
          <div className="count-label">Daily Logs</div>
        </div>
        <div className="count-card">
          <div className="count-number">{counts.bookmarks}</div>
          <div className="count-label">Bookmarks</div>
        </div>
        <div className="count-card">
          <div className="count-number">{counts.learnings}</div>
          <div className="count-label">Learnings</div>
        </div>
      </div>

      <div className="quote-box">
        <p className="quote-text">“{quote.text}”</p>
        <p className="quote-author">— {quote.author}</p>
      </div>
    </div>
  );
}

export default Home;
