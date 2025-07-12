import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

const getCart = async () => {
	const response = await axios.get(`${API_URL}/cart/`, {
		withCredentials: true, // ✅ ensure cookies are sent
	});
	return response.data;
};

export const useCart = () =>
	useQuery({
		queryKey: ['cart'],
		queryFn: getCart,
	});
