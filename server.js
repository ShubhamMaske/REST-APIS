import express from 'express';
import { PORT } from './config';
import routes from './routes';
import errorHandler from './middlewares/errorHandle';

const app = express()

app.use(express.json())

app.use('/api',routes)



app.use(errorHandler)
app.listen(PORT, () => {
    console.log(`Server is listning on port ${PORT}`)
})