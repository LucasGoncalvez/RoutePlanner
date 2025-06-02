# Copyright (c) 2020, 2021 Oracle and/or its affiliates.
# Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.
FROM node:20

WORKDIR workdir
COPY ./ /workdir

RUN npm install

RUN npm run build

RUN npm install -g serve

CMD ["npm", "start"]

EXPOSE 5000