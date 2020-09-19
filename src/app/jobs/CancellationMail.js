import Mail from '../../lib/Mail';

class CancellationMail {
  get key() {
    return 'CancellationMail';
  }

  async handle({ data }) {
    const { context } = data;

    await Mail.sendMail({
      to: `${context.deliverymanName} <${context.deliverymanEmail}>`,
      subject: 'Encomenda cancelada',
      template: 'cancellation',
      context,
    });
  }
}

export default new CancellationMail();
