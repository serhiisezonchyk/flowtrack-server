"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = __importDefault(require("../db"));
const board_controller_1 = __importDefault(require("./board.controller"));
class SectionController {
    static async getSectionData(boardId) {
        const data = await db_1.default.section.findMany({
            where: {
                boardId: boardId,
                // board: {
                //   user: {
                //     id: userId,
                //   },
                // },
            },
            include: {
                tasks: {
                    orderBy: {
                        position: 'asc',
                    },
                },
            },
            orderBy: {
                position: 'asc',
            },
        });
        return data;
    }
    static async getAll(req, res) {
        const userId = req.user?.id;
        const { boardId } = req.params;
        try {
            const data = await SectionController.getSectionData(boardId);
            return res.status(200).json({ data });
        }
        catch (error) {
            return res.status(501).json({ error: `An error occured while sections retreaving`, details: error });
        }
    }
    static async create(req, res) {
        const userId = req.user?.id;
        const { boardId } = req.params;
        try {
            const position = await db_1.default.section.count();
            const data = await db_1.default.section.create({
                data: {
                    position: position,
                    boardId: boardId,
                },
            });
            return res.status(200).json({ message: `Section was added successfully.`, data });
        }
        catch (error) {
            return res.status(501).json({ error: `An error occured while sections retreaving`, details: error });
        }
    }
    static async updateTitle(req, res) {
        const userId = req.user?.id;
        const { sectionId } = req.params;
        const body = req.body;
        try {
            const toUpdate = await db_1.default.section.findUnique({
                where: {
                    id: sectionId,
                },
            });
            if (!toUpdate)
                return res.status(406).json({
                    error: `Cannot find section with id=${sectionId}`,
                    details: '',
                });
            const data = await db_1.default.section.update({
                where: {
                    id: toUpdate.id,
                },
                data: {
                    title: body.title,
                },
            });
            return res.status(200).json({ message: `Section was updated successfully.`, data });
        }
        catch (error) {
            return res.status(501).json({ error: `An error occured while sections retreaving`, details: error });
        }
    }
    static async updatePositions(req, res) {
        const userId = req.user?.id;
        const { boardId } = req.params;
        const body = req.body;
        try {
            //Check is board exist
            const isBoardExist = await board_controller_1.default.isBoardExist(boardId, userId);
            if (!isBoardExist)
                return res.status(404).json({ error: `Board not found or you do not have access to this board` });
            //Update positions to their order in request
            await db_1.default.$transaction(body.map((section) => db_1.default.section.update({
                where: { id: section.id },
                data: { position: section.position },
            })));
            //Format response with current order in db and send it to client
            const data = await SectionController.getSectionData(boardId);
            return res.status(200).json({ message: `Sections positions updated successfully`, data });
        }
        catch (error) {
            return res.status(501).json({ error: `An error occurred while updating sections positions`, details: error });
        }
    }
    static async delete(req, res) {
        const { sectionId } = req.params;
        try {
            const deleted = await db_1.default.section.delete({
                where: {
                    id: sectionId,
                },
            });
            const sections = await SectionController.getSectionData(deleted.boardId);
            await db_1.default.$transaction(sections.map((section, index) => db_1.default.section.update({
                where: { id: section.id },
                data: { position: index },
            })));
            return res.status(200).json({ message: `Section ${sectionId} was deleted successfully.` });
        }
        catch (error) {
            return res
                .status(501)
                .json({ error: `An error occured while section:${sectionId} was deleting`, details: error });
        }
    }
    static async updateTasksPositions(req, res) {
        const userId = req.user?.id;
        const updatedSections = req.body;
        const { boardId } = req.params;
        try {
            //Check is board exist
            const isBoardExist = await board_controller_1.default.isBoardExist(boardId, userId);
            if (!isBoardExist)
                return res.status(404).json({ error: `Board not found or you do not have access to this board` });
            // Prepare updates for tasks
            const taskUpdates = updatedSections.flatMap((section) => section.tasks.map((task) => db_1.default.task.update({
                where: { id: task.id },
                data: {
                    position: task.position,
                    sectionId: section.id,
                },
            })));
            // Execute all updates within a transaction
            await db_1.default.$transaction(taskUpdates);
            //Format response with current order in db and send it to client
            const data = await SectionController.getSectionData(boardId);
            return res.status(200).json({
                message: 'Tasks positions updated successfully',
                data: data,
            });
        }
        catch (error) {
            return res.status(500).json({
                error: 'An error occurred while updating tasks positions',
                details: error,
            });
        }
    }
}
exports.default = SectionController;
