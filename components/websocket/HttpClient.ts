import {
    HttpNamespaces,
    HttpQueries,
    HttpMutations,
} from '../../../../packages/shared/http.events';

export default class HttpClient {
    private getToken?: () => Promise<string | null>;

    constructor(getToken?: () => Promise<string | null>) {
        this.getToken = getToken;
    }

    query = async <T>(
        namespace: HttpNamespaces,
        query: HttpQueries,
        params: any,
    ) => {
        const token = this.getToken ? await this.getToken() : null;
        const queryString = new URLSearchParams(params).toString();
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_BUSINESS_WS!}/${namespace}/${query}?${queryString}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            },
        );

        if (!response.ok) {
            throw new Error(response.statusText);
        }

        return response.json() as Promise<T>;
    };

    mutation = async <T>(
        namespace: HttpNamespaces,
        mutation: HttpMutations,
        params: any,
    ) => {
        const token = this.getToken ? await this.getToken() : null;

        const response = await fetch(
            `${process.env.NEXT_PUBLIC_BUSINESS_WS!}/${namespace}/${mutation}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                method: 'POST',
                body: JSON.stringify(params),
            },
        );

        return response.json() as Promise<T>;
    };
}
