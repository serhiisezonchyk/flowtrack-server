"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = __importDefault(require("../db"));
class TaksController {
    static async getOne(req, res) {
        const { taskId } = req.params;
        const data = await db_1.default.task.findUnique({
            where: {
                id: taskId,
            },
        });
        if (!data)
            return res.status(406).json({
                error: `Cannot find task with id=${taskId}`,
                details: '',
            });
        res.status(200).json({ data });
    }
    // static async getAll(req: Request, res: Response) {
    //   const { boardId } = req.params;
    //   try {
    //     const data = await prisma.task.findMany({
    //       where: {
    //         section: {
    //           boardId: boardId,
    //         },
    //       },
    //     });
    //     return res.status(200).json({ data });
    //   } catch (error) {
    //     return res.status(501).json({ error: `An error occured while sections retreaving`, details: error });
    //   }
    // }
    static async getAllForSection(req, res) {
        const { boardId, sectionId } = req.params;
        try {
            const data = await db_1.default.task.findMany({
                where: {
                    sectionId: sectionId,
                    section: {
                        boardId: boardId,
                    },
                },
            });
            return res.status(200).json({ data });
        }
        catch (error) {
            return res.status(501).json({ error: `An error occured while sections retreaving`, details: error });
        }
    }
    static async create(req, res) {
        const { sectionId } = req.params;
        try {
            const position = await db_1.default.task.count({
                where: {
                    sectionId,
                },
            });
            const data = await db_1.default.task.create({
                data: {
                    sectionId: sectionId,
                    position,
                },
            });
            return res.status(200).json({ data });
        }
        catch (error) {
            return res.status(501).json({ error: `An error occured while sections retreaving`, details: error });
        }
    }
    static async delete(req, res) {
        const { taskId } = req.params;
        try {
            await db_1.default.task.delete({
                where: {
                    id: taskId,
                },
            });
            return res.status(200).json({ message: `Task ${taskId} was deleted successfully.` });
        }
        catch (error) {
            return res.status(501).json({ error: `An error occured while task deleting`, details: error });
        }
    }
    static async update(req, res) {
        const { taskId } = req.params;
        const body = req.body;
        try {
            const updatedTask = await db_1.default.task.findUnique({
                where: {
                    id: taskId,
                },
            });
            if (!updatedTask)
                return res.status(406).json({
                    error: `Cannot find task with id=${taskId}`,
                    details: '',
                });
            const data = await db_1.default.task.update({
                where: {
                    id: updatedTask.id,
                },
                data: {
                    ...body,
                },
            });
            return res.status(200).json({ message: `Task was updated successfully.`, data });
        }
        catch (error) {
            return res.status(501).json({ error: `An error occured while task updating`, details: error });
        }
    }
}
exports.default = TaksController;
