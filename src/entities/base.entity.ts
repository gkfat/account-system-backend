import { EntitySchemaColumnOptions } from 'typeorm';

export const BaseSchema = {
    id: {
        type: 'int',
        primary: true,
        generated: true
    } as EntitySchemaColumnOptions,
    createdAt: {
        type: 'datetime',
        createDate: true
    } as EntitySchemaColumnOptions,
    updatedAt: {
        type: 'datetime',
        updateDate: true,
        nullable: true
    } as EntitySchemaColumnOptions,
    deletedAt: {
        type: 'datetime',
        deleteDate: true,
        nullable: true
    } as EntitySchemaColumnOptions
};
