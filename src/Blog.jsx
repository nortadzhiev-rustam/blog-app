import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  Pagination,
  TextField,
  Typography,
  ToggleButton,
  ToggleButtonGroup,
  Card,
  CardContent,
  CardHeader,
} from "@mui/material";

function Blog() {
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    fetchPosts();
  }, [page, limit]);

  const fetchPosts = async () => {
    try {
      const response = await axios.get(
        `https://jsonplaceholder.typicode.com/posts?_page=${page}&_limit=${limit}`
      );
      setPosts(response.data);
      const totalCount = response.headers["x-total-count"];
      const totalPagesCount = Math.ceil(totalCount / limit);
      setTotalPages(totalPagesCount);
    } catch (error) {
      console.error(error);
    }
  };

  const handlePostClick = async (postId) => {
    try {
      const response = await axios.get(
        `https://jsonplaceholder.typicode.com/posts/${postId}`
      );
      setSelectedPost(response.data);
      setDialogOpen(true);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSearch = (query) => {
    const filterPosts = posts.filter((post) => {
      if (post.title.includes(query)) {
        return post;
      }
    });

    query !== "" ? setPosts(filterPosts) : fetchPosts();
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  return (
    <Box p={2}>
      <Typography variant='h4' gutterBottom>
        Blog
      </Typography>
      <Box mb={2} display='flex' alignItems='center'>
        <TextField
          onChange={(e) => handleSearch(e.target.value)}
          label='Search posts'
          variant='outlined'
        />
      </Box>
      <Grid container spacing={2}>
        {posts.map((post) => (
          <Grid item xs={12} md={6} key={post.id}>
            <Card onClick={() => handlePostClick(post.id)}>
              <CardHeader title={post.title} />
              <CardContent>
                <Typography variant='body1'>{post.body}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Box display='flex' alignItems='center' justifyContent='flex-end' mt={2}>
        <Pagination
          count={totalPages}
          page={page}
          onChange={handlePageChange}
          color='primary'
        />
        <ToggleButtonGroup
          onChange={(e) => setLimit(e.target.value)}
          variant='outlined'
          sx={{ ml: 2 }}
        >
          <ToggleButton value={10}>10</ToggleButton>
          <ToggleButton value={20}>20</ToggleButton>
          <ToggleButton value={50}>50</ToggleButton>
        </ToggleButtonGroup>
      </Box>
      <Dialog open={dialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>{selectedPost?.title}</DialogTitle>
        <DialogContent>
          <Typography variant='body1'>{selectedPost?.body}</Typography>
        </DialogContent>
      </Dialog>
    </Box>
  );
}

export default Blog;
