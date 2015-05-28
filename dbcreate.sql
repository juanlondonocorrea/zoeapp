﻿/*
Created: 29/04/2015
Modified: 28/05/2015
Model: RE SQLite 3.7
Database: SQLite 3.7
*/




-- Drop indexes section -------------------------------------------------

DROP INDEX IF EXISTS customer_idx1;
DROP INDEX IF EXISTS idx_salesrep_1;

-- Drop tables section ---------------------------------------------------

DROP TABLE IF EXISTS terms;
DROP TABLE IF EXISTS invoice_item;
DROP TABLE IF EXISTS invoice;
DROP TABLE IF EXISTS customer;
DROP TABLE IF EXISTS salesrep;

-- Create tables section -------------------------------------------------

-- Table salesrep

CREATE TABLE salesrep
(
  id_salesrep TEXT NOT NULL,
  Name TEXT NOT NULL,
  Password TEXT NOT NULL,
  isActive INTEGER NOT NULL,
  SyncTime NUMERIC NOT NULL,
  initials TEXT,
  CONSTRAINT Key2 PRIMARY KEY (id_salesrep),
  CONSTRAINT id_salesrep UNIQUE (id_salesrep)
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_salesrep_1 ON salesrep (Name,isActive);

-- Table customer

CREATE TABLE customer
(
  ListID TEXT NOT NULL,
  FullName TEXT,
  IsActive INTEGER,
  billAddress1 TEXT,
  billAddress2 TEXT,
  shipAddress1 TEXT,
  shipAddress2 TEXT,
  openBalance NUMERIC,
  overdueBalance NUMERIC,
  workPhone TEXT,
  cellPhone TEXT,
  email TEXT,
  shipAddressZipcode TEXT,
  billAddresZipCode TEXT,
  billAddresCity TEXT,
  billAddressState TEXT,
  billAddressCountry TEXT,
  shipAddressCity TEXT,
  shipAddressState TEXT,
  shipAddressCountry TEXT,
  id_salesrep TEXT NOT NULL,
  routeDay1 INTEGER,
  routeDay2 INTEGER,
  routeDay3 INTEGER,
  routeDay4 INTEGER,
  routeDay5 INTEGER,
  routeDay6 INTEGER,
  routeDay7 INTEGER,
  Fax TEXT,
  companyName TEXT,
  billAddress3 TEXT,
  shipAddress3 NONE,
  name TEXT,
  companyName TEXT,
  otherDetails TEXT,
  CONSTRAINT Key3 PRIMARY KEY (ListID,id_salesrep),
  CONSTRAINT sales_rep_customer FOREIGN KEY (id_salesrep) REFERENCES salesrep (id_salesrep)
);

CREATE INDEX customer_idx1 ON customer (FullName);

-- Table invoice

CREATE TABLE invoice
(
  id_invoice TEXT NOT NULL,
  ListID TEXT NOT NULL,
  id_salesrep TEXT NOT NULL,
  po_number TEXT,
  dueDate INTEGER,
  appliedAmount NUMERIC,
  balanceRemaining NUMERIC,
  billAddress_addr1 TEXT,
  billAddress_addr2 TEXT,
  billAddress_city TEXT,
  billAddress_state TEXT,
  billAddress_postalcode TEXT,
  shipAddress_addr1 TEXT,
  shipAddress_addr2 TEXT,
  shipAddress_city TEXT,
  shipAddress_state TEXT,
  shipAddress_postalcode TEXT,
  isPaid INTEGER,
  isPending INTEGER,
  refNumber TEXT,
  salesTaxPercentage NUMERIC,
  salesTaxTotal NUMERIC,
  shipDate INTEGER,
  subtotal NUMERIC,
  id_term TEXT NOT NULL,
  billAddress_addr3 TEXT,
  shipAddress_addr3 TEXT,
  CONSTRAINT Key4 PRIMARY KEY (id_invoice,ListID,id_salesrep,id_term),
  CONSTRAINT invoice_custumer FOREIGN KEY (ListID, id_salesrep) REFERENCES customer (ListID, id_salesrep),
  CONSTRAINT invoice_terms FOREIGN KEY (id_term) REFERENCES terms (id_term)
);

-- Table invoice_item

CREATE TABLE invoice_item
(
  id_item TEXT NOT NULL,
  id_invoice TEXT NOT NULL,
  ListID TEXT NOT NULL,
  id_salesrep TEXT NOT NULL,
  id_term TEXT NOT NULL,
  CONSTRAINT Key5 PRIMARY KEY (id_item,id_invoice,ListID,id_salesrep,id_term),
  CONSTRAINT invoice_lines FOREIGN KEY (id_invoice, ListID, id_salesrep, id_term) REFERENCES invoice (id_invoice, ListID, id_salesrep, id_term)
);

-- Table terms

CREATE TABLE terms
(
  id_term TEXT NOT NULL,
  fullName TEXT,
  CONSTRAINT Key6 PRIMARY KEY (id_term)
);


