import { add } from "date-fns/add";

export default function getNextDay() {
    const currentDate = add(new Date(), {
        days: 1,
    });

    const day = String(currentDate.getDate()).padStart(2, "0");
    const month = String(currentDate.getMonth() + 1).padStart(2, "0");

    const date = `${day}/${month}`;

    return date;
}