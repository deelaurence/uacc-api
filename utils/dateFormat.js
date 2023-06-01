const formatDate = () => {
    const currentDate = new Date();

    const options = {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
    };

    const formattedDate = new Intl.DateTimeFormat('en-US', options).format(currentDate);

    const hours = String(currentDate.getHours()).padStart(2, '0');
    const minutes = String(currentDate.getMinutes()).padStart(2, '0');
    const seconds = String(currentDate.getSeconds()).padStart(2, '0');

    const formattedTime = `${hours}:${minutes}:${seconds}`;
    return formattedDate + ',' + formattedTime
}

module.exports = { formatDate }