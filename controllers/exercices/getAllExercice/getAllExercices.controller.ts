import { Request, Response, NextFunction } from 'express';
import fetch from 'node-fetch';
import { requestExerciseDB } from '../../../helpers/requestExerciceData/exerciceDB.service';



const getAllExercices = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const data = await requestExerciseDB({ endpoint: 'exercises/getAll' });
        res.status(200).json(data);



    }

    catch (error) {
        next(error);
    }
}

export default getAllExercices;