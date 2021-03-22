import mongoose from 'mongoose';

export const db =  async () => {
    try {
        mongoose.set("useFindAndModify", false);
        mongoose.Promise = global.Promise;
        await mongoose.connect(String(process.env.BD_CNN),  {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
        })
        console.log('BD online')
        
    } catch (error) {
        console.log({error})
        throw new Error("Error al iniciar la bd");
        
    }

}
