import { Request, Response } from "express";
import { getAllUsersService, banUserService, deleteUserService, updateUserApprovalStatusService } from "../services/admin.service";
import { get } from "http";

export const banUser = async (req: Request, res: Response) => {

    const { userId } = req.params;

    try {
        const user = await banUserService(userId);
        return res.status(200).json({ message: 'User banned successfully', user });
    } catch (error) {

        return res.status(400).json({ message: (error as Error).message });

    }
}

export const updateTailorApprovalStatus = async (req: Request, res: Response) => {

    const { tailorId } = req.params;
    const { status } = req.body;

    try {
        const tailor = await updateUserApprovalStatusService(tailorId, status);
        // Exclude sensitive fields
        const { password, refreshTokenHash, ...safeTailor } = tailor.toObject ? tailor.toObject() : tailor;
        return res.status(200).json({ message: 'Tailor approval status updated successfully', tailor: safeTailor });
    } catch (error) {
        return res.status(400).json({ message: (error as Error).message });
    }
}

export const deleteUser = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;
        const user = await deleteUserService(userId);
        return res.status(200).json({ message: 'User deleted successfully', user });
    }
    catch (error) {
        return res.status(400).json({ message: (error as Error).message });
    }
};

export const getAllUsers = async (req: Request, res: Response) => {
    try {
        const users = await getAllUsersService();
        return res.status(200).json({ users });
    }
    catch (error) {
        return res.status(400).json({ message: (error as Error).message });
    }
};