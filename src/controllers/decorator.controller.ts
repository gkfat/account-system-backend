import { Decorator } from './../entities/decorator.entity';
import {
    CreateDecoratorsInput,
    UpdateDecoratorsInput,
    FetchDecoratorsInput,
    DeleteDecoratorInput
} from '../schemas/decorator.schema';
import { Request, Response } from 'express';
import DecoratorService, { FetchDecoratorsQuery, FetchDecoratorsResult }  from '../services/decorator.service';
import logger from '../utils/logger';

async function createDecoratorsHandler(req: Request<{}, {}, CreateDecoratorsInput>, res: Response) {
    const decoratorService = new DecoratorService();
    const { data } = req.body;

    data.forEach(async d => {
        const newDecorator = new Decorator();
        newDecorator.categoryId = d.categoryId;
        newDecorator.name = d.name;
        newDecorator.content = d.content;
        newDecorator.levelLimit = d.levelLimit;
        await decoratorService.saveDecorator(newDecorator);
    })

    return res.send({
        data: null,
        message: 'Sign up success!'
    });
}

async function fetchDecoratorsHandler(req: Request<{}, {}, FetchDecoratorsInput>, res: Response) {
    const decoratorService = new DecoratorService();
    const query: FetchDecoratorsQuery = req.body;
    const result: FetchDecoratorsResult = await decoratorService.findDecorators(query);
    return res.send({
        message: '',
        data: result
    });
}

async function updateDecoratorsHandler(req: Request<{}, {}, UpdateDecoratorsInput>, res: Response) {
    const decoratorService = new DecoratorService();
    const { data } = req.body;

    data.forEach(async d => {
        const findDecorator = await decoratorService.findDecoratorById(d.id);
    
        if ( !findDecorator ) {
            return res.status(404).send({
                message: 'Decorator not found',
                data: null
            })
        }
        findDecorator.name = d.name ? d.name : findDecorator.name;
        findDecorator.levelLimit = d.levelLimit ? d.levelLimit : findDecorator.levelLimit;
        findDecorator.content = d.content ? d.content : findDecorator.content;
    
        await decoratorService.saveDecorator(findDecorator);
    })

    return res.send({
        message: 'Update decorator success!',
        data: null
    });
}

async function deleteDecoratorHandler(req: Request<DeleteDecoratorInput>, res: Response) {
    const decoratorService = new DecoratorService();
    const id = parseInt(req.params.id);
    await decoratorService.deleteDecoratorById(id);

    return res.send({
        message: 'Delete decorator success!',
        data: null
    });
}


export {
    createDecoratorsHandler,
    fetchDecoratorsHandler,
    updateDecoratorsHandler,
    deleteDecoratorHandler,
};