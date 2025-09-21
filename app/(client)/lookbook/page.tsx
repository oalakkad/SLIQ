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
  const [paginationToken, setPaginationToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const username = "saie.kw"; // 👈 replace if needed
  const amount = 12; // default number of posts per request

  const fetchPosts = async () => {
  setLoading(true);
  try {
    const formData = new URLSearchParams();
    formData.append("username_or_url", username);
    formData.append("amount", amount.toString());
    if (paginationToken) {
      formData.append("pagination_token", paginationToken);
    }

    const res = await axios.post(
      "https://instagram-scraper-stable-api.p.rapidapi.com/get_ig_user_posts.php",
      formData,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "x-rapidapi-key": process.env.NEXT_PUBLIC_RAPIDAPI_KEY!,
          "x-rapidapi-host": "instagram-scraper-stable-api.p.rapidapi.com",
        },
      }
    );

    const newPosts =
      res.data?.posts?.map((post: any) => ({
        id: post.node.id,
        display_url: post.node.image_versions2?.candidates?.[0]?.url || "",
        shortcode: post.node.code,
      })) || [];

    setPosts((prev) => [...prev, ...newPosts]);
    setPaginationToken(res.data?.pagination_token || null);
  } catch (err) {
    console.error("Error fetching IG posts", err);
  }
  setLoading(false);
};

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

      {loading && <Spinner mt={4} colorScheme="brandPink" />}

      {!loading && paginationToken && (
        <Button mt={6} colorScheme="brandPink" onClick={fetchPosts}>
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
