import React, { useState, useEffect } from "react"; // Add useEffect import

import "./App.css";
import {
  Button,
  TextField,
  Card,
  CardContent,
  Typography,
  CardActions,
  IconButton,
} from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import RepeatIcon from "@mui/icons-material/Repeat";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";

function App() {
  const [posts, setPosts] = useState([]);
  const [postContent, setPostContent] = useState("");

  const API_URL = "http://localhost:3001"; // Replace 5000 with the port number your server is running on


  useEffect(() => {
    fetchTweets();
  }, []);

  const fetchTweets = async () => {
    const response = await fetch(`${API_URL}/tweets`);
    const data = await response.json();
    setPosts(data);
  };

  const handlePostSubmit = async () => {
    if (postContent) {
      const response = await fetch(`${API_URL}/tweets`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: postContent, timestamp: new Date() }),
      });
      const data = await response.json();
      setPosts([
        {
          id: data.id,
          content: postContent,
          timestamp: new Date(),
          likes: 0,
          retweets: 0,
          replies: [],
        },
        ...posts,
      ]);
      setPostContent("");
    }
  };


const handleLike = async (index) => {
    const post = posts[index];
    const response = await fetch(`${API_URL}/tweets/${post.id}/like`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ likes: post.likes }),
    });
    const data = await response.json();
    const updatedPosts = [...posts];
    updatedPosts[index] = { ...post, ...data };
    setPosts(updatedPosts);
};


const handleRetweet = async (index) => {
    const post = posts[index];
    const response = await fetch(`${API_URL}/tweets/${post.id}/retweet`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ retweets: post.retweets }),
    });
    const data = await response.json();
    const updatedPosts = [...posts];
    updatedPosts[index] = { ...post, ...data };
    setPosts(updatedPosts);
};




const handleReply = (index, replyContent) => {
    if (replyContent) {
      const updatedPosts = [...posts];
      updatedPosts[index].replies.push(replyContent);
      setPosts(updatedPosts);
    }
  };

  return (
    <div className="App">
      <h1>Minimal Twitter-like Platform</h1>
      <div className="post-input">
        <TextField
          label="What's happening?"
          multiline
          rows={4}
          value={postContent}
          onChange={(e) => setPostContent(e.target.value)}
          fullWidth
        />
        <Button variant="contained" onClick={handlePostSubmit}>
          Post
        </Button>
      </div>
      <div className="posts">
        {posts.map((post, index) => (
          <Card key={index} className="post">
            <CardContent>
              <Typography variant="body2" color="text.secondary">
                {post.timestamp.toLocaleString()}
              </Typography>
              <Typography variant="body1">{post.content}</Typography>
            </CardContent>
            <CardActions>
              <IconButton
                color="primary"
                onClick={() => handleLike(index)}
                aria-label="like"
              >
                <FavoriteBorderIcon />
              </IconButton>
              <Typography variant="body2">{post.likes}</Typography>
              <IconButton
                color="primary"
                onClick={() => handleRetweet(index)}
                aria-label="retweet"
              >
                <RepeatIcon />
              </IconButton>
              <Typography variant="body2">{post.retweets}</Typography>
              <IconButton
                color="primary"
                onClick={() =>
                  handleReply(index, prompt("Enter your reply:"))
                }
                aria-label="reply"
              >
                <ChatBubbleOutlineIcon />
              </IconButton>
              <Typography variant="body2">{post.replies.length}</Typography>
            </CardActions>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default App;
