import * as Agendash from 'agendash';

import loadMongoose from './mongoose.loader';
import loadAgenda from './agenda.loader';

export default async app => {
    await loadMongoose();
    const agenda = await loadAgenda();
    app.use('/dash', Agendash(agenda));
};
