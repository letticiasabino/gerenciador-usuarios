import { Request, Response } from "express";
import { UserService } from "../services/user.service";
import {
  createUserSchema,
  updateUserSchema,
  updateStatusSchema,
  queryUsersSchema,
} from "../schemas/user.schema";

export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  create = async (req: Request, res: Response) => {
    const data = createUserSchema.parse(req.body);
    const user = await this.userService.create(data);
    res.status(201).json(user);
  };

  findAll = async (req: Request, res: Response) => {
    const query = queryUsersSchema.parse(req.query);
    const result = await this.userService.findAll(query);
    res.json(result);
  };

  getStats = async (_req: Request, res: Response) => {
    const stats = await this.userService.getStats();
    res.json(stats);
  };

  findById = async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const user = await this.userService.findById(id);
    res.json(user);
  };

  update = async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const data = updateUserSchema.parse(req.body);
    const user = await this.userService.update(id, data);
    res.json(user);
  };

  updateStatus = async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const { status } = updateStatusSchema.parse(req.body);
    const user = await this.userService.updateStatus(id, status);
    res.json(user);
  };

  delete = async (req: Request, res: Response) => {
    const id = req.params.id as string;
    await this.userService.delete(id);
    res.status(204).send();
  };
}
