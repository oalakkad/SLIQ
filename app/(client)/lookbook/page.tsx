"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Button,
  Image,
  SimpleGrid,
  Spinner,
  Text,
} from "@chakra-ui/react";

type Post = {
  id: string;
  display_url: string;
  shortcode: string;
};

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
  const [imageLoading, setImageLoading] = useState<Record<string, boolean>>({});

  const API_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

  const username = "saie.kw";
  const amount = 12;

  const pickImageUrl = (p: IGApiPost): string =>
    p.thumbnail_url ||
    p.image_url ||
    p.display_url ||
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
            "X-RapidAPI-Key": process.env.NEXT_PUBLIC_RAPIDAPI_KEY!,
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

      // Mark all new images as "loading"
      const newLoadingState = newPosts.reduce((acc, post) => {
        acc[post.id] = true;
        return acc;
      }, {} as Record<string, boolean>);

      setImageLoading((prev) => ({ ...prev, ...newLoadingState }));
      setPosts((prev) => [...prev, ...newPosts]);
      setPaginationToken(res.data?.pagination_token ?? null);
    } catch (e: any) {
      console.error("Error fetching IG posts", e?.response?.data || e?.message);
      setErr("Could not load posts.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Box textAlign="center" my={10}>
      <SimpleGrid columns={[2, 3, 4]} spacing={4}>
        {posts.map((post) => (
          <Box
            key={post.id}
            position="relative"
            width="100%"
            paddingBottom="100%" // square aspect ratio
            overflow="hidden"
            borderRadius="xl"
          >
            {imageLoading[post.id] && (
              <Spinner
                size="lg"
                thickness="3px"
                colorScheme="brandPink"
                position="absolute"
                top="50%"
                left="50%"
                transform="translate(-50%, -50%)"
              />
            )}

            <a
              href={`https://www.instagram.com/p/${post.shortcode}`}
              target="_blank"
              rel="noreferrer"
            >
              <Image
                src={`${API_URL}/proxy-image/?url=${encodeURIComponent(
                  post.display_url
                )}`}
                alt="Instagram post"
                position="absolute"
                top="0"
                left="0"
                width="100%"
                height="100%"
                objectFit="cover"
                onLoad={() =>
                  setImageLoading((prev) => ({ ...prev, [post.id]: false }))
                }
              />
            </a>
          </Box>
        ))}
      </SimpleGrid>

      {loading && <Spinner mt={4} size="lg" colorScheme="brandPink" thickness="3px" />}

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
