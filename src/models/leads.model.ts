/* eslint-disable @typescript-eslint/naming-convention */
import {Entity, model, property} from '@loopback/repository';

@model({
  settings: {postgresql: {schema: 'nedl_model', table: 'app_add_to_leads'}},
})
export class Leads extends Entity {
  @property({
    type: 'string',
  })
  nedl_property_id?: string;

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
    type: 'string',
  })
  address?: string;

  @property({
    type: 'number',
  })
  latitude?: number;

  @property({
    type: 'number',
  })
  longitude?: number;
  @property({
    type: 'number',
  })
  building_sq_ft?: Number;

  @property({
    type: 'number',
  })
  bed_count?: Number;

  @property({
    type: 'number',
  })
  units_count?: Number;

  @property({
    type: 'number',
  })
  year_built?: Number;

  @property({
    type: 'number',
  })
  effective_year_built?: Number;

  @property({
    type: 'number',
  })
  last_sale_amount?: Number;

  @property({
    type: 'number',
  })
  prior_sale_amount?: Number;

  @property({
    type: 'Date',
  })
  prior_sale_date?: Date;

  @property({
    type: 'date',
  })
  last_sale_date?: Date;

  @property({
    type: 'number',
  })
  months_since_last_transaction?: Number;

  @property({
    type: 'number',
  })
  months_to_loan_maturity?: Number;

  @property({
    type: 'number',
  })
  prior_12months_avg_rental_rate_change?: Number;

  @property({
    type: 'number',
  })
  prior_6months_avg_rental_rate_change?: Number;

  @property({
    type: 'number',
  })
  prior_3months_avg_rental_rate_change?: Number;

  @property({
    type: 'number',
  })
  prior_12months_avg_occupancy_rate_change?: Number;

  @property({
    type: 'string',
  })
  year_of_analysis?: string;

  @property({
    type: 'date',
  })
  insert_date_time?: Date;

  @property({
    type: 'string',
  })
  lead_type?: string;
  @property({
    type: 'string',
  })
  userid?: string;

  @property({
    type: 'number',
  })
  org?: Number;
  @property({
    type: 'number',
  })
  subs_id?: Number;

  @property({
    type: 'number',
  })
  nedl_property_id_pk?: number;
  @property({
    type: 'string',
  })
  nedl_property_name?: string;
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
    type: 'string',
  })
  time_to_mature?: string;
  @property({
    type: 'string',
  })
  owner_name?: string;
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
  owner_contact_name?: string;
  @property({
    type: 'string',
  })
  owner_phone_number?: string;
  @property({
    type: 'string',
  })
  owner_email_address?: string;
  @property({
    type: 'string',
  })
  region?: string;

  constructor(data?: Partial<Leads>) {
    super(data);
  }
}

export interface LeadsRelations {
  // describe navigational properties here
}

export type LeadsWithRelations = Leads & LeadsRelations;
