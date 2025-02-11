/* eslint-disable @typescript-eslint/no-explicit-any */
import {injectable} from '@loopback/core';
import axios from 'axios';
import {Client} from '@hubspot/api-client';

const HUBSPOT_TOKEN = process.env.HUBSPOT_TOKEN;
const hubspotClient = new Client({accessToken: HUBSPOT_TOKEN});

@injectable()
export class HubSpotService {
  async upsertContact(email: string, name: string) {
    const searchResponse = await this.searchContactByEmail(email);
    let contactId;

    if (searchResponse.results.length > 0) {
      // Update the contact
      contactId = searchResponse.results[0].id;
      await this.updateContact(contactId, {email, name});
    } else {
      // Create a new contact
      const newContact = await this.createContact({email, name});
      contactId = newContact.id;
    }

    return {id: contactId};
  }

  async addNoteToHubSpot(contactId: string, noteContent: string) {
    const data = JSON.stringify({
      engagement: {
        active: true,
        ownerId: '48200705607', // Replace with actual owner ID
        type: 'NOTE',
        timestamp: Date.now(),
      },
      associations: {
        contactIds: [contactId],
      },
      metadata: {
        body: noteContent,
      },
    });

    try {
      const response = await axios.post(
        'https://api.hubapi.com/engagements/v1/engagements',
        data,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.HUBSPOT_TOKEN}`,
          },
        },
      );
      console.log('Note added to HubSpot:', response.data);
    } catch (error) {
      console.error('Error adding note to HubSpot:', error.message);
    }
  }
  async updateHubSpotContact(email: string, name: string, subscription: any) {
    console.log('subscription data:', subscription?.items);
    try {
      const searchResponse = await this.searchContactByEmail(email);

      let contactId;
      if (searchResponse.results.length > 0) {
        contactId = searchResponse.results[0].id;
        await hubspotClient.crm.contacts.basicApi.update(contactId, {
          properties: {
            email,
            firstname: name.split(' ')[0] || name,
            lastname: name.split(' ')[1] || '',
          },
        });
      } else {
        const newContact = await hubspotClient.crm.contacts.basicApi.create({
          properties: {
            email,
            firstname: name.split(' ')[0] || name,
            lastname: name.split(' ')[1] || '',
          },
        });
        contactId = newContact.id;
      }

      const noteContent = `
         <b>Subscription Details:</b><br>
         <b>- Status:</b> ${subscription.status}<br>
         <b>- Start Date:</b> ${new Date(
           subscription.start_date * 1000,
         ).toISOString()}<br>
         <b>- Next Payment Due Date:</b> ${new Date(
           subscription.current_period_end * 1000,
         ).toISOString()}<br>
         <b>- Next Payment Amount:</b> $${(
           subscription.items.data[0].price.unit_amount / 100
         ).toFixed(2)}<br>
         <b>- Stripe Subscription ID:</b> ${subscription.id}<br>
         <b>- Last Updated:</b> ${new Date().toISOString()}<br>
        `;

      await this.addNoteToHubSpot(contactId, noteContent);
    } catch (error: any) {
      console.error('Error updating HubSpot contact:', error.message);
    }
  }

  private async searchContactByEmail(email: string) {
    const response = await axios.post(
      'https://api.hubapi.com/crm/v3/objects/contacts/search',
      {
        filterGroups: [
          {
            filters: [
              {
                propertyName: 'email',
                operator: 'EQ',
                value: email,
              },
            ],
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.HUBSPOT_TOKEN}`,
        },
      },
    );
    return response.data;
  }

  private async createContact({email, name}: {email: string; name: string}) {
    const [firstname, lastname] = name.split(' ');
    const response = await axios.post(
      'https://api.hubapi.com/crm/v3/objects/contacts',
      {
        properties: {
          email,
          firstname: firstname || '',
          lastname: lastname || '',
        },
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.HUBSPOT_TOKEN}`,
        },
      },
    );
    return response.data;
  }

  private async updateContact(
    contactId: string,
    {email, name}: {email: string; name: string},
  ) {
    const [firstname, lastname] = name.split(' ');
    const response = await axios.patch(
      `https://api.hubapi.com/crm/v3/objects/contacts/${contactId}`,
      {
        properties: {
          email,
          firstname: firstname || '',
          lastname: lastname || '',
        },
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.HUBSPOT_TOKEN}`,
        },
      },
    );
    return response.data;
  }
}
