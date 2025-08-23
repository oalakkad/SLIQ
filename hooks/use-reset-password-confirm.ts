import { useState, ChangeEvent, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useResetPasswordConfirmMutation } from '@/redux/features/authApiSlice';
import { useToast } from '@chakra-ui/react';

export default function useResetPasswordConfirm(uid: string, token: string) {
	const router = useRouter();

	const toast = useToast();

	const [resetPasswordConfirm, { isLoading }] =
		useResetPasswordConfirmMutation();

	const [formData, setFormData] = useState({
		new_password: '',
		re_new_password: '',
	});

	const { new_password, re_new_password } = formData;

	const onChange = (event: ChangeEvent<HTMLInputElement>) => {
		const { name, value } = event.target;

		setFormData({ ...formData, [name]: value });
	};

	const onSubmit = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		resetPasswordConfirm({ uid, token, new_password, re_new_password })
			.unwrap()
			.then(() => {
				 toast({
					title: "Password reset successful",
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
							title: err,
							status: "error",
							duration: 4000,
							isClosable: true,
						});
					});
				});
			});
	};

	return {
		new_password,
		re_new_password,
		isLoading,
		onChange,
		onSubmit,
	};
}
