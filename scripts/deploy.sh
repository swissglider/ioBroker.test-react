#!/bin/bash

npm run build

# scp -r www root@192.168.90.1:/opt/iobroker/node_modules/iobroker.test-react/

ssh root@192.168.90.1 rm -rf /opt/iobroker/node_modules/iobroker.test-react/admin
scp -r admin root@192.168.90.1:/opt/iobroker/node_modules/iobroker.test-react/
scp -r io-package.json root@192.168.90.1:/opt/iobroker/node_modules/iobroker.test-react/

scp -r build root@192.168.90.1:/opt/iobroker/node_modules/iobroker.test-react/

ssh root@192.168.90.1 iobroker upload test-react