import fetch from 'node-fetch';
import ENV from '../../config/env.config';

type ExerciseDBParams = {
    endpoint: string;
    queryParams?: Record<string, string | number>;
};







export const requestExerciseDB = async ({ endpoint, queryParams = {} }: ExerciseDBParams) => {
    const url = new URL(`https://exercisedb.p.rapidapi.com/${endpoint}`);

    // Add query parameters to URL
    Object.entries(queryParams).forEach(([key, value]) => {
        url.searchParams.append(key, value.toString());
    });

    try {
        const res = await fetch(url.toString(), {
            method: 'GET',
            headers: {
                'x-rapidapi-host': ENV.RAPID_API_HOST,
                'x-rapidapi-key': ENV.RAPID_API_KEY,
            },
        });



        if (!res.ok) {
            return {
                status: 'error',
                message: `Failed to fetch from ExerciseDB: ${res.status} ${res.statusText}`,
            }
        }

        return await res.json();
    } catch (err: any) {
        console.error('ExerciseDB fetch error:', err.message);
        throw err;
    }
};
