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
  billAddres1 TEXT,
  billAddres2 TEXT,
  shipToAddresName TEXT,
  shipToAddress1 TEXT,
  openBalance NUMERIC,
  overdueBalance NUMERIC,
  workPhone TEXT,
  cellPhone TEXT,
  email TEXT,
  shipToZipCode TEXT,
  billAddresZipCode TEXT,
  billAddresCity TEXT,
  billAddressState TEXT,
  billAddressCountry TEXT,
  shipToCity TEXT,
  shipToState TEXT,
  shipToCountry TEXT,
  id_salesrep TEXT NOT NULL,
  routeDay1 INTEGER,
  routeDay2 INTEGER,
  routeDay3 INTEGER,
  routeDay4 INTEGER,
  routeDay5 INTEGER,
  routeDay6 INTEGER,
  routeDay7 INTEGER,
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
  dueDate NONE,
  appliedAmount NONE,
  balanceRemaining NONE,
  billAddress_addr1 NONE,
  billAddress_addr2 NONE,
  billAddress_city NONE,
  billAddress_state NONE,
  billAddress_postalcode NONE,
  shipAddress_addr1 NONE,
  shipAddress_addr2 NONE,
  shipAddress_city NONE,
  shipAddress_state NONE,
  shipAddress_postalcode NONE,
  isPaid NONE,
  isPending NONE,
  refNumber NONE,
  salesTaxPercentage NONE,
  salesTaxTotal NONE,
  shipDate NONE,
  subtotal NONE,
  id_term TEXT NOT NULL,
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


