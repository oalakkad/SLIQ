"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { Box, Button, Image, SimpleGrid, Spinner, Text } from "@chakra-ui/react";

type Post = {
  id: string;
  display_url: string;
  shortcode: string;
};

// Raw API response type (loose)
type IGApiPost = {
  id?: string;
  pk?: string;
  shortcode?: string;
  code?: string;
  image_url?: string;
  display_url?: string;
  thumbnail_url?: string;
  media_url?: string;
  caption?: string;
  node?: {
    id?: string;
    shortcode?: string;
    code?: string;
    display_url?: string;
    thumbnail_src?: string;
    image_versions2?: { candidates?: { url: string }[] };
  };
};

export default function InstagramFeed() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [paginationToken, setPaginationToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

  const username = "saie.kw"; // 👈 change to your IG username
  const amount = 12;

  // Helpers to pick correct fields
  const pickImageUrl = (p: IGApiPost): string =>
    p.image_url ||
    p.display_url ||
    p.thumbnail_url ||
    p.media_url ||
    p.node?.display_url ||
    p.node?.thumbnail_src ||
    p.node?.image_versions2?.candidates?.[0]?.url ||
    "";

  const pickShortcode = (p: IGApiPost): string =>
    p.shortcode || p.code || p.node?.shortcode || p.node?.code || "";

  const pickId = (p: IGApiPost): string =>
    p.id || p.pk || p.node?.id || crypto.randomUUID();

  const fetchPosts = async () => {
    setLoading(true);
    setErr(null);

    try {
      const formData = new URLSearchParams();
      formData.append("username_or_url", username);
      formData.append("amount", String(amount));
      if (paginationToken) formData.append("pagination_token", paginationToken);

      const res = await axios.post(
        "https://instagram-scraper-stable-api.p.rapidapi.com/get_ig_user_posts.php",
        formData,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "X-RapidAPI-Key": process.env.NEXT_PUBLIC_RAPIDAPI_KEY!, // 👈 add this to .env.local
            "X-RapidAPI-Host": "instagram-scraper-stable-api.p.rapidapi.com",
          },
        }
      );

      const items: IGApiPost[] =
        res.data?.posts ?? res.data?.data ?? res.data?.items ?? [];

      const newPosts: Post[] = items
        .map((item) => ({
          id: pickId(item),
          display_url: pickImageUrl(item),
          shortcode: pickShortcode(item),
        }))
        .filter((p) => p.display_url && p.shortcode);

      setPosts((prev) => [...prev, ...newPosts]);
      setPaginationToken(res.data?.pagination_token ?? null);
    } catch (e: any) {
      console.error("Error fetching IG posts", e?.response?.data || e?.message);
      setErr("Could not load posts.");
    } finally {
      setLoading(false);
    }
  };

  // First fetch on mount
  useEffect(() => {
    fetchPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
              src={`${API_URL}/proxy-image/?url=${encodeURIComponent(post.display_url)}`}
              alt="Instagram post"
              borderRadius="xl"
              _hover={{ transform: "scale(1.05)", transition: "0.2s" }}
            />
          </a>
        ))}
      </SimpleGrid>

      {loading && <Spinner mt={4} size="lg" thickness="3px" />}

      {!loading && paginationToken && (
        <Button mt={6} colorScheme="pink" onClick={fetchPosts}>
          Load More
        </Button>
      )}

      {!loading && posts.length === 0 && (
        <Text mt={4} color="gray.500">
          No posts found.
        </Text>
      )}

      {err && (
        <Text mt={4} color="red.500">
          {err}
        </Text>
      )}
    </Box>
  );
}
