import { UserModel } from "../models/user.model";
import { TailorModel } from "../models/tailor.model";

export const banUserService = async (userId: string) => {
    const user = await UserModel.findById(userId);

    if (!user) {
        throw new Error('User not found');
    }

    user.isBanned = true;

    await user.save();

    return user;
}
export const updateUserApprovalStatusService = async (tailorId: string, status: 'approved' | 'rejected') => {
    const tailor = await TailorModel.findById(tailorId);

    if (!tailor) {
        throw new Error('Tailor not found');
    }
    tailor.approvalStatus = status;
    await tailor.save();

    return tailor;
}


export const deleteUserService = async (userId: string) => {
    const user = await UserModel.findById(userId);
    if (!user) {
        throw new Error('User not found');
    }
    await user.deleteOne();

    return user;
}

export const getAllUsersService = async () => {
    // Exclude password and refreshTokenHash fields from response
    const users = await UserModel.find().select('-password -refreshTokenHash');
    return users;
}