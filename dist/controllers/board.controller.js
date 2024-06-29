"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = __importDefault(require("../db"));
const helpers_1 = require("../utils/helpers");
class BoardController {
    static async getAll(req, res) {
        const userId = req.user?.id;
        const data = await db_1.default.board.findMany({
            where: {
                userId: userId,
            },
        });
        res.status(200).json({ data });
    }
    static async getOne(req, res) {
        const userId = req.user?.id;
        const { slug } = req.params;
        const data = await db_1.default.board.findUnique({
            where: {
                userId_slug: {
                    userId: userId,
                    slug: slug,
                },
            },
        });
        res.status(200).json({ data });
    }
    static async delete(req, res) {
        const userId = req.user?.id;
        const id = req.params.id;
        try {
            await db_1.default.board.delete({
                where: {
                    id: id,
                    userId: userId,
                },
            });
            res.status(200).json({ message: `Board ${id} was deleted successfully.` });
        }
        catch (error) {
            return res.status(501).json({ error: `An error occured while board:${id} was deleting`, details: error });
        }
    }
    static async create(req, res) {
        const userId = req.user?.id;
        const body = req.body;
        try {
            const slug = (0, helpers_1.slugify)(body.title);
            const isSlugExist = await db_1.default.board.findUnique({
                where: {
                    userId_slug: {
                        userId: userId,
                        slug: slug,
                    },
                },
            });
            if (!isSlugExist) {
                const data = await db_1.default.board.create({
                    data: { ...body, slug: slug, userId },
                });
                return res.status(200).json({ message: `Board was added successfully.`, data });
            }
            return res.status(406).json({
                error: `Slug "${isSlugExist.slug}" is already exist.`,
                details: 'Change title of board to create new one.',
            });
        }
        catch (error) {
            return res.status(501).json({ error: `An error occured while board:${body.title} was adding`, details: error });
        }
    }
    static async update(req, res) {
        const userId = req.user?.id;
        const body = req.body;
        const id = req.params.id;
        try {
            const toUpdate = await db_1.default.board.findUnique({
                where: {
                    id,
                },
            });
            if (!toUpdate)
                return res.status(406).json({
                    error: `Cannot find board with id=${id}`,
                    details: '',
                });
            let data = { ...body };
            if (body?.title && body?.title !== toUpdate.title) {
                const slug = (0, helpers_1.slugify)(body.title);
                const isSlugExist = await db_1.default.board.findUnique({
                    where: {
                        userId_slug: {
                            userId: userId,
                            slug: slug,
                        },
                    },
                });
                if (isSlugExist && isSlugExist.id !== id) {
                    return res.status(406).json({
                        error: `Slug "${isSlugExist.slug}" is already exist.`,
                        details: 'Change title to different from other ones',
                    });
                }
                Object.assign(data, { slug: slug });
            }
            const updatedData = await db_1.default.board.update({
                where: {
                    id,
                },
                data,
            });
            return res.status(200).json({ message: `Board was updated successfully.`, data: updatedData });
        }
        catch (error) {
            return res.status(501).json({ error: `An error occured while board:${id} was updating`, details: error });
        }
    }
    static async changeIsSaved(req, res) {
        const userId = req.user?.id;
        const id = req.params.id;
        try {
            const board = await db_1.default.board.findUnique({
                where: { id, userId },
            });
            if (!board) {
                return res.status(404).json({ error: `Cannot find board with id=${id}` });
            }
            const newIsSaved = !board.isSaved;
            const updatedData = await db_1.default.board.update({
                where: { id },
                data: { isSaved: newIsSaved },
            });
            return res.status(200).json({ message: `Board was updated successfully.`, data: updatedData });
        }
        catch (error) {
            return res.status(501).json({ error: `An error occured while board:${id} was updating`, details: error });
        }
    }
}
_a = BoardController;
BoardController.isBoardExist = async (boardId, userId) => {
    const data = await db_1.default.board.findUnique({
        where: {
            id: boardId,
            userId,
        },
    });
    if (!data)
        return false;
    return true;
};
exports.default = BoardController;
