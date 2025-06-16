export const LoadingScreen = () => {
	return (
		<div className="fixed inset-0 bg-base-200 flex items-center justify-center z-10">
			<div className="flex gap-4 items-center">
				<span className="loading loading-bars loading-xl" />
			</div>
		</div>
	);
};
