var DateTime = {

    /**
     * Converts the date to specified format
     *
     * @param {date} date       The date to be formatted
     * @param {string} format   Type of format to be used.
     * @return {string}
     * @public
     */
    format: function (date, format) {
        var day = date.getDate(),
            month = date.getMonth() + 1,
            year = date.getFullYear(),
            hours = date.getHours(),
            minutes = date.getMinutes(),
            seconds = date.getSeconds();

        if (!format) {
            format = "MM/dd/yyyy";
        }

        format = format.replace("MM", month.toString().replace(/^(\d)$/, '0$1'));

        if (format.indexOf("yyyy") > -1) {
            format = format.replace("yyyy", year.toString());
        } else if (format.indexOf("yy") > -1) {
            format = format.replace("yy", year.toString().substr(2, 2));
        }

        format = format.replace("dd", day.toString().replace(/^(\d)$/, '0$1'));

        if (format.indexOf("t") > -1) {
            if (hours > 11) {
                format = format.replace("t", "pm");
            } else {
                format = format.replace("t", "am");
            }
        }

        if (format.indexOf("HH") > -1) {
            format = format.replace("HH", hours.toString().replace(/^(\d)$/, '0$1'));
        }

        if (format.indexOf("hh") > -1) {
            if (hours > 12) {
                hours -= 12;
            }

            if (hours === 0) {
                hours = 12;
            }
            format = format.replace("hh", hours.toString().replace(/^(\d)$/, '0$1'));
        }

        if (format.indexOf("mm") > -1) {
            format = format.replace("mm", minutes.toString().replace(/^(\d)$/, '0$1'));
        }

        if (format.indexOf("ss") > -1) {
            format = format.replace("ss", seconds.toString().replace(/^(\d)$/, '0$1'));
        }

        return format;
    },


    /**
     * Returns the current date in a string format
     *
     * @return {string}
     * @public
     */
    getDateToday: function () {
        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth() + 1;
        var yyyy = today.getFullYear();

        var date = mm + '/' + dd + '/' + yyyy;

        return date;
    }

}

// Check for commonjs
if (module) {
    module.exports = DateTime;
}

export default DateTime;