import { useState, ChangeEvent, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch } from '@/redux/hooks';
import { useLoginMutation } from '@/redux/features/authApiSlice';
import { setAuth } from '@/redux/features/authSlice';
import { useToast } from '@chakra-ui/react';

export default function useLogin() {
	const router = useRouter();
	const dispatch = useAppDispatch();
	const [login, { isLoading }] = useLoginMutation();

	const toast = useToast();

	const [formData, setFormData] = useState({
		email: '',
		password: '',
	});

	const { email, password } = formData;

	const onChange = (event: ChangeEvent<HTMLInputElement>) => {
		const { name, value } = event.target;

		setFormData({ ...formData, [name]: value });
	};

	const onSubmit = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		login({ email, password })
			.unwrap()
			.then(() => {
				dispatch(setAuth());
				toast({
					title: "Successfully logged in!",
					status: "success",
					duration: 4000,
					isClosable: true,
				});
				router.push('/');
			})
			.catch((e) => {
				toast({
					title: String(e.data?.detail?.[0].toUpperCase() + e.data?.detail?.slice(1, e.data?.detail?.length+1)),
					status: "error",
					duration: 4000,
					isClosable: true,
				});
			});
	};

	return {
		email,
		password,
		isLoading,
		onChange,
		onSubmit,
	};
}
