import Sequelize from 'sequelize';

import databaseConfig from '../config/database';
import User from '../app/models/user';
import Recipient from '../app/models/recipient';
import Deliveryman from '../app/models/deliveryman';
import File from '../app/models/file';
import Order from '../app/models/order';
import DeliveryProblem from '../app/models/deliveryProblem';

const models = [User, Recipient, File, Deliveryman, Order, DeliveryProblem];

class Database {
  constructor() {
    this.init();
  }

  init() {
    this.connection = new Sequelize(databaseConfig);
    models
      .map((model) => model.init(this.connection))
      .map(
        (model) => model.associate && model.associate(this.connection.models)
      );
  }
}

export default new Database();
