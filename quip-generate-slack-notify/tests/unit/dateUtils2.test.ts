// dateUtils.test.ts
import { getDateStringForWeeklyDay, getDateStringForMonthString } from '../../dateUtils';
import { expect, describe, it, jest, beforeEach, afterEach } from '@jest/globals';

 
describe('dateUtils 2', () => {
    describe.skip('getDateStringForWeeklyDay skip as cant mock date only once currently', () => {
        //let mockDate: Date;
        const OldDateFn = Date;
        // Create a mock Date object
        let mockDate = new OldDateFn('2024-08-20T13:00:00.000Z'); // Tuesday, Aug 20, 2024

        beforeEach(() => {
            // Mock the Date constructor
            //global.Date = jest.fn(() => mockDate) as never;

            // Mock the Date constructor to return the mockDate only once
            const mockDateConstructor = jest.fn();
            mockDateConstructor.mockImplementationOnce(() => mockDate);
            mockDateConstructor.mockImplementation(() => new OldDateFn());
            mockDateConstructor.mockImplementation(() => mockDate);
            // Preserve the original getDay() method
            mockDateConstructor.prototype.getDay = OldDateFn.prototype.getDay;
            mockDateConstructor.prototype.getTime = OldDateFn.prototype.getTime;
            mockDateConstructor.prototype.getFullYear = OldDateFn.prototype.getFullYear;
            mockDateConstructor.prototype.getMonth = OldDateFn.prototype.getMonth;
            mockDateConstructor.prototype.getDate = OldDateFn.prototype.getDate;

            global.Date = mockDateConstructor as any;
        });

        afterEach(() => {
            // Restore the original Date constructor
            global.Date = OldDateFn;
        });

        it('should return the correct date string for a given day, Sunday', () => {
            const result = getDateStringForWeeklyDay(0); // Sunday
            expect(result).toBe('2024-08-25');
        });
        /*
        it('should return the correct date string for a given day, Monday', () => {
            const result = getDateStringForWeeklyDay(1); // Monday
            expect(result).toBe('2024-08-26');
        });
        it('should return the correct date string for a given day, Tue', () => {
            const result = getDateStringForWeeklyDay(2); // Tue
            expect(result).toBe('2024-08-27');
        });
        it('should return the correct date string for a given day, Wed', () => {
            const result = getDateStringForWeeklyDay(3); // Wed
            expect(result).toBe('2024-08-28');
        });
        it('should return the correct date string for a given day, Thur', () => {
            const result = getDateStringForWeeklyDay(4); // Thur
            expect(result).toBe('2024-08-29');
        });
        it('should return the correct date string for a given day, Fri', () => {
            const result = getDateStringForWeeklyDay(5); // Fri
            expect(result).toBe('2024-08-30');
        });
        it('should return the correct date string for a given day, Sat', () => {
            const result = getDateStringForWeeklyDay(6); // Sat
            expect(result).toBe('2024-08-31');
        });
*/
    });
});
