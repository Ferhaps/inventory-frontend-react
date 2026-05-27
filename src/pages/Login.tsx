import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../stores/auth.store";
import { useState } from "react";
import { z } from "zod";
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from "react-hook-form";
import { login } from "../api/auth.api";
import { Button, CircularProgress, IconButton, InputAdornment, TextField } from "@mui/material";
import { Visibility, VisibilityOff } from '@mui/icons-material';

const loginSchema = z.object({
	email: z.string().email('Invalid email'),
	password: z
		.string()
		.min(8, 'Minimum 8 characters')
		.regex(/[A-Z]/, 'Requires 1 uppercase letter')
		.regex(/[a-z]/, 'Requires 1 lowercase letter')
		.regex(/[0-9]/, 'Requires 1 number')
		.regex(/[^A-Za-z0-9]/, 'Requires 1 symbol'),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function Login() {
	const navigate = useNavigate();
	const setAuth = useAuthStore((state) => state.setAuth);
	const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

	const [hidePass, setHidePass] = useState(true);

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<LoginForm>({ resolver: zodResolver(loginSchema) });

	if (isAuthenticated) {
		navigate('/dashboard', { replace: true });
		return null;
	}

	const onSubmit = async (data: LoginForm) => {
		const userInfo = await login(data);
		setAuth(userInfo);
		navigate('/dashboard', { replace: true });
	};

	return (
		<div className="grid place-items-center w-full mt-8 mb-8">
			<form
				noValidate
				onSubmit={handleSubmit(onSubmit)}
				style={{ backgroundColor: '#e0f5fe' }}
				className="flex flex-col p-8 gap-8 max-w-[1000px] min-w-[400px] border border-black rounded-sm"
			>
				<h1 className="text-2xl font-bold text-center">Login</h1>

				<TextField
					label="Email"
					type="email"
					required
					{...register('email')}
					error={!!errors.email}
					helperText={errors.email?.message}
				/>

				<TextField
					label="Password"
					type={hidePass ? 'password' : 'text'}
					required
					{...register('password')}
					error={!!errors.password}
					helperText={errors.password?.message}
					slotProps={{
						input: {
							endAdornment: (
								<InputAdornment position="end">
									<IconButton
										onClick={() => setHidePass((prev) => !prev)}
										edge="end"
										aria-label="toggle password visibility"
									>
										{hidePass ? <VisibilityOff /> : <Visibility />}
									</IconButton>
								</InputAdornment>
							),
						},
					}}
				/>

				<div className="grid place-items-center w-full">
					<Button
						type="submit"
						variant="contained"
						disabled={isSubmitting}
						sx={{ minWidth: 130, fontSize: '1.25rem', backgroundColor: '#009ddc' }}
					>
						{isSubmitting ? <CircularProgress size={25} sx={{ color: 'white' }} /> : 'Login'}
					</Button>
				</div>
			</form>
		</div>
	);
}