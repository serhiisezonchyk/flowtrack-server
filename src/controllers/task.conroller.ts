import { Request, Response } from 'express';
import prisma from '../db';
import { TaskUpdateSchemaType } from '../schemas/taskSchemas';

export default class TaksController {
  static async getOne(req: Request, res: Response) {
    const { taskId } = req.params;
    const data = await prisma.task.findUnique({
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
  static async getAllForSection(req: Request, res: Response) {
    const { boardId, sectionId } = req.params;

    try {
      const data = await prisma.task.findMany({
        where: {
          sectionId: sectionId,
          section: {
            boardId: boardId,
          },
        },
      });
      return res.status(200).json({ data });
    } catch (error) {
      return res.status(501).json({ error: `An error occured while sections retreaving`, details: error });
    }
  }
  static async create(req: Request, res: Response) {
    const { sectionId } = req.params;
    try {
      const position = await prisma.task.count({
        where: {
          sectionId,
        },
      });

      const data = await prisma.task.create({
        data: {
          sectionId: sectionId as string,
          position,
        },
      });
      return res.status(200).json({ data });
    } catch (error) {
      return res.status(501).json({ error: `An error occured while sections retreaving`, details: error });
    }
  }
  static async delete(req: Request, res: Response) {
    const { taskId } = req.params;
    try {
      await prisma.task.delete({
        where: {
          id: taskId,
        },
      });
      return res.status(200).json({ message: `Task ${taskId} was deleted successfully.` });
    } catch (error) {
      return res.status(501).json({ error: `An error occured while task deleting`, details: error });
    }
  }
  static async update(req: Request, res: Response) {
    const { taskId } = req.params;
    const body: TaskUpdateSchemaType = req.body;
    try {
      const updatedTask = await prisma.task.findUnique({
        where: {
          id: taskId,
        },
      });
      if (!updatedTask)
        return res.status(406).json({
          error: `Cannot find task with id=${taskId}`,
          details: '',
        });

      const data = await prisma.section.update({
        where: {
          id: updatedTask.id,
        },
        data: {
          ...updatedTask,
        },
      });
      return res.status(200).json({ message: `Task was updated successfully.`, data });
    } catch (error) {
      return res.status(501).json({ error: `An error occured while task updating`, details: error });
    }
  }
}
