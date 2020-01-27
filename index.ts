import * as express from 'express';
import { Request, Response } from 'express';
import * as bodyParser from 'body-parser';
import config from "./config";
import * as fileUpload from 'express-fileupload';
import loader from './loaders';
import DocumentService from "./services/Document.service";
import { IDocument } from "./models/Document";
import { UploadedFile } from "express-fileupload";
import * as url from 'url';
import ReadService from "./services/Read.service";

export const app = express();

const startApp = async () => {
    app.use(bodyParser.json());
    await loader();
    app.use(fileUpload());
    app.get('/upload', (req: Request, res: Response) => {
        return res.sendFile(__dirname + '/public/index.html');
    });

    app.post('/upload',async (req: Request, res: Response) => {
        if (req.files.filename) {
            let sampleFile = req.files.filename as UploadedFile;
            const uploadPath = 'files/' + sampleFile.name;
            await sampleFile.mv(__dirname + '/' + uploadPath);
            const savedDoc =  await DocumentService.addDoc({...req.body, path: uploadPath} as IDocument);
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
                const count = Array.isArray(params.count) ? params.count.join('') : params.count;
                const lines = await ReadService.readArch(doc.path, +count);
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

    app.get('/all', async (req: Request, res: Response) => {
        const all = await DocumentService.findAll();
        return res.status(200).send({ archives: all.map(el => el.toObject())});
    });

    app.listen(config.port, () => {
            console.log(`Server started on port ${config.port}`);
        });
    };

startApp();

