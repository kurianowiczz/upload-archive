import * as Agenda from 'agenda';
import * as mongoose from 'mongoose';
import * as moment from 'moment';
import { Job } from 'agenda';

import config from '../config';
import DocumentService from '../services/Document.service';
import { IDocumentModel } from '../models/Document';
import FileService from '../services/File.service';

export default async () => {
    const agenda = new Agenda({
        db: {
            address: `${config.databaseHost}/${config.databaseName}`,
            collection: config.agenda
        },
        maxConcurrency: 1
    });

    agenda.define('Remove files', async (job: Job<{ data: string }>) => {
        const filesForRemove: IDocumentModel[] = await DocumentService.findByExpire(
            moment()
        );
        for (const file of filesForRemove) {
            try {
                const { removed } = await FileService.deleteFile(file.path);
                file.remove();
                console.log(`${removed} removed.`);
            } catch (e) {
                console.error(e.toString());
            }
        }

        const result = await DocumentService.removeMany(
            filesForRemove.map((file: IDocumentModel) =>
                mongoose.ObjectId(file._id)
            )
        );

        job.attrs.data = { data: `Job executed: ${JSON.stringify(result)}` };
    });

    agenda.on('ready', async () => {
        console.log('Agenda ready');
        await agenda.every('30 seconds', 'Remove files');
    });

    await agenda.start();

    return agenda;
};
