import { Request, Response } from "express";
import { AuthService } from "../services/auth.service";
import { loginSchema, updateProfileSchema } from "../schemas/auth.schema";

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  login = async (req: Request, res: Response) => {
    const { email, password } = loginSchema.parse(req.body);
    const result = await this.authService.login(email, password);
    res.json(result);
  };

  me = async (req: Request, res: Response) => {
    const adminId = req.adminId as string;
    const admin = await this.authService.me(adminId);
    res.json(admin);
  };

  updateProfile = async (req: Request, res: Response) => {
    const adminId = req.adminId as string;
    const data = updateProfileSchema.parse(req.body);
    const updated = await this.authService.updateProfile(adminId, data);
    res.json(updated);
  };
}
