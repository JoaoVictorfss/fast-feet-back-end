import * as Yup from 'yup';

import Deliveryman from '../models/deliveryman';
import File from '../models/file';

class DeliverymanController {
  async index(req, res) {
    const { name } = req.query;
    let deliverymen;
    if (name) {
      deliverymen = await Deliveryman.findAll({
        where: { name },
        attributes: ['id', 'name', 'email', 'avatar_id'],
        include: [
          { model: File, as: 'avatar', attributes: ['name', 'path', 'url'] },
        ],
      });
      if (!deliverymen) {
        return res.status(400).json({ error: 'Deliveryman does not match' });
      }
    } else {
      deliverymen = await Deliveryman.findAll({
        attributes: ['id', 'name', 'email', 'avatar_id'],
        include: [
          { model: File, as: 'avatar', attributes: ['name', 'path', 'url'] },
        ],
      });
    }
    return res.json(deliverymen);
  }

  async showById(req, res) {
    const { id } = req.params;

    const deliveryman = await Deliveryman.findByPk(id, {
      attributes: ['id', 'name', 'email', 'avatar_id'],
      include: [
        { model: File, as: 'avatar', attributes: ['name', 'path', 'url'] },
      ],
    });
    if (!deliveryman) {
      return res.status(400).json({ error: 'Deliveryman does not match' });
    }

    return res.json(deliveryman);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string().email().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { email, avatar_id } = req.body;

    if (avatar_id) {
      const avatarExists = await File.findByPk(avatar_id);
      if (!avatarExists) {
        return res.status(400).json({ error: 'Invalid avatar.' });
      }
    }

    const deliverymanExits = await Deliveryman.findOne({
      where: { email },
    });

    if (deliverymanExits) {
      return res.status(400).json({ error: 'Deliveryman already exists.' });
    }

    const deliveryman = await Deliveryman.create(req.body);

    return res.json(deliveryman);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
      avatar_id: Yup.number(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { id } = req.params;

    const deliveryman = await Deliveryman.findByPk(id);

    if (!deliveryman) {
      return res.status(400).json({ error: 'Deliveryman does not match' });
    }

    const { email, avatar_id } = req.body;

    if (email) {
      if (email !== deliveryman.email) {
        const deliverymanExits = await Deliveryman.findOne({
          where: { email },
        });

        if (deliverymanExits) {
          return res.status(400).json({ error: 'User already exists.' });
        }
      }
    }

    if (avatar_id) {
      if (avatar_id !== deliveryman.avatar_id) {
        const avatarExists = await File.findByPk(avatar_id);

        if (!avatarExists) {
          return res.status(400).json({ error: 'Invalid avatar.' });
        }
      }
    }

    const updateDeliveryman = await deliveryman.update(req.body);

    return res.json(updateDeliveryman);
  }

  async delete(req, res) {
    const { id } = req.params;

    const deliveryman = await Deliveryman.findByPk(id);

    if (!deliveryman) {
      return res.status(400).json({ error: 'Deliveryman does not match' });
    }

    await deliveryman.destroy();

    return res.json({ done: 'Deliveryman was deleted' });
  }
}

export default new DeliverymanController();
