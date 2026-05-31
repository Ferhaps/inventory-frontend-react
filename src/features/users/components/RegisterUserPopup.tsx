import {
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	TextField,
	Button,
	CircularProgress,
	MenuItem,
	Select,
	InputLabel,
	FormControl,
	FormHelperText,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRegisterUser } from '../hooks/useUsers';

const schema = z
	.object({
		email: z.string().email('Invalid email'),
		role: z.enum(['ADMIN', 'OPERATOR']),
		password: z
			.string()
			.min(8, 'Minimum 8 characters')
			.regex(/[A-Z]/, 'Requires 1 uppercase letter')
			.regex(/[a-z]/, 'Requires 1 lowercase letter')
			.regex(/[0-9]/, 'Requires 1 number')
			.regex(/[^A-Za-z0-9]/, 'Requires 1 symbol'),
		passwordRepeat: z.string(),
	})
	.refine((data) => data.password === data.passwordRepeat, {
		message: 'Passwords do not match',
		path: ['passwordRepeat'],
	});

type RegisterForm = z.infer<typeof schema>;

type Props = {
	open: boolean;
	onClose: () => void;
};

export default function RegisterUserDialog({ open, onClose }: Props) {
	const { mutate: registerUser, isPending } = useRegisterUser();

	const {
		register,
		handleSubmit,
		control,
		reset,
		formState: { errors },
	} = useForm<RegisterForm>({
		resolver: zodResolver(schema),
		defaultValues: { role: 'ADMIN' },
	});

	const handleClose = () => {
		reset();
		onClose();
	};

	const onSubmit = (data: RegisterForm) => {
		const { ...body } = data;
		registerUser(body, {
			onSuccess: () => {
				reset();
				onClose();
			},
		});
	};

	return (
		<Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
			<DialogTitle>Add User</DialogTitle>
			<form onSubmit={handleSubmit(onSubmit)} noValidate autoComplete="off">
				<DialogContent className="flex flex-col gap-4">

					<TextField
						label="Email"
						type="email"
						required
						fullWidth
						{...register('email')}
						error={!!errors.email}
						helperText={errors.email?.message}
					/>

					<FormControl fullWidth required error={!!errors.role}>
						<InputLabel>Role</InputLabel>
						<Controller
							name="role"
							control={control}
							render={({ field }) => (
								<Select label="Role" {...field}>
									<MenuItem value="ADMIN">Admin</MenuItem>
									<MenuItem value="OPERATOR">Operator</MenuItem>
								</Select>
							)}
						/>
						{errors.role && <FormHelperText>{errors.role.message}</FormHelperText>}
					</FormControl>

					<TextField
						label="Password"
						type="password"
						required
						fullWidth
						{...register('password')}
						error={!!errors.password}
						helperText={errors.password?.message}
					/>

					<TextField
						label="Repeat Password"
						type="password"
						required
						fullWidth
						{...register('passwordRepeat')}
						error={!!errors.passwordRepeat}
						helperText={errors.passwordRepeat?.message}
					/>

				</DialogContent>
				<DialogActions>
					<Button onClick={handleClose} variant="outlined" disabled={isPending}>
						Cancel
					</Button>
					<Button
						type="submit"
						variant="contained"
						disabled={isPending}
						sx={{ minWidth: 130, backgroundColor: '#009ddc' }}
					>
						{isPending ? <CircularProgress size={22} sx={{ color: '#fff' }} /> : 'Add'}
					</Button>
				</DialogActions>
			</form>
		</Dialog>
	);
}
