#!/usr/bin/env npx ts-node --compiler-options {"module":"commonjs"}

import {connect} from "./connect";

let domain;

connect(undefined, false)
  .then(d => {
    domain = d;
    return domain.dispose();
  })
  .catch(e => console.error(e));
