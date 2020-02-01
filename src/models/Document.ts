import { Schema } from 'mongoose';
import * as mongoose from 'mongoose';

const DocumentSchema: Schema = new Schema({
    title: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    expire: { type: Date, required: true },
    path: { type: String, required: false }
});

export interface IDocument extends mongoose.Document {
    title: string;
    description: string;
    expire: Date;
    path: string;
}

export type IDocumentModel = mongoose.Model<IDocument & mongoose.Document>;

export default mongoose.model<IDocument>('Document', DocumentSchema);
