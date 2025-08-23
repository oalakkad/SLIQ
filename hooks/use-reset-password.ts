import { useState, ChangeEvent, FormEvent } from 'react';
import { useResetPasswordMutation } from '@/redux/features/authApiSlice';
import { useToast } from '@chakra-ui/react';

export default function useResetPassword() {
	const [resetPassword, { isLoading }] = useResetPasswordMutation();

	const [email, setEmail] = useState('');
	const toast = useToast();

	const onChange = (event: ChangeEvent<HTMLInputElement>) => {
		setEmail(event.target.value);
	};

	const onSubmit = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		resetPassword(email)
			.unwrap()
			.then(() => {
				toast({
					title: "Request sent, check your email for reset link",
					status: "success",
					duration: 4000,
					isClosable: true,
				});
			})
			.catch(() => {
				toast({
					title: "Failed to send request",
					status: "error",
					duration: 4000,
					isClosable: true,
				});
			});
	};

	return {
		email,
		isLoading,
		onChange,
		onSubmit,
	};
}
