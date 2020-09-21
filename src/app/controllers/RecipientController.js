import * as Yup from 'yup';
import Recipient from '../models/recipient';

class RecepientController {
  // show by name or all
  async index(req, res) {
    const { name } = req.query;
    let recipients;
    if (name) {
      recipients = await Recipient.findAll({
        where: { name },
      });
      if (!recipients) {
        return res.status(400).json({ error: 'recipient does not match' });
      }
    } else {
      recipients = await Recipient.findAll();
    }
    return res.json(recipients);
  }

  // show by id
  async showById(req, res) {
    const { id } = req.params;
    const recipient = await Recipient.findByPk(id);
    if (!recipient) {
      return res.status(400).json({ error: 'recipient does not match' });
    }

    return res.json(recipient);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      street: Yup.string().required(),
      number: Yup.string().required(),
      state: Yup.string().required(),
      city: Yup.string().required(),
      zip_code: Yup.string().required(),
      complement: Yup.string(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const userExits = await Recipient.findOne({
      where: {
        name: req.body.name,
        zip_code: req.body.zip_code,
        number: req.body.number,
      },
    });

    if (userExits) {
      return res.status(400).json({ error: 'User already exists.' });
    }

    const {
      id,
      name,
      street,
      number,
      state,
      city,
      zip_code,
      complement,
    } = await Recipient.create(req.body);

    return res.json({
      id,
      name,
      street,
      number,
      state,
      city,
      zip_code,
      complement,
    });
  }

  async update(req, res) {
    const { id } = req.params;

    const recipient = await Recipient.findByPk(id);

    if (!recipient) {
      return res.status(400).json({ error: 'Invalid recipient.' });
    }

    const updatedRecipient = await recipient.update(req.body);

    return res.json(updatedRecipient);
  }

  async delete(req, res) {
    const { id } = req.params;

    const recipient = await Recipient.findByPk(id);

    if (!recipient) {
      return res.status(400).json({ error: 'recipient does not match' });
    }

    await recipient.destroy();

    return res.json({ done: 'recipient was deleted' });
  }
}

export default new RecepientController();
