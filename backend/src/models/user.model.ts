import mongoose from "mongoose";
import bcrypt from 'bcryptjs'

export interface User extends Document {
    firstname: string;
    lastname: string;
    email: string;
    password: string;
    phone?: string;
    profilePicture?: string;
    role: 'client' | 'tailor' | 'admin';       
    isVerified: boolean;
    isBanned?: boolean;
    refreshTokenHash?: string;
    passwordResetToken?: string;
    passwordResetExpires?: Date;

    createdAt: Date;
    updatedAt: Date;

    setRefreshToken(refreshToken: string): Promise<void>;
    validateRefreshToken(refreshToken: string): Promise<boolean>;
    setPasswordResetToken(token: string): Promise<void>;
    setNewPassword(newPassword: string): Promise<void>;
}

const userSchema = new mongoose.Schema<User>({
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6 },
    phone: { type: String, require: true },
    role: { type: String, enum: ['client', 'tailor', 'admin'], required: true, default: 'client' },
    profilePicture: { type: String, required: false },
    isVerified: { type: Boolean, default: false },
    isBanned: { type: Boolean, default: false },
    refreshTokenHash: { type: String, required: false },
    passwordResetToken: { type: String, required: false },
    passwordResetExpires: { type: Date, required: false},
    
},
    { timestamps: true });


userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(this.password, salt);
        this.password = hashedPassword;

        next();
    }
    catch (err) {
        next(err as Error);
    }
});

userSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
    return bcrypt.compare(candidatePassword, this.password);
}

userSchema.methods.setRefreshToken = async function (refreshToken: string): Promise<void> {
    const salt = await bcrypt.genSalt(10);
    const hashedToken = await bcrypt.hash(refreshToken, salt);
    this.refreshTokenHash = hashedToken;
    await this.save();
}

userSchema.methods.validateRefreshToken = async function (refreshToken: string) {
    return bcrypt.compare(refreshToken, this.refreshTokenHash || '');
}

userSchema.methods.setPasswordResetToken = async function (token: string){
    this.passwordResetToken = token;
    this.passwordResetExpires = new Date(Date.now() + 3600000);
    await this.save();
}
userSchema.methods.setNewPassword = async function (newPassword: string){
    this.password = newPassword;
    this.passwordResetToken = undefined;
    this.passwordResetExpires = undefined;
    await this.save();
}

export const UserModel = mongoose.model<User>('User', userSchema);

