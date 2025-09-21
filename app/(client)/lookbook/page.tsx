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
  const [err, setErr] = useState<string | null>(null);

  const username = "saie.kw";
  const amount = 12;

  const pickImageUrl = (p: any): string =>
    p.image_url ||
    p.display_url ||
    p.thumbnail_url ||
    p.media_url ||
    p.node?.display_url ||
    p.node?.thumbnail_src ||
    p.node?.image_versions2?.candidates?.[0]?.url ||
    "";

  const pickShortcode = (p: any): string =>
    p.shortcode ||
    p.code ||
    p.node?.shortcode ||
    p.node?.code ||
    "";

  const pickId = (p: any): string =>
    p.id || p.pk || p.node?.id || crypto.randomUUID();

  const fetchPosts = async () => {
    if (!process.env.NEXT_PUBLIC_RAPIDAPI_KEY) {
      console.error("Missing NEXT_PUBLIC_RAPIDAPI_KEY");
      setErr("Missing RapidAPI key. Add NEXT_PUBLIC_RAPIDAPI_KEY to .env.local and restart.");
      return;
    }

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
            "X-RapidAPI-Key": process.env.NEXT_PUBLIC_RAPIDAPI_KEY!,
            "X-RapidAPI-Host": "instagram-scraper-stable-api.p.rapidapi.com",
          },
        }
      );

      // Inspect what comes back:
      // console.log(res.data);

      const items = res.data?.posts ?? res.data?.data ?? res.data?.items ?? [];
      const newPosts: Post[] = items.map((item: any) => ({
        id: pickId(item),
        display_url: pickImageUrl(item),
        shortcode: pickShortcode(item),
      })).filter(p => p.display_url && p.shortcode);

      setPosts(prev => [...prev, ...newPosts]);
      setPaginationToken(res.data?.pagination_token ?? null);
    } catch (e: any) {
      console.error("Error fetching IG posts", e?.response?.data || e?.message);
      setErr("Couldn’t load posts. Check subscription/host name/key or try server proxying.");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Kick off the first request on mount
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
              src={post.display_url}
              alt="Instagram post"
              borderRadius="xl"
              _hover={{ transform: "scale(1.05)", transition: "0.2s" }}
            />
          </a>
        ))}
      </SimpleGrid>

      {loading && <Spinner mt={4} size="lg" thickness="3px" />}

      {!loading && paginationToken && (
        <Button mt={6} colorScheme="brandPink" onClick={fetchPosts}>
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
