import {
	Dialog, DialogTitle, DialogContent, DialogActions,
	TextField, Button, CircularProgress,
	Select, InputLabel, FormControl, FormHelperText, MenuItem,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { useEffect } from 'react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAddProduct } from '../hooks/useProducts';
import type { Category, Product } from '../../../types';

const schema = z.object({
	name: z.string().min(1, 'Product name is required'),
	quantity: z.number().min(0, 'Quantity must be 0 or more'),
	categoryId: z.string().min(1, 'Category is required'),
});

type AddProductForm = z.infer<typeof schema>;

type Props = {
	open: boolean;
	categories: Category[];
	currentCategoryId: string;
	onClose: (product?: Product) => void;
};

export default function AddProductDialog({ open, categories, currentCategoryId, onClose }: Props) {
	const { mutate: addProduct, isPending } = useAddProduct();

	const {
		register,
		handleSubmit,
		control,
		reset,
		formState: { errors },
	} = useForm<AddProductForm>({
		resolver: zodResolver(schema),
		defaultValues: {
			name: '',
			quantity: 0,
			categoryId: currentCategoryId || categories[0]?.id || '',
		},
	});

	useEffect(() => {
		if (open) {
			reset({
				name: '',
				quantity: 0,
				categoryId: currentCategoryId || categories[0]?.id || '',
			});
		}
	}, [open]);

	const handleClose = () => { reset(); onClose(); };

	const onSubmit = (data: AddProductForm) => {
		addProduct(data, {
			onSuccess: (product) => { reset(); onClose(product); },
		});
	};

	return (
		<Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
			<DialogTitle>Add Product</DialogTitle>
			<form onSubmit={handleSubmit(onSubmit)} noValidate>
				<DialogContent className="flex flex-col gap-4">
					<TextField
						label="Product name"
						required
						fullWidth
						{...register('name')}
						error={!!errors.name}
						helperText={errors.name?.message}
					/>

					<TextField
						label="Initial quantity"
						type="number"
						required
						fullWidth
						{...register('quantity', { valueAsNumber: true })}
						error={!!errors.quantity}
						helperText={errors.quantity?.message}
					/>

					<FormControl fullWidth required error={!!errors.categoryId}>
						<InputLabel>Category</InputLabel>
						<Controller
							name="categoryId"
							control={control}
							render={({ field }) => (
								<Select label="Category" {...field}>
									{categories.length === 0 && (
										<MenuItem disabled value="">You must create a category first</MenuItem>
									)}
									{categories.map((c) => (
										<MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>
									))}
								</Select>
							)}
						/>
						{errors.categoryId && <FormHelperText>{errors.categoryId.message}</FormHelperText>}
					</FormControl>
				</DialogContent>

				<DialogActions>
					<Button onClick={handleClose} variant="outlined" disabled={isPending}>Cancel</Button>
					<Button
						type="submit"
						variant="contained"
						disabled={isPending || categories.length === 0}
						sx={{ minWidth: 130, backgroundColor: '#009ddc' }}
					>
						{isPending ? <CircularProgress size={22} sx={{ color: '#fff' }} /> : 'Add'}
					</Button>
				</DialogActions>
			</form>
		</Dialog>
	);
}