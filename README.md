# ci-test-results

## Example

```
# Retrieve failing tests from https://ci.nodejs.org/job/node-test-pull-request/1372/

$ node index.js -j node-test-pull-request -n 1372

# It returns

Failing jobs
[ 'https://ci.nodejs.org/job/node-test-binary-arm/RUN_SUBSET=5,nodes=pi1-raspbian-wheezy/755/',
  'https://ci.nodejs.org/job/node-test-binary-windows/RUN_SUBSET=0,VS_VERSION=vs2015,label=win10/757/' ]

Failing tests @ https://ci.nodejs.org/job/node-test-binary-windows/RUN_SUBSET=0,VS_VERSION=vs2015,label=win10/757/

1) test-cluster-shared-leak.js
----------------------------------------------
# events.js:155
#       throw er; // Unhandled 'error' event
#       ^
# 
# Error: write EPIPE
#     at exports._errnoException (util.js:859:11)
#     at ChildProcess.target._send (internal/child_process.js:611:20)
#     at ChildProcess.target.send (internal/child_process.js:507:19)
#     at sendHelper (cluster.js:723:8)
#     at send (cluster.js:518:5)
#     at cluster.js:493:7
#     at SharedHandle.add (cluster.js:86:3)
#     at queryServer (cluster.js:485:12)
#     at Worker.onmessage (cluster.js:433:7)
#     at ChildProcess.<anonymous> (cluster.js:737:8)

============================================== 

```
