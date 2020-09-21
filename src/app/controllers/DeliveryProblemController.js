import * as Yup from 'yup';

import Order from '../models/order';
import DeliveryProblem from '../models/deliveryProblem';
import Recipient from '../models/recipient';
import Deliveryman from '../models/deliveryman';

import Queue from '../../lib/Queue';
import CancellationMail from '../jobs/CancellationMail';

class DeliveryProblemController {
  async index(req, res) {
    const deliveryProblems = await DeliveryProblem.findAll({
      include: [{ model: Order, where: { canceled_at: null } }],
      attributes: ['description', 'created_at', 'id'],
    });

    return res.json(deliveryProblems);
  }

  async showById(req, res) {
    const { id } = req.params;
    const problem = await DeliveryProblem.findByPk(id);

    if (!problem) {
      return res.status(400).json({ error: 'Problem does not match.' });
    }

    return res.json(problem);
  }

  async show(req, res) {
    const { id } = req.params;

    const orderExists = await Order.findByPk(id);
    if (!orderExists) {
      return res.status(400).json({ error: 'Order does not match.' });
    }

    const deliveryProblems = await DeliveryProblem.findAll({
      where: {
        delivery_id: id,
      },
      include: [{ model: Order }],
      attributes: ['id', 'description', 'created_at'],
    });

    return res.json(deliveryProblems);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      description: Yup.string().required(),
    });
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { deliveryman_id, id } = req.params;

    const order = await Order.findOne({
      where: { id, deliveryman_id, canceled_at: null },
    });
    if (!order) {
      return res.status(400).json({ error: 'Order does not match' });
    }

    const { description } = req.body;

    const deliveryProblem = await DeliveryProblem.create({
      delivery_id: id,
      description,
    });

    return res.json(deliveryProblem);
  }

  async delete(req, res) {
    const { id } = req.params;

    const problemExists = await DeliveryProblem.findByPk(id);

    if (!problemExists) {
      return res.status(400).json({ error: 'Order does not match' });
    }

    const orderId = problemExists.delivery_id;

    const order = await Order.findByPk(orderId, {
      include: [
        { model: Recipient, as: 'recipient' },
        { model: Deliveryman, as: 'deliveryman' },
      ],
    });

    if (!order) {
      return res.status(400).json({
        error: 'order has already been canceled',
      });
    }

    const updatedOrder = await order.update({
      canceled_at: new Date(),
    });

    const context = {
      deliverymanName: order.deliveryman.name,
      deliverymanEmail: order.deliveryman.email,
      reason: problemExists.description,
      orderId: order.id,
      product: order.product,
      name: order.recipient.name,
      street: order.recipient.street,
      number: order.recipient.number,
      adress_complement: order.recipient.complement,
      state: order.recipient.state,
      city: order.recipient.city,
      zip_code: order.recipient.zip_code,
    };

    await Queue.add(CancellationMail.key, {
      context,
    });

    return res.json(updatedOrder);
  }
}

export default new DeliveryProblemController();
