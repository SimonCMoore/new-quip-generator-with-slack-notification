// dateUtils.test.ts
import { getDateStringForWeeklyDay, getDateStringForMonthString } from '../../dateUtils';
import { expect, describe, it } from '@jest/globals';

describe('dateUtils 1', () => {
    describe('getDateStringForWeeklyDay', () => {
        it('should return the correct date string for a given day of the week', () => {
            const today = new Date();
            const currentTime = new Date().toLocaleTimeString('en-US', { hour12: false });
            const timeString = 'T' + currentTime + '.000Z';
            const options: Intl.DateTimeFormatOptions = { weekday: 'long' };
            const dayOfWeekToday = today.getDay();
            console.log(dayOfWeekToday);

            // Test for Sunday (0)
            const sundayDate = getDateStringForWeeklyDay(0);
            const sundayAsDate = new Date(sundayDate + timeString);
            const dayOfWeek = sundayAsDate.toLocaleDateString('en-US', options);
            expect(sundayAsDate.getDay()).toBe(0);
            expect(sundayAsDate.getTime()).toBeGreaterThan(today.getTime());
            expect(dayOfWeek).toBe('Sunday');

            // Test for Monday (1)
            const mondayDate = getDateStringForWeeklyDay(1);
            const mondayAsDate = new Date(mondayDate + timeString);
            expect(mondayAsDate.getDay()).toBe(1);
            expect(mondayAsDate.getTime()).toBeGreaterThan(today.getTime());

            // Test for Tuesday (2)
            const tuesdayDate = getDateStringForWeeklyDay(2);
            const tuesdayAsDate = new Date(tuesdayDate + timeString);
            expect(tuesdayAsDate.getDay()).toBe(2);
            expect(tuesdayAsDate.getTime()).toBeGreaterThan(today.getTime());

            // Test for Saturday (6)
            const saturdayDate = getDateStringForWeeklyDay(6);
            const saturdayAsDate = new Date(saturdayDate + timeString);
            expect(saturdayAsDate.getDay()).toBe(6);
            expect(saturdayAsDate.getTime()).toBeGreaterThan(today.getTime());
        });
    });

    describe('getDateStringForMonthString', () => {
        it('should return the correct date string for a given day of the month temp', () => {
            const firstDayOfMonth = getDateStringForMonthString(1);
            expect(firstDayOfMonth).toBe('2024-08-01');
        });
        it('should return the correct date string for a given day of the month', () => {
            const today = new Date();
            const year = today.getFullYear();
            const month = String(today.getMonth() + 1).padStart(2, '0');

            // Test for the 1st of the month
            const firstDayOfMonth = getDateStringForMonthString(1);
            expect(firstDayOfMonth).toBe(`${year}-${month}-01`);

            // Test for the 15th of the month
            const fifteenthDayOfMonth = getDateStringForMonthString(15);
            expect(fifteenthDayOfMonth).toBe(`${year}-${month}-15`);
        });
    });
});
