export const generatePosterUrl = (movieTitle: string) => {
	// seeding with movie title (which is always unique in implementation)
	// although copmressing title to only alphanumeric may potentially cause collisions with particularly similar titles
	return `https://picsum.photos/seed/${movieTitle.replace(
		/[^a-zA-Z0-9]/g,
		""
	)}/500/750`;
};
