import {useQuery} from "@tanstack/react-query";
import {request} from "@/lib/api";

const useFetchRequest = ({
                             queryKey = 'list', endpoint = '/', params = {}, headers = {}, enabled = true
                         }) => {
    const queryFn = async () => {
        let {data} = await request.get(endpoint, {params, headers})
        return data;
    }
    const query = useQuery({queryKey: [queryKey], queryFn: queryFn, enabled})
    return {
        ...query
    }
};

export default useFetchRequest;