import { useState, ChangeEvent, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useRegisterMutation } from '@/redux/features/authApiSlice';
import { useToast } from '@chakra-ui/react';

export default function useRegister() {
	const router = useRouter();
	
	const toast = useToast();
	
	const [register, { isLoading }] = useRegisterMutation();

	const [formData, setFormData] = useState({
		first_name: '',
		last_name: '',
		email: '',
		password: '',
		re_password: '',
	});

	const { first_name, last_name, email, password, re_password } = formData;

	const onChange = (event: ChangeEvent<HTMLInputElement>) => {
		const { name, value } = event.target;

		setFormData({ ...formData, [name]: value });
	};

	const onSubmit = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		register({ first_name, last_name, email, password, re_password })
			.unwrap()
			.then(() => {
				toast({
					title: "Please check email to verify account",
					status: "success",
					duration: 4000,
					isClosable: true,
				});
				router.push('/auth/login');
			})
			.catch((e) => {
				Object.entries(e.data).forEach(([field, errors]) => {
					(errors as string[]).forEach((err) => {
						toast({
							title: err[0].toUpperCase() + err.slice(1, err.length+1),
							status: "error",
							duration: 4000,
							isClosable: true,
						});
					});
				});
			});
	};

	return {
		first_name,
		last_name,
		email,
		password,
		re_password,
		isLoading,
		onChange,
		onSubmit,
	};
}
