import { Request, response, Response } from 'express';
import { loginUserService, registerUserService } from '../service/serviceFile';

export const registerUser = async (req: Request, res: Response) => {

    const { username, email, type, password } = req.body;
    try {
        if (!email || !password || !username || !type)
            res.status(400).send({ "Status ": "FAILED", "Error ": "Please Provide Proper username ,type, Email and Password." });
        
        await registerUserService(username, email, type, password).then((result) => {
            console.log("Result in controller =========> : ",result);
            return res.status(201).send({ "Status ": "SUCCESS", "Message":"User Registered Successfully! "})
        }).catch((e:any) => {
            console.log("Error in registerUserService response : ",e.message);
            res.status(400).send({ "Status ": "FAILED", "Message ":"Something Went Wrong. ", "Response ": e });    
        })

    } catch (e: any) {
        console.log("Error in catch  :", e.message);
        res.status(400).send({ "Status ": "FAILED", "Response ": e });
    }
    
}

export const loginUser = async (req: Request, res: Response) => {
    const { username, password } = req.body;
    try {
        if (!password || !username)
            res.status(400).send({ "Status ": "FAILED", "Error ": "Please Provide username and Password." });
        
        await loginUserService(username, password).then((response) => {
            console.log("Login user Response : ",response);
            return res.status(201).send({ "Status ": "SUCCESS", "Response ":response})
        }).catch((e) => {
            console.log("Error in loginUserService response : ",e);
            console.log("Error in loginUserService response : ",e.message);
            res.status(400).send({ "Status ": "FAILED", "Message ":"Something Went Wrong. ", "Response ": e });    
        })
        
    } catch (e:any) {
        console.log("Error in catch  :", e.message);
        res.status(400).send({ "Status ": "FAILED", "Response ": e });
    }
    
}