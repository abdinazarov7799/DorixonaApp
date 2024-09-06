import {request} from "@/lib/api/index";
import {ENDPOINTS} from "@/constants";
import {get, head} from "lodash";


export const loginRequest = async (attrs: any,cb:any) => {
    try {
        const {data} = await request.post(ENDPOINTS.login, attrs)
        return data || null;
    } catch (error) {
        cb?.setErrors({password:get(head(get(error, 'response.data', [])),'message','Error')})
    }finally {
        cb?.setLoading(false)
    }
}