import { Request, Response } from 'express';
import prisma from '../db';
import { slugify } from '../utils/helpers';
import { BoardCreateSchemaType } from '../schemas/boardSchemas';

export default class BoardController {
  static isBoardExist = async (boardId: string, userId: string) => {
    const data = await prisma.board.findUnique({
      where: {
        id: boardId,
        userId,
      },
    });
    if (!data) return false;
    return true;
  };
  static async getAll(req: Request, res: Response) {
    const userId = req.user?.id;
    const data = await prisma.board.findMany({
      where: {
        userId: userId,
      },
    });
    res.status(200).json({ data });
  }
  static async getOne(req: Request, res: Response) {
    const userId = req.user?.id;
    const { slug } = req.params;
    const data = await prisma.board.findUnique({
      where: {
        userId_slug: {
          userId: userId as string,
          slug: slug as string,
        },
      },
    });
    res.status(200).json({ data });
  }
  static async delete(req: Request, res: Response) {
    const userId = req.user?.id;
    const id = req.params.id;
    try {
      await prisma.board.delete({
        where: {
          id: id,
          userId: userId,
        },
      });
      res.status(200).json({ message: `Board ${id} was deleted successfully.` });
    } catch (error) {
      return res.status(501).json({ error: `An error occured while board:${id} was deleting`, details: error });
    }
  }

  static async create(req: Request, res: Response) {
    const userId = req.user?.id as string;
    const body: BoardCreateSchemaType = req.body;
    try {
      const slug = slugify(body.title);
      const isSlugExist = await prisma.board.findUnique({
        where: {
          userId_slug: {
            userId: userId,
            slug: slug,
          },
        },
      });
      if (!isSlugExist) {
        const data = await prisma.board.create({
          data: { ...body, slug: slug, userId },
        });
        return res.status(200).json({ message: `Board was added successfully.`, data });
      }
      return res.status(406).json({
        error: `Slug "${isSlugExist.slug}" is already exist.`,
        details: 'Change title of board to create new one.',
      });
    } catch (error) {
      return res.status(501).json({ error: `An error occured while board:${body.title} was adding`, details: error });
    }
  }
  static async update(req: Request, res: Response) {
    const userId = req.user?.id as string;
    const body = req.body;
    const id = req.params.id;
    try {
      const toUpdate = await prisma.board.findUnique({
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
        const slug = slugify(body.title);
        const isSlugExist = await prisma.board.findUnique({
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

      const updatedData = await prisma.board.update({
        where: {
          id,
        },
        data,
      });
      return res.status(200).json({ message: `Board was updated successfully.`, data: updatedData });
    } catch (error) {
      return res.status(501).json({ error: `An error occured while board:${id} was updating`, details: error });
    }
  }
  static async changeIsSaved(req: Request, res: Response) {
    const userId = req.user?.id as string;
    const id = req.params.id;
    try {
      const board = await prisma.board.findUnique({
        where: { id, userId },
      });

      if (!board) {
        return res.status(404).json({ error: `Cannot find board with id=${id}` });
      }

      const newIsSaved = !board.isSaved;

      const updatedData = await prisma.board.update({
        where: { id },
        data: { isSaved: newIsSaved },
      });

      return res.status(200).json({ message: `Board was updated successfully.`, data: updatedData });
    } catch (error) {
      return res.status(501).json({ error: `An error occured while board:${id} was updating`, details: error });
    }
  }
}
