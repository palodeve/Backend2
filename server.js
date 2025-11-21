import 'dotenv/config';
import mongoose from 'mongoose';
import app from './src/app.js';
const PORT = process.env.PORT || 3000;

(async ()=>{
    try {
        await mongoose.connect (process.env.MONGO_URL,{serverSelectionTimeoutMS:5000});
        console.log ('Connected to MongoDB---');

        app.listen (PORT, ()=>{
            console.log (`API EN http://localhost:${PORT}`);
        });
        process.on('SINGTINT', async () => {
            await mongoose.disconnect();
            console.log('Disconnected from MongoDB');
            process.exit(0);
        });
        }catch (err) {
            console.error ('Error al iniciar:' ,err.message);
            process.exit(1);
}
})();