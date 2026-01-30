import { NextFunction, Request, RequestHandler, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { asyncWrapper } from "./asyncWrapper";
// export function updateOne(service: any, toDocResponse: any) {
//   return asyncWrapper(
//     async (req: Request, res: Response, next: NextFunction) => {
//       console.log("inside factory");
//       const doc = await service.updateOne(req.params.id, req.body);
//       res.status(StatusCodes.OK).json({
//         status: "success",
//         data: toDocResponse(doc),
//       });
//     }
//   );
// }
