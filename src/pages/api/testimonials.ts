import type { NextApiRequest, NextApiResponse } from 'next';

type TestimonialItem = {
  id: number;
  name: string;
  role: string;
  image: string;
  quote: string;
  rating: number;
  reviewUrl: string;
};

type GooglePlaceReview = {
  author_name?: string;
  profile_photo_url?: string;
  rating?: number;
  text?: string;
};

type GooglePlaceDetailsResponse = {
  status: string;
  result?: {
    url?: string;
    reviews?: GooglePlaceReview[];
  };
};

const GOOGLE_REVIEWS_SEARCH_URL =
  'https://www.google.com/search?sca_esv=43340ab55d5d8314&sxsrf=ANbL-n6BKE-AOjAfE-tr26qGN0f_P344CA:1776928809711&si=AL3DRZEsmMGCryMMFSHJ3StBhOdZ2-6yYkXd_doETEE1OR-qOctpzGk6F9Cp7p6d-IMK3q1WHxQ1ujJJOrbHyTBP42EHJLw8YzQjUrubzANG02-gPA2Vy3mt7fEp0P7bCOlJDBdWmDRkxAnq-uystA67HCeoaJCAaA%3D%3D&q=Fight+%26+Flight+Studio+Reviews&sa=X&ved=2ahUKEwjlpvnTt4OUAxXxjGMGHUI0DucQ0bkNegQIIRAH&biw=1536&bih=730&dpr=1.25';

const MAX_REVIEWS_TO_SHOW = 6;

const REVIEW_UNAVAILABLE_CARDS: TestimonialItem[] = [
  {
    id: 1,
    name: 'Live Google Reviews',
    role: 'Review Feed',
    image: process.env.NEXT_PUBLIC_TESTIMONIAL_IMAGE_1 || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
    quote: 'Live reviews are temporarily unavailable. Please open Google Reviews to see the latest student feedback.',
    rating: 5,
    reviewUrl: GOOGLE_REVIEWS_SEARCH_URL
  },
  {
    id: 2,
    name: 'Live Google Reviews',
    role: 'Review Feed',
    image: process.env.NEXT_PUBLIC_TESTIMONIAL_IMAGE_2 || 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop',
    quote: 'Google may rate-limit automated requests on this URL. Use the button below to view all current reviews directly.',
    rating: 5,
    reviewUrl: GOOGLE_REVIEWS_SEARCH_URL
  },
  {
    id: 3,
    name: 'Live Google Reviews',
    role: 'Review Feed',
    image: process.env.NEXT_PUBLIC_TESTIMONIAL_IMAGE_3 || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop',
    quote: 'Connect Google Places API credentials to auto-load real review cards directly on this section.',
    rating: 5,
    reviewUrl: GOOGLE_REVIEWS_SEARCH_URL
  }
];

// GET /api/testimonials — Member testimonials
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const googlePlaceId = process.env.GOOGLE_PLACE_ID;
  const googlePlacesApiKey = process.env.GOOGLE_PLACES_API_KEY;

  if (!googlePlaceId || !googlePlacesApiKey) {
    return res.status(200).json(REVIEW_UNAVAILABLE_CARDS);
  }

  try {
    const url = new URL('https://maps.googleapis.com/maps/api/place/details/json');
    url.searchParams.set('place_id', googlePlaceId);
    url.searchParams.set('fields', 'url,reviews');
    url.searchParams.set('key', googlePlacesApiKey);

    const response = await fetch(url.toString());
    if (!response.ok) {
      return res.status(200).json(REVIEW_UNAVAILABLE_CARDS);
    }

    const data = (await response.json()) as GooglePlaceDetailsResponse;
    const googleReviews = data.result?.reviews ?? [];
    const placeUrl = data.result?.url || GOOGLE_REVIEWS_SEARCH_URL;

    if (data.status !== 'OK' || googleReviews.length === 0) {
      return res.status(200).json(REVIEW_UNAVAILABLE_CARDS);
    }

    const reviews: TestimonialItem[] = googleReviews.slice(0, MAX_REVIEWS_TO_SHOW).map((review, index) => ({
      id: index + 1,
      name: review.author_name || 'Google Reviewer',
      role: 'Google Review',
      image:
        review.profile_photo_url ||
        process.env[`NEXT_PUBLIC_TESTIMONIAL_IMAGE_${index + 1}` as 'NEXT_PUBLIC_TESTIMONIAL_IMAGE_1'] ||
        REVIEW_UNAVAILABLE_CARDS[index % REVIEW_UNAVAILABLE_CARDS.length].image,
      quote: review.text || REVIEW_UNAVAILABLE_CARDS[index % REVIEW_UNAVAILABLE_CARDS.length].quote,
      rating: Math.max(1, Math.min(5, review.rating || 5)),
      reviewUrl: placeUrl
    }));

    return res.status(200).json(reviews);
  } catch {
    return res.status(200).json(REVIEW_UNAVAILABLE_CARDS);
  }
}
