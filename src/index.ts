import * as url from 'url';

import * as express from 'express';
import { Request, Response } from 'express';
import * as bodyParser from 'body-parser';
import * as fileUpload from 'express-fileupload';
import { UploadedFile } from 'express-fileupload';
import * as moment from 'moment';

import config from './config';
import loader from './loaders';
import DocumentService from './services/Document.service';
import { IDocument } from './models/Document';
import FileService from './services/File.service';

const app = express();

const startApp = async () => {
    app.use(bodyParser.json());
    await loader(app);
    app.use(fileUpload());

    app.get('/upload', (req: Request, res: Response) => {
        return res.sendFile(__dirname + '/public/index.html');
    });

    app.post('/upload', async (req: Request, res: Response) => {
        if (req.files.filename) {
            const sampleFile = req.files.filename as UploadedFile;
            let uploadPath = 'files/' + Date.now() + sampleFile.name;
            const exitedDoc = await DocumentService.findDocByPath(uploadPath);
            if (exitedDoc) {
                uploadPath = 'files/copy_' + Date.now() + sampleFile.name;
            }
            await sampleFile.mv(__dirname + '/' + uploadPath);
            const expire = moment(
                `${req.body.expire} ${req.body.time}`,
                'YYYY-MM-DD HH:mm'
            );
            const savedDoc = await DocumentService.addDoc({
                ...req.body,
                expire: expire.toDate(),
                path: uploadPath
            } as IDocument);
            return res.status(200).send(savedDoc);
        } else {
            return res.status(400).send({ error: 'No file to upload' });
        }
    });

    // /lines?title={title}&count={count}
    app.get('/lines', async (req: Request, res: Response) => {
        const params = url.parse(req.url, true).query;
        if (params.title && params.count && !Array.isArray(params.title)) {
            const doc = await DocumentService.findDocByTitle(params.title);
            if (doc) {
                const count = Array.isArray(params.count)
                    ? params.count.join('')
                    : params.count;
                const lines = await FileService.readArch(doc.path, +count);
                if (Array.isArray(lines)) {
                    return res.status(200).send({ lines });
                } else {
                    return res.status(500).send({ error: lines });
                }
            } else {
                return res.status(400).send({ error: 'Invalid title' });
            }
        } else {
            return res.status(400).send({ error: 'Invalid params' });
        }
    });

    // /all?pageSize={pageSize}&pageNumber={pageNumber}
    app.get('/all', async (req: Request, res: Response) => {
        const params = url.parse(req.url, true).query;
        const all = await DocumentService.findAll();
        if (
            params.pageSize &&
            params.pageNumber &&
            !Array.isArray(params.pageSize) &&
            !Array.isArray(params.pageNumber)
        ) {
            const pageSize = parseInt(params.pageSize);
            const pageNumber = parseInt(params.pageNumber);

            const pageResults = await DocumentService.findAll({
                pageSize: pageSize,
                pageNumber: pageNumber
            });
            const docCount = await DocumentService.getCount();
            return res.status(200).send({
                archives: pageResults.map(el => el.toObject()),
                pages: Math.floor(docCount / pageSize)
            });
        }
        return res.status(200).send({ archives: all.map(el => el.toObject()) });
    });

    app.listen(config.port, () => {
        console.log(`Server started on port ${config.port}`);
    });
};

startApp();

export default app;
