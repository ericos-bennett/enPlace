import express, { Request, Response } from 'express'

// Create an Express app
const app = express();

// Define a route
app.get('/', (req: Request, res: Response) => {
  res.send('Hello, World!');
});

// Start the server
const PORT: number = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
