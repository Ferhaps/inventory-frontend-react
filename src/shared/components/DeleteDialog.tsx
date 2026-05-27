import {
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	Button,
	Typography,
} from '@mui/material';

type Props = {
	open: boolean;
	label: string;
	onConfirm: () => void;
	onClose: () => void;
};

export default function DeleteConfirmDialog({ open, label, onConfirm, onClose }: Props) {
	return (
		<Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
			<DialogTitle sx={{ fontWeight: 600 }}>Confirm Delete</DialogTitle>
			<DialogContent>
				<Typography>
					Are you sure you want to delete <strong>{label}</strong>?
				</Typography>
			</DialogContent>
			<DialogActions>
				<Button onClick={onClose} variant="outlined">Cancel</Button>
				<Button onClick={onConfirm} variant="contained" color="error">Delete</Button>
			</DialogActions>
		</Dialog>
	);
}