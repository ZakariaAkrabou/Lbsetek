import { config } from 'dotenv';
import { DressModel } from "../models/dress.model";


interface CreateDressDTO{
    name: string;
    description: string; 
    price: number;
    sizes: string[];
    colors: string[];
    images: string[];
    material: string;
    tailorId: string;

}
export const CreateDressService = async ({tailorId , ...rest}: CreateDressDTO) => {

    const dress = new DressModel({
        ...rest,
        tailor: tailorId
    });

    await dress.save();
    return dress;
}