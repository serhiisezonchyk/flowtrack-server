import { Request, Response } from 'express';
import prisma from '../db';

export default class SectionController {
  static async getAll(req: Request, res: Response) {
    const userId = req.user?.id;
    const { boardId } = req.params;

    try {
      const data = await prisma.section.findMany({
        where: {
          boardId: boardId,
          board: {
            user: {
              id: userId,
            },
          },
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
      return res.status(200).json({ data });
    } catch (error) {
      return res.status(501).json({ error: `An error occured while sections retreaving`, details: error });
    }
  }
  static async create(req: Request, res: Response) {
    const userId = req.user?.id;
    const { boardId } = req.params;

    try {
      const position = await prisma.section.count();
      const data = await prisma.section.create({
        data: {
          position: position,
          boardId: boardId as string,
        },
      });
      return res.status(200).json({ message: `Section was added successfully.`, data });
    } catch (error) {
      return res.status(501).json({ error: `An error occured while sections retreaving`, details: error });
    }
  }
  static async updateTitle(req: Request, res: Response) {
    const userId = req.user?.id;
    const { sectionId } = req.params;
    const body = req.body;
    try {
      const toUpdate = await prisma.section.findUnique({
        where: {
          id: sectionId,
        },
      });
      if (!toUpdate)
        return res.status(406).json({
          error: `Cannot find section with id=${sectionId}`,
          details: '',
        });
      const data = await prisma.section.update({
        where: {
          id: toUpdate.id,
        },
        data: {
          title: body.title,
        },
      });
      return res.status(200).json({ message: `Section was updated successfully.`, data });
    } catch (error) {
      return res.status(501).json({ error: `An error occured while sections retreaving`, details: error });
    }
  }
  
  static async updatePositions(req: Request, res: Response) {
    console.log('first');
    console.log(req.body);

    const userId = req.user?.id;
    const { boardId } = req.params;
    const body: { id: string; position: number }[] = req.body;
    try {
      const data = await prisma.$transaction(
        body.map((section) =>
          prisma.section.update({
            where: { id: section.id },
            data: { position: section.position },
          }),
        ),
      );
      return res.status(200).json({ message: `Section was updated successfully.`, data });
    } catch (error) {
      return res.status(501).json({ error: `An error occured while section order was changed`, details: error });
    }
  }
}
