/* eslint-disable @typescript-eslint/naming-convention */
import {Entity, model, property} from '@loopback/repository';

@model({
  settings: {postgresql: {schema: 'nedl_model', table: 'lead_gen'}},
})
export class Leads extends Entity {
  @property({
    type: 'string',
  })
  nedl_property_id?: string;
  @property({
    type: 'string',
  })
  situs_state?: string;
  @property({
    type: 'string',
  })
  situs_county?: string;
  @property({
    type: 'number',
  })
  fips_code?: number;

  @property({
    type: 'string',
  })
  cbsa_name?: string;

  @property({
    type: 'string',
  })
  cbsa_code?: string;
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
  metro_division?: string;

  @property({
    type: 'string',
  })
  neighborhood_code?: string;

  @property({
    type: 'number',
  })
  census_tract?: number;

  @property({
    type: 'number',
  })
  census_block_group?: number;

  @property({
    type: 'number',
  })
  census_block?: number;

  @property({
    type: 'string',
  })
  assessor_parcel_number_raw?: string;

  @property({
    type: 'string',
  })
  alternate_assessor_parcel_number?: string;

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
  zone_code?: string;

  @property({
    type: 'string',
  })
  last_sale_document_type?: string;

  @property({
    type: 'string',
  })
  fips_tract_block_group?: string;

  @property({
    type: 'string',
  })
  address?: string;

  @property({
    type: 'string',
  })
  house_number?: string;

  @property({
    type: 'string',
  })
  street_direction?: string;

  @property({
    type: 'string',
  })
  street_name?: string;

  @property({
    type: 'string',
  })
  street_suffix?: string;
  @property({
    type: 'number',
  })
  property_use_standardized_code?: number;
  @property({
    type: 'number',
  })
  property_use_code_mapped?: number;

  @property({
    type: 'string',
  })
  street_post_direction?: string;

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
  assessed_tax_year?: Number;
  @property({
    type: 'number',
  })
  assessed_value_total?: Number;
  @property({
    type: 'number',
  })
  assessed_value_land?: Number;

  @property({
    type: 'number',
  })
  building_sq_ft?: Number;

  @property({
    type: 'number',
  })
  gross_sq_ft?: Number;

  @property({
    type: 'number',
  })
  bath_count?: Number;

  @property({
    type: 'number',
  })
  bed_count?: Number;

  @property({
    type: 'number',
  })
  room_count?: Number;

  @property({
    type: 'number',
  })
  stories_count?: Number;
  @property({
    type: 'number',
  })
  units_count?: Number;

  @property({
    type: 'number',
  })
  assessed_value_improvements?: Number;

  @property({
    type: 'number',
  })
  year_built?: Number;

  @property({
    type: 'number',
  })
  effective_year_built?: Number;

  @property({
    type: 'date',
  })
  data_publish_date?: Date;

  @property({
    type: 'date',
  })
  cherre_deleted_at?: Date;

  @property({
    type: 'string',
  })
  cherre_ingest_datetime?: string;

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
  last_update_date?: Date;
  @property({
    type: 'date',
  })
  last_sale_date?: Date;

  @property({
    type: 'string',
  })
  building_sq_ft_code?: string;

  @property({
    type: 'string',
  })
  market_group?: string;

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
    type: 'string',

    id: true,
    generated: true,
  })
  nedl_property_id_pk?: string;

  constructor(data?: Partial<Leads>) {
    super(data);
  }
}

export interface LeadsRelations {
  // describe navigational properties here
}

export type LeadsWithRelations = Leads & LeadsRelations;
