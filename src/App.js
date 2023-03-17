import React, { useState } from "react";
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

  const handlePostSubmit = () => {
    if (postContent) {
      setPosts([
        {
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

  const handleLike = (index) => {
    const updatedPosts = [...posts];
    updatedPosts[index].likes += 1;
    setPosts(updatedPosts);
  };

  const handleRetweet = (index) => {
    const updatedPosts = [...posts];
    updatedPosts[index].retweets += 1;
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
