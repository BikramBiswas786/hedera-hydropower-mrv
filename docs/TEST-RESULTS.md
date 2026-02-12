\# Test Results – Hydropower MRV Service



This document summarizes local tests run against the ACM0002 calculation module and the MRV service API.\[file:451]\[web:544]\[web:411]



\## 1. ACM0002 unit tests



The ACM0002 calculation logic is implemented in `code/mrv-service/src/acm0002.ts` and exercised by `src/tests/acm0002.test.ts`.\[file:451]



To run the tests:



```bash

cd code/mrv-service

npm test

Example output:

> hedera-hydro-mrv-service@0.1.0 test

> ts-node src/tests/acm0002.test.ts



OK: 10,000 MWh, EF=0.8, no PE/LE

OK: Baseline 8000, PE=100, LE=50

All ACM0002 tests passed



These tests confirm that:



Baseline emissions 

B

E

y

BE 

y

&nbsp; are computed as 

E

G

P

J

,

y

×

E

F

g

r

i

d

,

C

M

,

y

EG 

PJ,y

&nbsp;×EF 

grid,CM,y

&nbsp;, consistent with ACM0002-style methodologies.\[file:451]\[web:411]\[web:544]



When project emissions 

P

E

y

PE 

y

&nbsp; and leakage emissions 

L

E

y

LE 

y

&nbsp; are zero, emission reductions 

E

R

y

ER 

y

&nbsp; equal baseline emissions 

B

E

y

BE 

y

&nbsp;.\[file:451]\[web:411]



When non-zero 

P

E

y

PE 

y

&nbsp; and 

L

E

y

LE 

y

&nbsp; are supplied, the module correctly computes 

E

R

y

=

B

E

y

−

P

E

y

−

L

E

y

ER 

y

&nbsp;=BE 

y

&nbsp;−PE 

y

&nbsp;−LE 

y

&nbsp;.\[file:451]\[web:411]



2\. MRV service smoke test

To verify the service starts and exposes its API:



bash

cd code/mrv-service

npm start

Expected console output:



text

MRV service listening on 8080

A simple smoke test sequence:



Submit telemetry for a test device (e.g., TURBINE-1) using POST /telemetry with increasing nonces.



Confirm HTTP 200 responses and that each accepted message produces an HCS transaction ID recorded in evidence/txids.csv.



Call GET /mrv-snapshot/TURBINE-1 and verify that:



The returned electricityMWh equals the sum of accepted MWh values for this process.



The baseline and emission reductions follow the ACM0002 formula.\[file:451]\[web:411]\[web:544]



3\. Evidence captured

Representative transaction IDs, device IDs, nonces, and message hashes are recorded in:



evidence/txids.csv in this repository (local evidence file).



The docs/Testnet-Evidence.md document, which links to the corresponding HashScan entries.\[file:451]\[web:541]



Together, these tests demonstrate that the core ACM0002 logic behaves as expected for basic scenarios and that the MRV service correctly anchors telemetry hashes to Hedera Testnet.\[file:451]\[web:541]\[web:546]



