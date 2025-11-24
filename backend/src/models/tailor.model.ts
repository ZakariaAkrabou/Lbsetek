import { UserModel, User } from './user.model';
import mongoose from 'mongoose';

export interface Tailor extends User {
    
    shopName: string;
    location: Location;
    identificationCard: string;
    approvalStatus: 'pending' | 'approved' | 'rejected';
}


const locationSchema = new mongoose.Schema({
    city : {type:String ,required:true},
    address:{type:String, required:true},
    coordinates:{
        lat:{type: Number , require:false},
        lon:{type: Number, require:false}
    }
})

const tailorSchema = new mongoose.Schema<Tailor>({ 
    shopName: { type: String, required: true },
    location:{type:locationSchema, required:true},
    identificationCard: { type: String, required: true },
    approvalStatus: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' }
})

export const TailorModel = UserModel.discriminator<Tailor>('Tailor', tailorSchema);