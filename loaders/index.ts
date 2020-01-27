import loadMongoose from './mongoose.loader';

export default async () => {
    await loadMongoose();
}
