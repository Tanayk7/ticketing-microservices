import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken'

import { Password } from '../utils/password';
import { validateRequest, BadRequestError } from '@tktickets1111/common';
import { User } from '../models/user';

const router = express.Router();

const validation_rules = [
    body('email').isEmail().withMessage("Email must be valid"),
    body('password').trim().notEmpty().withMessage("You must supply a password")
]

router.post(
    "/api/users/signin",
    validation_rules,
    validateRequest,
    async (req: Request, res: Response) => {
        const { email, password } = req.body;

        const existingUser = await User.findOne({ email });
        if (!existingUser) {
            throw new BadRequestError("Invalid credentials");
        }

        const passwordsMatch = await Password.compare(existingUser.password, password);
        if (!passwordsMatch) {
            throw new BadRequestError("Invalid credentials");
        }

        // generate JWT 
        const userJWT = jwt.sign(
            {
                id: existingUser.id,
                email: existingUser.email
            },
            process.env.JWT_KEY!
        );

        // Store it on the session object
        req.session = { jwt: userJWT }

        res.status(200).send(existingUser);
    }
);

export { router as signinRouter };