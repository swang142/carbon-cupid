import app from "./app.js";

app.listen(process.env.PORT || 8080, () => {
	console.log(`Server running on port ${process.env.PORT}`);
});
