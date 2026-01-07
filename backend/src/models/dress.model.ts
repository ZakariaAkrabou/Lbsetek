import mongoose , {Document} from "mongoose";

export interface Dress extends Document {
    name: string;
    description: string;
    price: number;
    sizes: string[];
    colors: string[];
    images: string[];
    material: string;
    availability: 'available' | 'rented' | 'for sale';
    tailor: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const dressSchema = new mongoose.Schema<Dress>({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    sizes: { type: [String], required: true },
    colors: { type: [String], required: true },
    images: { type: [String], required: true },
    material: { type: String, required: true },
    availability: { type: String, enum: ['available', 'rented', 'for sale'], default: 'available' },
    tailor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
},
    { timestamps: true });
export const DressModel = mongoose.model<Dress>('Dress', dressSchema);