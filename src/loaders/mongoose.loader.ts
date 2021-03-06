import * as mongoose from 'mongoose';

import config from '../config';

export default async () => {
    return mongoose.connect(
        `mongodb://${config.databaseHost}/${config.databaseName}`,
        {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        }
    );
};
