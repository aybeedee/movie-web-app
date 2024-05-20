const trailerUrls = [
	"https://www.youtube.com/embed/ycoY201RTRo",
	"https://www.youtube.com/embed/xSG5UX0EQVg",
	"https://www.youtube.com/embed/2w_K3CB8PuE",
	"https://www.youtube.com/embed/qgtN95CJaDg",
	"https://www.youtube.com/embed/PCf03KXyzIg",
	"https://www.youtube.com/embed/B-yhF7IScUE",
	"https://www.youtube.com/embed/8rbJkmz1n8E",
	"https://www.youtube.com/embed/MjQG-a7d41Q",
	"https://www.youtube.com/embed/BXfxLIuNJvw",
	"https://www.youtube.com/embed/oyRxxpD3yNw",
	"https://www.youtube.com/embed/xhL5ihOUUcs",
	"https://www.youtube.com/embed/KK8FHdFluOQ",
	"https://www.youtube.com/embed/LtNYaH61dXY",
];

export const getRandomTrailerUrl = () => {
	const randomIndex = Math.floor(Math.random() * trailerUrls.length);
	return trailerUrls[randomIndex];
};
