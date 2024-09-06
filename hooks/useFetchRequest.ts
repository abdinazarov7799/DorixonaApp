import {useEffect, useState} from "react";
import {request} from "@/lib/api";

export default function useFetchRequest(endpoint: any, query: any,enabled:boolean=true) {
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);


    // @ts-ignore
    const fetchData = async () => {
        setIsLoading(true);
        try {
            const {data: res} = await request.get(endpoint, query);
            setData(res);
        } catch (error: any) {
            setError(error);
            console.log(`get error ${endpoint}`,error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if(enabled) {
            fetchData();
        }
    }, [enabled]);

    const refetch = () => {
        setIsLoading(true);
        fetchData();
    };

    return {data, isLoading, error, refetch};
}