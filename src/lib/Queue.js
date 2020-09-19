import Bee from 'bee-queue';
import redisConfig from '../config/redis';

import RegistrationMail from '../app/jobs/RegistrationMail';
import CancellatioMail from '../app/jobs/CancellationMail';

const jobs = [RegistrationMail, CancellatioMail];

class Queue {
  constructor() {
    this.queues = {};
    this.init();
  }

  init() {
    jobs.forEach(({ key, handle }) => {
      this.queues[key] = {
        bee: new Bee(key, {
          redis: redisConfig,
        }),
        handle,
      };
    });
  }

  add(queue, job) {
    return this.queues[queue].bee.createJob(job).save();
  }

  processQueue() {
    jobs.forEach((job) => {
      const { bee, handle } = this.queues[job.key];
      bee.on('failed', this.handFailure).process(handle);
    });
  }

  handFailure(job, err) {
    console.log(`Queue ${job.queue.name}:FAILED`, err);
  }
}

export default new Queue();
