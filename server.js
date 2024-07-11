import express from 'express';
import { PORT } from './config';
import routes from './routes';

const app = express()

app.use('/api',routes)



app.listen(PORT, () => {
    console.log(`Server is listning on port ${PORT}`)
})