import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';

import authMiddleware from './app/middlewares/auth';

import SessionController from './app/controllers/SessionController';
import RecipientController from './app/controllers/RecipientController';
import FileController from './app/controllers/FileController';
import DeliverymanController from './app/controllers/DeliverymanController';
import OrderController from './app/controllers/OrderController';
import DeliveryPackgesController from './app/controllers/DeliverymanPackgesController';
import DeliveryProblemController from './app/controllers/DeliveryProblemController';

const routes = new Router();
const upload = multer(multerConfig);

// for deliverymen

// Update orders status
routes.put(
  '/deliveryman/:deliveryman_id/deliveries/:order_id',
  DeliveryPackgesController.update
);

// list orders
routes.get('/deliveryman/:id/deliveries', DeliveryPackgesController.index);

// problems
routes.post(
  '/delivery/:deliveryman_id/problems/:id',
  DeliveryProblemController.store
);

// end deliverymen

// for administrators

// create session
routes.post('/sessions', SessionController.store);

routes.use(authMiddleware);

// Recipients
routes.get('/recipients', RecipientController.index);
routes.get('/recipients/:id', RecipientController.showById);
routes.post('/recipients', RecipientController.store);
routes.put('/recipients/:id', RecipientController.update);
routes.delete('/recipients/:id', RecipientController.delete);

// files
routes.post('/files', upload.single('file'), FileController.store);

// deliveryman
routes.get('/deliveryman', DeliverymanController.index);
routes.get('/deliveryman/:id', DeliverymanController.showById);
routes.post('/deliveryman', DeliverymanController.store);
routes.put('/deliveryman/:id', DeliverymanController.update);
routes.delete('/deliveryman/:id', DeliverymanController.delete);

// order
routes.get('/orders/:id', OrderController.index);
routes.get('/orders', OrderController.showAll);
routes.post('/orders', OrderController.store);
routes.put('/orders/:id', OrderController.update);
routes.delete('/orders/:id', OrderController.delete);

// problems
routes.get('/delivery/:id/problems', DeliveryProblemController.show);
routes.get('/problems', DeliveryProblemController.index);
routes.delete('/problems/:id', DeliveryProblemController.delete);

export default routes;
