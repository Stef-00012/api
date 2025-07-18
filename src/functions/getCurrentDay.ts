export default function getCurrentDay() {
    const currentDate = new Date();

    const day = String(currentDate.getDate()).padStart(2, "0");
    const month = String(currentDate.getMonth() + 1).padStart(2, "0");

    const date = `${day}/${month}`;

    return date;
}