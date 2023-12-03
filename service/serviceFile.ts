import bcrypt from 'bcryptjs';
import joi from 'joi';

let finalObj = {};

async function getUserByUsername(username:string , finalObj:any) {
    console.log("Username in getUserByUsername function : ", username);
    console.log("finalObj : ", finalObj);
    let res = Object.entries(finalObj).find((item: any) => {
        console.log("item in getUserByUsername :", item);
        console.log("condition : ",item[1].username , "==",username);
        return item[1].username === username;
    })
    console.log("Response of user : ",res);
    if (res)
        return res;
    if(res == undefined)
        return false;
}

async function getUserByEmail(email: string, findObj: any , username:string) {
    console.log("email in getUserByEmail function : ", email);
    console.log("finalObj : ", finalObj);
    let res = Object.entries(finalObj).find((item: any) => {
        console.log("item in getUserByEmail", item);
        console.log("condition : ",item[1].email , "==",email);
        return item[1].email === email;
    })
    if (res)
        return true;
    if(res == undefined)
        return false;
    
}


export const registerUserService = async (username: string, email: string, type: string, password: string) => {
    let userData = joi.object({
        username: joi.string().min(3).max(24).required(),
        email: joi.string().email().required(),
        type: joi.required().custom((value, helper:any) => {
            if (value == "user" || value == "admin") {
                return value;
            }
            else {
                throw helper.message({"Message":"Type Must Be a user or admin"});
            }
        }),
        password: joi.string().pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{5,24})'))
    });

    let result = await userData.validateAsync({ "username": username, "email": email, "type": type, "password": password });
    console.log("result :", result);
    
    if (!result)
        throw ({"message":"Please Provide Valid Credentials"});
    else {        
        let user = await getUserByUsername(username, finalObj);
        console.log("user : ", user);
        
        if (user) {
            console.log("Inside user==true");
            throw ({ "message": "User With This username Already Exist , Please Try Another username!" });
        }
        else {
            let emailResponse = await getUserByEmail(email, finalObj , username);
            if (emailResponse == true) {
                console.log("Inside emailResponse == true ");
                throw ({ "message": "User With Given Credentials Already Exist ,Please Try Another Credentials!" });
            }
            else {
                let hashPassword = bcrypt.hashSync(password, 10);
                let userObj:any = {};
                userObj["username"] = result.username;
                userObj["email"] = result.email;
                userObj["password"] = hashPassword;
                userObj["type"] = result.type;
        
                console.log("finalObj before: ", finalObj);
                let res = Object.entries(finalObj).find((item) => {
                    console.log("Item : ", item);
                    console.log("condition : ",item[0] , "==" ,username);
                    return item[0] === username;
                });
                console.log('res : ', res);
                
                if (res == undefined) {
                    Object.assign(finalObj, { [username]: userObj })
                    console.log("finalObj after: ", finalObj);
                } else {
                    throw ({ "message": "User With This Name Already Exist , Please Login!" });
                }
            }
        }
       
    }
    
}


export const loginUserService = async(username:string, password:string) => {
    console.log(username , password);
    let user:any = await getUserByUsername(username, finalObj);
    console.log("USER : ",user);
    
    if (!user) {
        throw ({ "Message ": " User With Given Username Doesn't Exists , Please Provide Proper Username! " });
    }
    else {
        let comparePassword = bcrypt.compareSync(password, user[1].password);
        console.log("comparePassword : ", comparePassword);
        if (!comparePassword) {
            throw ({ "Message ": " Password For Given Username Doesn't Exists , Please Provide Proper Password! " });
        } else {
            return ({"Message ": "User Logged In Successfully! "})
        }

    }

}
