import mongoose from 'mongoose';

export const connectDatabase = async () => {
  mongoose
    .connect('mongodb+srv://miqky:24242424a@cluster0.fbdfh.mongodb.net/deneme')
    .then(() => {
      console.log('Database bağlantısı başarılı');
    })
    .catch((err) => {
      console.error(`Database bağlantısı başarısız\n ${err}`);
      throw err;
    });
};
