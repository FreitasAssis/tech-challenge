import { Joi, celebrate } from "celebrate";
import { Router } from "express";
import receiverController from "../controllers/receiverController";

const router = Router();

router.route("/seed-cache").get(receiverController.createCache);
router.route("/seed-db").get(receiverController.populateReceiver);

router
  .route("/receivers")
  .get(receiverController.listReceivers)
  .post(
    celebrate(
      {
        body: Joi.object().keys({
          name: Joi.string().required(),
          document: Joi.string().required(),
          email: Joi.string().required(),
          pixKeyType: Joi.string()
            .valid("CPF", "CNPJ", "EMAIL", "TELEFONE", "CHAVE_ALEATORIA")
            .required(),
          pixKey: Joi.string().max(140).required(),
        }),
      },
      { abortEarly: false }
    ),
    receiverController.createReceiver
  )
  .delete(
    celebrate(
      {
        body: Joi.object().keys({
          ids: Joi.array().items(Joi.string().required()).required(),
        }),
      },
      { abortEarly: false }
    ),
    receiverController.deleteReceivers
  );

router
  .route("/receivers/:id")
  .get(receiverController.getReceiverById)
  .patch(
    celebrate(
      {
        body: Joi.object().keys({
          name: Joi.string(),
          document: Joi.string(),
          email: Joi.string(),
          pixKeyType: Joi.string().valid(
            "CPF",
            "CNPJ",
            "EMAIL",
            "TELEFONE",
            "CHAVE_ALEATORIA"
          ),
          pixKey: Joi.string().max(140),
        }),
      },
      { abortEarly: false }
    ),
    receiverController.updateReceiver
  );

export default router;
