import { Op } from 'sequelize';
import {
  startOfDay,
  endOfDay,
  isAfter,
  isBefore,
  setHours,
  setMinutes,
  setSeconds,
} from 'date-fns';
import Order from '../models/order';
import Recipient from '../models/recipient';
import Deliveryman from '../models/deliveryman';
import File from '../models/file';

class DeliverymanPackgesController {
  async index(req, res) {
    const { id } = req.params;

    const deliveryman = await Deliveryman.findByPk(id);

    if (!deliveryman) {
      return res.status(400).json({ error: 'Deliveryman does not match' });
    }

    const order = await Order.findAll({
      where: { deliveryman_id: id, canceled_at: null, end_at: null },
      attributes: ['id', 'product', 'start_at'],
      include: [
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

    return res.json(order);
  }

  async update(req, res) {
    const { deliveryman_id, order_id } = req.params;

    const deliveryman = await Deliveryman.findOne({
      where: { id: deliveryman_id },
    });

    if (!deliveryman) {
      return res.status(400).json({ error: 'Deliveryman does not match' });
    }

    const order = await Order.findOne({
      where: {
        id: order_id,
        deliveryman_id,
        canceled_at: null,
        end_at: null,
      },
    });

    if (!order) {
      return res.status(400).json({
        error:
          'This order does not exist for you. Maybe it has already been withdrawn. Try another!',
      });
    }

    const { withdraw, delivery, signature } = req.body;

    if (withdraw === 'true') {
      // The number of withdrawals must be a maximum of five. For this, a column was added to the order table, whose name is wathdrawals, to keep track
      const withdrawalsOnDay = await Order.findAll({
        where: {
          start_at: {
            [Op.between]: [startOfDay(new Date()), endOfDay(new Date())],
          },
          deliveryman_id,
        },
      });

      const size = withdrawalsOnDay.length;

      if (size === 5) {
        return res
          .status(400)
          .json({ error: 'You can only make five withdrawals per day' });
      }

      if (order.start_at !== null) {
        return res
          .status(400)
          .json({ error: 'You already withdrew this order.' });
      }

      const start_date = new Date();

      const startInterval = setSeconds(
        setMinutes(setHours(start_date, 8), 0),
        0
      );

      const endInterval = setSeconds(
        setMinutes(setHours(start_date, 18), 0),
        0
      );

      if (
        isAfter(start_date, endInterval) ||
        isBefore(start_date, startInterval)
      ) {
        return res.status(400).json({
          error: 'Withdrawals can only do between 08:00a.m and 18:00p.m.',
        });
      }

      order.start_at = start_date;
    }

    if (delivery === 'true') {
      if (signature) {
        const imageExists = File.findByPk(signature);
        if (!imageExists) {
          return res.status(400).json({ error: 'Image does not match' });
        }
      }
      const end_date = new Date();

      order.signature_id = signature;
      order.end_at = end_date;
    }

    await order.save();

    return res.json(order);
  }
}

export default new DeliverymanPackgesController();
