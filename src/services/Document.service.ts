import * as mongoose from 'mongoose';
import { Moment } from 'moment';

import documentModel, { IDocument, IDocumentModel } from '../models/Document';

export default class DocumentService {
    public static async addDoc(document: IDocument): Promise<IDocumentModel> {
        return await documentModel.create({
            title: document.title,
            description: document.description,
            expire: document.expire,
            path: document.path
        });
    }

    public static async findDocByTitle(title: string): Promise<IDocumentModel> {
        return await documentModel.findOne({ title });
    }

    public static async findDocByPath(path: string): Promise<IDocumentModel> {
        return await documentModel.findOne({ path });
    }

    public static async findAll(pagination?: {
        pageSize: number;
        pageNumber: number;
    }): Promise<IDocumentModel[]> {
        const documents = await documentModel.find();
        return pagination
            ? documents.slice(
                  Math.floor(documents.length / pagination.pageSize) *
                      pagination.pageNumber,
                  Math.floor(documents.length / pagination.pageSize) *
                      (pagination.pageNumber + 1)
              )
            : documents;
    }

    public static async getCount() {
        return documentModel.countDocuments();
    }

    public static async findByExpire(
        expire: Moment
    ): Promise<IDocumentModel[]> {
        return documentModel.find({
            expire: {
                $lte: new Date(expire.toISOString())
            }
        });
    }

    public static async removeMany(filesIds: mongoose.Types.ObjectId[]) {
        return documentModel.deleteMany({
            _id: {
                $in: filesIds
            }
        });
    }
}
