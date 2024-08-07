import express from 'express';
import { PORT, DB_URL } from './config/index.js';
import routes from './routes/index.js';
import errorHandler from './middlewares/errorHandle.js';
import mongoose from 'mongoose';

const app = express()



app.use(express.json())
app.use('/api',routes)
app.use(errorHandler)

mongoose.connect(DB_URL,{
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
.then(result => {
    console.log('Connected...');
})
.catch(err => {
    console.log(" database connection error");
})

app.listen(PORT, () => {
    console.log(`Server is listning on port ${PORT}`)
})