export function generateNextId(startName: string, lastId: string) {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();

    // If there's no last ID, start with EI-(current year)-001
    if (!lastId) {
        return `${startName}-${currentMonth}-${currentYear}-00001`;
    }
    // Extract year and last three digits from the last ID
    const parts = lastId.split('-');
    const lastMonth = parseInt(parts[1], 10);
    const lastNumber = parseInt(parts[3], 10);

    let newNumber;
    // If it's a new year, start the counter from 001
    if (lastMonth !== currentMonth) {
        newNumber = 1;
    } else {
        // Otherwise, increment the last number
        newNumber = lastNumber + 1;
    }

    // Format the number with leading zeros (e.g., 001, 002, ...)
    const newNumberStr = String(newNumber).padStart(5, '0');

    // Return the new ID
    return `${startName}-${currentMonth}-${currentYear}-${newNumberStr}`;

}
