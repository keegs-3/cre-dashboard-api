import {injectable} from '@loopback/core';
import axios from 'axios';

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
}
