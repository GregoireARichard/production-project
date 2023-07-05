import { NextFunction, Request, Response, Router } from "express";
import { OkPacket, RowDataPacket } from 'mysql2';
import { DB } from "../utility/db";
import { ICreateResponse } from "../types/createResponse";
import { IIndexQuery, IIndexResponse, ITableCount } from "../types/IIndexQuery";
import { IUpdateResponse } from "../types/IUpdateResponse";
import { IDeleteResponse } from "../types/IDeleteResponse";
import { IUser, IUserRO } from "../model/user";

const routerIndex = Router({ mergeParams: true });

routerIndex.get<{}, IIndexResponse<IUserRO>, {}, IIndexQuery>('/',
  async (request, response, next: NextFunction) => {

    try {

      const db = DB.Connection;
      
      // On suppose que le params query sont en format string, et potentiellement
      // non-numérique, ou corrompu
      const page = parseInt(request.query.page || "0") || 0;
      const limit = parseInt(request.query.limit || "10") || 0;
      const offset = page * limit;

      // D'abord, récupérer le nombre total
      const count = await db.query<ITableCount[] & RowDataPacket[]>("select count(*) as total from user");      

      // Récupérer les lignes
      const data = await db.query<IUserRO[] & RowDataPacket[]>("select userId, familyName, givenName, email from user limit ? offset ?", [limit, offset]);      

      // Construire la réponse
      const res: IIndexResponse<IUserRO> = {
        page,
        limit,
        total: count[0][0].total,
        rows: data[0]
      }

      response.json(res);

    } catch (err: any) {
      next(err);
    }

  }
);


routerIndex.post<{}, ICreateResponse, IUser>('/',
  async (request, response, next: NextFunction) => {

    try {
      const user = request.body;

      // ATTENTION ! Et si les données dans user ne sont pas valables ?
      // - colonnes qui n'existent pas ?
      // - données pas en bon format ?

      const db = DB.Connection;
      const data = await db.query<OkPacket>("insert into user set ?", user);

      response.json({ 
        id: data[0].insertId
      });

    } catch (err: any) {
      next(err);
    }

  }
);

const routerSimple = Router({ mergeParams: true });


routerSimple.get<{ userId: string }, IUserRO, {}>('/:userId',
  async (request, response, next: NextFunction) => {
    try {
      const userId = request.params.userId;

      const db = DB.Connection;
      // Récupérer les lignes
      const data = await db.query<IUserRO[] & RowDataPacket[]>("select userId, familyName, givenName, email from user where userId = ?", [userId]);      

      const res = data[0][0];
        
      response.json(res);

    } catch (err: any) {
      next(err);
    }
  }
);
routerSimple.put<{ userId: string }, IUpdateResponse, IUser>('',
  async (request, response, next: NextFunction) => {
    try {
      // ATTENTION ! Valider que le userId est valable ?
      const userId = request.params.userId;
      const body = request.body;

      const db = DB.Connection;
      // Récupérer les lignes
      const data = await db.query<OkPacket>(`update user set ? where userId = ?`, [body, userId]);

      // Construire la réponse
      const res = {
        id: userId,
        rows: data[0].affectedRows
      }
        
      response.json(res);

    } catch (err: any) {
      next(err);
    }
  }
);

routerSimple.delete<{ userId: string }, IDeleteResponse, {}>('',
  async (request, response, next: NextFunction) => {
    try {
      // ATTENTION ! Valider que le userId est valable ?
      const userId = request.params.userId;
      const db = DB.Connection;

      // Récupérer les lignes
      const data = await db.query<OkPacket>(`delete from user where userId = ?`, [ userId ]);      

      // Construire la réponse
      const res = {
        id: userId,
        rows: data[0].affectedRows
      }
        
      response.json(res);

    } catch (err: any) {
      next(err);
    }
  }
);

const routerUser = Router({ mergeParams: true });
routerUser.use(routerIndex);
routerUser.use(routerSimple); 

export const ROUTES_USER = routerUser;