import { Request, Response } from "express";

export const addMovie = async (req: Request, res: Response) => {
	try {
		// validate inputs
		// getting user id from middleware in req.body.id
		// fetch a random poster url and a random trailer url
		// ^potentially random yt vid
		// createmovie with the input payload using required ORM function
		// response: success movie created
	} catch (error) {
		console.error(error);
		return res.status(500).json({
			error: true,
			message: "Internal server error",
		});
	}
};
