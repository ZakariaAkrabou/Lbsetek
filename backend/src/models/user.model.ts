import mongoose from "mongoose";
import bcrypt from 'bcryptjs'

export interface User extends Document {
    firstname:string,
    lastname:string,
    email: string;
    password: string;
    phone?: string;
    profilePicture?: string;
    role: 'client' | 'tailor' | 'admin';
    isVerified: boolean;
  
    createdAt: Date;
    updatedAt: Date;
}

const userSchema = new mongoose.Schema<User>({
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6 },
    phone:{type:String , require:true},
    role: { type: String, enum: ['client', 'tailor', 'admin'], required: true, default: 'client' },
    profilePicture: { type: String, required: false },
    isVerified: { type: Boolean, default: false },
},
    {timestamps: true});


userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    try{
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(this.password, salt);
        this.password = hashedPassword;
       
        next();
    }
    catch(err){
        next(err as Error);
    }
});

userSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
    return bcrypt.compare(candidatePassword, this.password);
}

export const UserModel = mongoose.model<User>('User',userSchema);

