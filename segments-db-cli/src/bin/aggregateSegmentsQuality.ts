#!/usr/bin/env node

import aggregateSegmentsQuality from '../command/aggregateSegmentsQuality';
import { IOutput } from '../command/model/IOutput';

function main(): void {
  /* eslint-disable no-console */
  const output = <IOutput>{
    log(message: string) {
      console.log(message);
    },
  };

  aggregateSegmentsQuality(output)
    .then(() => {
      console.log('Completed.');
      process.exit(0);
    })
    .catch((e) => {
      console.error(e);
    });
}

main();
