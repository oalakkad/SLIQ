"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { Box, Button, Image, SimpleGrid, Spinner, Text } from "@chakra-ui/react";

type Post = {
  id: string;
  display_url: string;
  shortcode: string;
};

export default function InstagramFeed() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const username = "saie.kw"; // 👈 replace
  const pageSize = 6; // how many posts per load

  const fetchPosts = async (p = 1) => {
    setLoading(true);
    try {
      const res = await axios.get(
        `https://instagram-scraper-api2.p.rapidapi.com/v1.2/posts`,
        {
          params: { username, page: p, limit: pageSize },
          headers: {
            "X-RapidAPI-Key": process.env.NEXT_PUBLIC_RAPIDAPI_KEY!,
            "X-RapidAPI-Host": "instagram-scraper-api2.p.rapidapi.com",
          },
        }
      );

      const newPosts =
        res.data?.data?.items?.map((item: any) => ({
          id: item.id,
          display_url: item.display_url,
          shortcode: item.shortcode,
        })) || [];

      setPosts((prev) => [...prev, ...newPosts]);
    } catch (err) {
      console.error("Error fetching IG posts", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPosts(page);
  }, [page]);

  return (
    <Box textAlign="center" my={10}>
      <SimpleGrid columns={[2, 3, 4]} spacing={4}>
        {posts.map((post) => (
          <a
            key={post.id}
            href={`https://www.instagram.com/p/${post.shortcode}`}
            target="_blank"
            rel="noreferrer"
          >
            <Image
              src={post.display_url}
              alt="Instagram post"
              borderRadius="xl"
              _hover={{ transform: "scale(1.05)", transition: "0.2s" }}
            />
          </a>
        ))}
      </SimpleGrid>

      {loading && <Spinner mt={4} />}

      {!loading && posts.length > 0 && (
        <Button mt={6} colorScheme="teal" onClick={() => setPage(page + 1)}>
          Load More
        </Button>
      )}

      {posts.length === 0 && !loading && (
        <Text mt={4} color="gray.500">
          No posts found.
        </Text>
      )}
    </Box>
  );
}
