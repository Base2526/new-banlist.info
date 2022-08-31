#!/bin/bash

mongoimport --db bl --collection user --file user
mongoimport --db bl --collection bank --file bank
mongoimport --db bl --collection role --file role
mongoimport --db bl --collection tContactUs --file tContactUs
mongoimport --db bl --collection basicContent --file basicContent