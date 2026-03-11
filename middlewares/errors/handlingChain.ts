import { duplicateKeyError } from "./errorChainTypes/duplicateKey";
import { ErrorHandlingChain } from "./errorChainTypes/errorHandlingChain";
import {
  errorSender,
  sendDevelopmentError,
  sendProductionError,
} from "./errorChainTypes/errorSender";
import { HandledError } from "./errorChainTypes/handled";
import { JwtTokenError } from "./errorChainTypes/jwtError";
import { validationError } from "./errorChainTypes/validationError";

let errSender: errorSender;
console.log(process.env.ENV_VARIABLE);
if (process.env.ENV_VARIABLE == "development") {
  errSender = new sendDevelopmentError();
} else {
  errSender = new sendProductionError();
}

export const errorChain: ErrorHandlingChain = new duplicateKeyError(errSender);
errorChain
  .setNextHandler(new HandledError(errSender))
  .setNextHandler(new validationError(errSender))
  .setNextHandler(new JwtTokenError(errSender));

// duplicateKeyErrorHandler.setNextHandler(new HandledError(errsender));
