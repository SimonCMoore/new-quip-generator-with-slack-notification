// dateUtils.ts
export function getDateStringForWeeklyDay(dayOfWeek: number): string {
    const today = new Date();
    console.log(today);

    console.log(new Date());

    console.log(new Date());
    const dayOfWeekToday = today.getDay();
    const daysUntilDayOfWeek = 7 - dayOfWeekToday + dayOfWeek; // 0 Sunday... thur is 4  6 -4 + 0... add 7 - current day
    const newDate = new Date(today.getTime() + daysUntilDayOfWeek * 24 * 60 * 60 * 1000);

    const year = newDate.getFullYear();
    const month = String(newDate.getMonth() + 1).padStart(2, '0');
    const day = String(newDate.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
}

export function getDateStringForMonthString(dayOfMonth: number): string {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(dayOfMonth).padStart(2, '0');
    if (dayOfMonth === 0) {
        return `${year}-${month}`;
    }

    return `${year}-${month}-${day}`;
}
