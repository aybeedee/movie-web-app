const trailerUrls = [
	"https://www.youtube.com/watch?v=ycoY201RTRo",
	"https://www.youtube.com/watch?v=xSG5UX0EQVg",
	"https://www.youtube.com/watch?v=2w_K3CB8PuE",
	"https://www.youtube.com/watch?v=qgtN95CJaDg",
	"https://www.youtube.com/watch?v=PCf03KXyzIg",
	"https://www.youtube.com/watch?v=B-yhF7IScUE",
	"https://www.youtube.com/watch?v=8rbJkmz1n8E",
	"https://www.youtube.com/watch?v=MjQG-a7d41Q",
	"https://www.youtube.com/watch?v=BXfxLIuNJvw",
	"https://www.youtube.com/watch?v=oyRxxpD3yNw",
	"https://www.youtube.com/watch?v=xhL5ihOUUcs",
	"https://www.youtube.com/watch?v=KK8FHdFluOQ",
	"https://www.youtube.com/watch?v=LtNYaH61dXY",
];

export const getRandomTrailerUrl = () => {
	const randomIndex = Math.floor(Math.random() * trailerUrls.length);
	return trailerUrls[randomIndex];
};
