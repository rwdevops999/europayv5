#!/bin/bash

pnpm jobs &
npx prisma db push 
pnpm start

