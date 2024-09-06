import {useMutation, useQueryClient} from "@tanstack/react-query";
import {request} from "@/lib/api";
import {forEach, isArray, isEmpty} from "lodash";

const postRequest = (endpoint: string, attributes: object = {}, config: object = {}) => request.post(endpoint, attributes, config);
const useFetchRequest = ({
                             queryKey =[]
                         }:any) => {
    const queryClient = useQueryClient()
    const {mutate,isPending} = useMutation({
        mutationFn:async ({endpoint, attributes, config}:any)=>{
            return await postRequest(endpoint,attributes,config);
        },
        onSuccess: () => {
            if (queryKey && !isEmpty(queryKey) && isArray(queryKey)) {
                forEach(queryKey, (val) => {
                    queryClient.invalidateQueries({queryKey: [val]})
                })
            }
        }
    })
    return {
        mutate,
        isPending
    }
};

export default useFetchRequest;