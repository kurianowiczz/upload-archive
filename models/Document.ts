import { Schema } from 'mongoose';
import * as mongoose from 'mongoose';

export interface IDocument extends mongoose.Document {
    title: string;
    description: string;
    expire: Date;
    path: string;

}

const DocumentSchema: Schema = new Schema({
    title: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    expire: { type: String, required: true },
    path: { type: String, required: false },

});

DocumentSchema.set('toObject', {
    transform: (doc, ret) => {
        return {
            title: ret.title,
            description: ret.description,
            expire: ret.expire,
        };
    }
});

export type IDocumentModel = mongoose.Model<IDocument & mongoose.Document>;

export default mongoose.model<IDocument>('Document', DocumentSchema);

