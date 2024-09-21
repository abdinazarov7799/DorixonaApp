import { useInfiniteQuery } from '@tanstack/react-query';
import { useCallback, useMemo, useState } from 'react';
import _, {get} from 'lodash';
import {request} from "@/lib/api";

type Params<F> = {
    key: string;
    url: string;
    limit?: number;
    filters?: F;
};

export const useInfiniteScroll = <T = unknown, F = object>({
                                                               key,
                                                               url,
                                                               limit = 15,
                                                               filters,
                                                           }: Params<F>) => {
    const queryKey = [key, ..._.values<string | string[]>(_.omitBy(filters || {}, _.isEmpty))].filter(
        c => Boolean(c) && !_.isEmpty(c),
    );
    const [isRefreshing, setIsRefreshing] = useState(false);
    const queryFn = async ({ pageParam = 1 }) => {
        const { data } = await request.get<T[]>(url, {
            params: {
                page: pageParam,
                size:limit,
                ...filters,
            },
        });
        return {
            data: data,
            nextPage: pageParam + 1,
        };
    };

    const { data, hasNextPage, fetchNextPage, isFetchingNextPage, refetch,isLoading } = useInfiniteQuery({
        queryKey,
        queryFn,
        initialPageParam: 0,
        getNextPageParam: (lastPage, __, lastPageParam) => {
            if (_.get(lastPage,'data.data.pageable.pageNumber',0) >= _.get(lastPage,'data.totalPages',0)) {
                return undefined;
            }
            return lastPageParam + 1;
        },
        getPreviousPageParam: (_, __, firstPageParam) => {
            if (firstPageParam === 1) {
                return undefined;
            }
            return firstPageParam - 1;
        },
    });
    const loadNext = useCallback(() => {
        hasNextPage && fetchNextPage();
    }, [fetchNextPage, hasNextPage]);

    const onRefresh = useCallback(() => {
        if (!isRefreshing) {
            setIsRefreshing(true);
            refetch()
                .then(() => setIsRefreshing(false))
                .catch(() => setIsRefreshing(false));
        }
    }, [isRefreshing, refetch]);

    const flattenData = useMemo(() => {
        return data?.pages.flatMap(page => page?.data?.content) || [];
    }, [data?.pages]);

    return {
        data: flattenData,
        onEndReached: loadNext,
        isRefreshing,
        onRefresh,
        isFetchingNextPage,
        isLoading:isLoading
    };
};