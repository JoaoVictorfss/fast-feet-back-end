import * as Yup from 'yup';

import Order from '../models/order';
import Recipient from '../models/recipient';
import Deliveryman from '../models/deliveryman';
import File from '../models/file';

import Queue from '../../lib/Queue';
import RegistrationMail from '../jobs/RegistrationMail';

class OrderController {
  async showAll(req, res) {
    const orders = await Order.findAll({
      attributes: ['id', 'product', 'canceled_at', 'start_at', 'end_at'],
      include: [
        {
          as: 'deliveryman',
          model: Deliveryman,
          attributes: ['id', 'name', 'email'],
          include: [
            { model: File, as: 'avatar', attributes: ['name', 'path', 'url'] },
          ],
        },
        {
          as: 'recipient',
          model: Recipient,
          attributes: [
            'id',
            'name',
            'street',
            'number',
            'complement',
            'state',
            'city',
            'zip_code',
          ],
        },
        {
          as: 'signature_picture',
          model: File,
          attributes: ['name', 'path', 'url'],
        },
      ],
    });

    return res.json(orders);
  }

  async index(req, res) {
    const { id } = req.params;

    const order = await Order.findByPk(id, {
      attributes: ['id', 'product', 'canceled_at', 'start_at', 'end_at'],
      include: [
        {
          as: 'deliveryman',
          model: Deliveryman,
          attributes: ['id', 'name', 'email'],
          include: [
            { model: File, as: 'avatar', attributes: ['name', 'path', 'url'] },
          ],
        },
        {
          as: 'recipient',
          model: Recipient,
          attributes: [
            'id',
            'name',
            'street',
            'number',
            'complement',
            'state',
            'city',
            'zip_code',
          ],
        },
        {
          as: 'signature_picture',
          model: File,
          attributes: ['name', 'path', 'url'],
        },
      ],
    });

    if (!order) {
      return res.status(400).json({ error: 'Order does not match' });
    }

    return res.json(order);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      product: Yup.string().required(),
      deliveryman_id: Yup.number().required(),
      recipient_id: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { product, deliveryman_id, recipient_id } = req.body;

    const deliverymanExists = await Deliveryman.findByPk(deliveryman_id);
    if (!deliverymanExists) {
      return res.status(400).json({ error: 'Invalid Deliveryman' });
    }

    const recipientExists = await Recipient.findByPk(recipient_id);
    if (!recipientExists) {
      return res.status(400).json({ error: 'Invalid reliveryman' });
    }

    const context = {
      product,
      deliverymanName: deliverymanExists.name,
      name: recipientExists.name,
      street: recipientExists.street,
      number: recipientExists.number,
      city: recipientExists.city,
      state: recipientExists.state,
      zipe_code: recipientExists.zip_code,
      adressComplement: recipientExists.complement,
    };

    await Queue.add(RegistrationMail.key, {
      context,
      deliverymanExists,
    });

    const order = await Order.create(req.body);

    return res.json(order);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      product: Yup.string(),
      deliveryman_id: Yup.number(),
      recipient_id: Yup.number(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { id } = req.params;
    const order = await Order.findByPk(id);

    if (!order) {
      return res.status(400).json({ error: 'Order does not match' });
    }

    const { deliveryman_id, recipient_id } = req.body;

    if (deliveryman_id) {
      if (deliveryman_id !== order.deliveryman_id) {
        const deliverymanExists = await Deliveryman.findByPk(deliveryman_id);
        if (!deliverymanExists) {
          return res.status(400).json({ error: 'Invalid deliveryman' });
        }
      }
    }

    if (recipient_id) {
      if (recipient_id !== order.recipient_id) {
        const recipientExists = await Recipient.findByPk(recipient_id);
        if (!recipientExists) {
          return res.status(400).json({ error: 'Invalid recipient' });
        }
      }
    }

    const updateOrder = await order.update(req.body);

    return res.json(updateOrder);
  }

  async delete(req, res) {
    const { id } = req.params;
    const order = await Order.findByPk(id);

    if (!order) {
      return res.status(400).json({ error: 'Order does not match' });
    }

    if (order.start_at !== null) {
      return res.status(400).json({
        error: 'You can only cancel orders if they have not yet been removed',
      });
    }

    await order.destroy();

    return res.json({ done: 'Order was deleted' });
  }
}

export default new OrderController();
