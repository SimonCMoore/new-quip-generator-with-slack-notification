// Mock the fetch function
const mockFetch = jest.fn();
jest.mock('node-fetch', () => mockFetch);

import { lambdaHandler } from '../../app';
import { expect, describe, it, jest, beforeEach } from '@jest/globals';

interface QuipTemplate {
    thread: {
        author_id: string;
        created_usec: string;
        id: string;
        is_template: boolean;
        link: string;
        owning_company_id: string;
        secret_path: string;
        title: string;
        type: string;
        updated_usec: string;
    };
}

const myquip: QuipTemplate = {
    thread: {
        author_id: 'XXX',
        created_usec: '123',
        id: '123',
        is_template: true,
        link: 'XXXXXXXXXXXXXXXXXXXX',
        owning_company_id: 'XXX',
        secret_path: '123',
        title: '123',
        type: '123',
        updated_usec: '123',
    },
};

describe('Unit test for app handler', function () {
    beforeEach(() => {
        // Reset the mock before each test
        mockFetch.mockReset();
    });
    it('verifies successful response for weekly document creation', async () => {
        const event: any = {
            webhook: 'https://hooks.slack.com/services/YOUR_WEBHOOK_URL',
            quipToken: 'YOUR_QUIP_API_TOKEN',
            quipTemplateId: 'QUIP_TEMPLATE_ID',
            quipDocumentNamePrepend: 'Weekly Report',
            quipFolderId: 'QUIP_FOLDER_ID',
            frequency: 'Weekly',
            dayOfWeek: 2, // Tuesday
        };

        const mockResponse1 = {
            ok: true,
            json: jest.fn().mockResolvedValue(myquip as never),
        };
        /*
    const mockResponse2 = {
        ok: true,
        json: jest.fn().mockResolvedValue({ success: true } as never),
      };
      */
        mockFetch.mockResolvedValue(mockResponse1 as never);

        const consoleSpy = jest.spyOn(console, 'log');
        await lambdaHandler(event);

        expect(consoleSpy).toHaveBeenCalledWith('Starting Quip copy and Slack notification');
        /*
        expect(consoleSpy).toHaveBeenCalledWith('Starting Quip copy');
        expect(consoleSpy).toHaveBeenCalledWith('running createQuipDocument');
        expect(consoleSpy).toHaveBeenCalledWith(
            'Cloneurl:  https://platform.quip-amazon.com/2/threads/QUIP_TEMPLATE_ID/copy',
        );
        expect(consoleSpy).toHaveBeenCalledWith('New document created from template: 123 (123)');
        expect(consoleSpy).toHaveBeenCalledWith('Complete Quip copy, starting validation');
        expect(consoleSpy).toHaveBeenCalledWith('Start sendSlackNotification');
        expect(consoleSpy).toHaveBeenCalledWith('Data sent successfully');
        expect(consoleSpy).toHaveBeenCalledWith('Complete sendSlackNotification');
        */
        //expect(consoleSpy).toHaveBeenCalledWith('New document created from template: Weekly Report <DATE>');
        consoleSpy.mockRestore();
    });
    /*
  it('verifies successful response for monthly document creation', async () => {
    const event: any = {
      webhook: 'https://hooks.slack.com/services/YOUR_WEBHOOK_URL',
      quipToken: 'YOUR_QUIP_API_TOKEN',
      quipTemplateId: 'QUIP_TEMPLATE_ID',
      quipDocumentNamePrepend: 'Monthly Report',
      quipFolderId: 'QUIP_FOLDER_ID',
      frequency: 'Monthly',
      dayOfMonth: 15,
    };

    const consoleSpy = jest.spyOn(console, 'log');
    await lambdaHandler(event);

    expect(consoleSpy).toHaveBeenCalledWith('Starting Quip copy and Slack notification');
    expect(consoleSpy).toHaveBeenCalledWith('New document created from template: Monthly Report <DATE>');
    consoleSpy.mockRestore();
  });

  it('verifies error response when document creation fails', async () => {
    const event: any = {
      webhook: 'https://hooks.slack.com/services/YOUR_WEBHOOK_URL',
      quipToken: 'INVALID_TOKEN',
      quipTemplateId: 'INVALID_TEMPLATE_ID',
      quipDocumentNamePrepend: 'Weekly Report',
      quipFolderId: 'INVALID_FOLDER_ID',
      frequency: 'Weekly',
      dayOfWeek: 2, // Tuesday
    };

    const consoleSpy = jest.spyOn(console, 'error');
    await lambdaHandler(event);

    expect(consoleSpy).toHaveBeenCalledWith('Starting Quip copy and Slack notification');
    expect(consoleSpy).toHaveBeenCalledWith('Document not created, skipping Slack notification');
    consoleSpy.mockRestore();
  });
  */
});
