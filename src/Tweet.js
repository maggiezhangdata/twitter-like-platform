import React from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent, Typography } from "@mui/material";

const Tweet = ({ posts }) => {
  const { id } = useParams();
  const tweet = posts.find((post) => post.id === parseInt(id));

  if (!tweet) {
    return <h2>Tweet not found</h2>;
  }

  return (
    <Card>
      <CardContent>
        <Typography variant="body2" color="text.secondary">
          {tweet.timestamp.toLocaleString()}
        </Typography>
        <Typography variant="body1">{tweet.content}</Typography>
      </CardContent>
    </Card>
  );
};

export default Tweet;
