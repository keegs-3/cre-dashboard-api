/* eslint-disable @typescript-eslint/naming-convention */
import {Entity, model, property} from '@loopback/repository';

@model({settings: { postgresql: { schema: process.env.DB_SCHEMA, table: 'leads'} }, })
export class Leads extends Entity {
  @property({
    type: 'string',
    id: true,
  })
  tax_assessor_id?: string;

  @property({
    type: 'string',
  })
  msa_name?: string;

  @property({
    type: 'number',
  })
  msa_code?: number;

  @property({
    type: 'string',
  })
  address?: string;

  @property({
    type: 'string',
  })
  city?: string;

  @property({
    type: 'string',
  })
  state?: string;

  @property({
    type: 'number',
  })
  zip?: Number;

  @property({
    type: 'number',
  })
  zip_4?: number;

  @property({
    type: 'number',
  })
  latitude?: number;

  @property({
    type: 'number',
  })
  longitude?: number;

  @property({
    type: 'boolean',
  })
  is_owner_occupied?: Boolean;

  @property({
    type: 'number',
  })
  assessed_tax_year?: Number;

  @property({
    type: 'number',
  })
  year_built?: Number;

  @property({
    type: 'string',
  })
  tax_assessor_last_sale_date?: string;
  @property({
    type: 'number',
  })
  last_sale_amount?: Number;

  @property({
    type: 'string',
  })
  tax_assessor_prior_sale_date?: string;

  @property({
    type: 'number',
  })
  prior_sale_amount?: Number;

  @property({
    type: 'string',
  })
  last_ownership_change_date?: string;

  @property({
    type: 'string',
  })
  last_deed_sale_date?: string;

  @property({
    type: 'number',
  })
  deed_last_sale_price?: Number;
  @property({
    type: 'number',
  })
  building_sq_ft?: Number;
  @property({
    type: 'number',
  })
  lot_size_acre?: Number;
  @property({
    type: 'number',
  })
  lot_size_sq_ft?: Number;
  @property({
    type: 'number',
  })
  units_count?: Number;

  @property({
    type: 'string',
  })
  data_publish_date?: string;

  @property({
    type: 'string',
  })
  probability?: string;
  @property({
    type: 'date',
  })
  created_date?: Date;
  @property({
    type: 'string',
  })
  owner_name?: string;
  @property({
    type: 'number',
  })
  loan_amount?: Number;
  @property({
    type: 'date',
  })

  loan_maturity_date?: Date;
  @property({
    type: 'date',
  })
  loan_origination_date?: Date;
  @property({
    type: 'number',
  })
  years_to_mature?: Number;
  @property({
    type: 'number',
  })
  last_sale_years?: Number;
  @property({
    type: 'string',
  })
  owner_contact_name?: string;
  @property({
    type: 'string',
  })
  owner_email?: string;
  @property({
    type: 'string',
  })
  owner_address?: string;
  @property({
    type: 'string',
  })
  owner_city?: string;
  @property({
    type: 'string',
  })
  owner_state?: string;
  @property({
    type: 'string',
  })
  owner_zip?: string;

  @property({
    type: 'string',
  })
  owner_phone_number?: string;
  @property({
    type: 'number',
  })
  latest_monthly_rent?: Number;
  @property({
    type: 'number',
  })
  latest_occupancy_rate?: Number;

  @property({
    type: 'string',
  })
  property_name?: string;
  @property({
    type: 'string',
  })
  market?: string;
  @property({
    type: 'string',
  })
  sub_market?: string;
  @property({
    type: 'string',
  })
  county?: string;
  @property({
    type: 'string',
  })
  owner?: string;
  @property({
    type: 'boolean',
  })
  user_added?: Boolean;



  constructor(data?: Partial<Leads>) {
    super(data);
  }
}

export interface LeadsRelations {
  // describe navigational properties here
}

export type LeadsWithRelations = Leads & LeadsRelations;
