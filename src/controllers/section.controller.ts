import { Request, Response } from 'express';
import prisma from '../db';

export default class SectionController {
  private static async getSectionData(boardId: string) {
    const data = await prisma.section.findMany({
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
  static async getAll(req: Request, res: Response) {
    const userId = req.user?.id;
    const { boardId } = req.params;

    try {
      const data = await SectionController.getSectionData(boardId as string);
      return res.status(200).json({ data });
    } catch (error) {
      console.log(error);
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
    const userId = req.user?.id;
    const { boardId } = req.params;
    const body: { id: string; position: number }[] = req.body;
    try {
      await prisma.$transaction(
        body.map((section) =>
          prisma.section.update({
            where: { id: section.id },
            data: { position: section.position },
          }),
        ),
      );

      const data = await SectionController.getSectionData(boardId as string);

      return res.status(200).json({ message: `Sections positions updated successfully`, data });
    } catch (error) {
      return res.status(501).json({ error: `An error occurred while updating sections positions`, details: error });
    }
  }
  static async delete(req: Request, res: Response) {
    const { sectionId } = req.params;
    try {
      await prisma.section.delete({
        where: {
          id: sectionId,
        },
      });
      return res.status(200).json({ message: `Section ${sectionId} was deleted successfully.` });
    } catch (error) {
      return res
        .status(501)
        .json({ error: `An error occured while section:${sectionId} was deleting`, details: error });
    }
  }
  static async updateTasksPositions(req: Request, res: Response) {
    const updatedSections: { id: string; tasks: { id: string; position: number }[] }[] = req.body;
    const { boardId } = req.params;

    try {
      // Prepare updates for tasks
      const taskUpdates = updatedSections.flatMap((section) =>
        section.tasks.map((task) =>
          prisma.task.update({
            where: { id: task.id },
            data: {
              position: task.position,
              sectionId: section.id,
            },
          }),
        ),
      );

      // Execute all updates within a transaction
      await prisma.$transaction(taskUpdates);

      const data = await SectionController.getSectionData(boardId as string);

      res.status(200).json({
        message: 'Tasks positions updated successfully',
        data: data,
      });
    } catch (error) {
      res.status(500).json({
        error: 'An error occurred while updating tasks positions',
        details: error,
      });
    }
  }
}
