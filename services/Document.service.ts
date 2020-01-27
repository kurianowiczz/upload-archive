import documentModel, { IDocument, IDocumentModel } from '../models/Document'

export default class DocumentService {

    public static async addDoc(document: IDocument): Promise<IDocumentModel> {
        return await documentModel.create({
            title: document.title,
            description: document.description,
            expire: document.expire,
            path: document.path,
        });
    }

    public static async findDocByTitle(title: string): Promise<IDocumentModel> {
        return await documentModel.findOne({ title });

    }

    public static async findAll(): Promise<IDocumentModel[]> {
        return documentModel.find({});
    }
}
