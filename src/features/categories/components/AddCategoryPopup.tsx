import {
	Dialog,
	DialogTitle,
	DialogContent,
	TextField,
	DialogActions,
	Button,
	CircularProgress,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAddCategory } from '../hooks/useCategories';
import type { Category } from '../../../types';

const schema = z.object({
	name: z.string().min(1, 'Category name is required'),
});

type CategoryForm = z.infer<typeof schema>;

type Props = {
	open: boolean;
	onClose: (category?: Category) => void;
};

export default function AddCategoryDialog({ open, onClose }: Props) {
	const { mutate: addCategory, isPending } = useAddCategory();

	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm<CategoryForm>({ resolver: zodResolver(schema) });

	const handleClose = () => {
		reset();
		onClose();
	};

	const onSubmit = (data: CategoryForm) => {
		addCategory(data.name, {
			onSuccess: (category) => {
				reset();
				onClose(category);
			},
		});
	};

	return (
		<Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
			<DialogTitle>Add Category</DialogTitle>
			<form onSubmit={handleSubmit(onSubmit)} noValidate>
				<DialogContent className="flex flex-col items-center gap-4">
					<TextField
						label="Category name"
						type="text"
						fullWidth
						required
						{...register('name')}
						error={!!errors.name}
						helperText={errors.name?.message}
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