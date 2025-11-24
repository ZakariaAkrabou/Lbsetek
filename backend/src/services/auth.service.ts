import { UserModel } from '../models/user.model';
import { TailorModel } from '../models/tailor.model';
import bcrypt from 'bcryptjs';


export const registerTailorService = async (
    firstname: string, lastname: string, email: string, password: string, 
    phone: string, shopName: string, city: String, address: String,
    lat: Number, lon: Number, identificationCard: string) => {

    const hashedPassword = await bcrypt.hash(password, 10);
    const newTailor = new TailorModel({
        firstname,
        lastname,
        email,
        password: hashedPassword,
        phone,
        role: 'tailor',
        shopName,
        location: { city, address, coordinates: { lon, lat } },
        identificationCard,
    });

    await newTailor.save();
    return newTailor;
}

export const registerClientService = async (
    firstname:string,lastname:string,
    email: string, password: string, phone:string ) => {
    
        const hashedPassword = await bcrypt.hash(password, 10);
        const newClient = new UserModel({

            firstname,
            lastname,
            email,
            password: hashedPassword,
            phone,
            role: 'client',
        })

        await  newClient.save();
        return  newClient;
    }