import React from 'react';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns';
import { pl } from 'date-fns/locale';

const getDayColor = (count) => {
    // 0 - jasny, 1-2 - lekko, 3-4 - średni, 5+ - ciemny
    if (count === 0) return '#f7fafc'; // bardzo jasny
    if (count === 1) return '#c7eaff';
    if (count === 2) return '#7fd3ff';
    if (count === 3) return '#3bb0e6';
    if (count >= 4) return '#0077cc';
    return '#f7fafc';
};

const MonthView = ({
    calendarEvents,
    selectedDate,
    handleSelectDay,
    onMonthChange,
}) => {
    const handlePrevMonth = () => onMonthChange(subMonths(selectedDate, 1));
    const handleNextMonth = () => onMonthChange(addMonths(selectedDate, 1));
    const handleToday = () => onMonthChange(new Date());

    const monthStart = startOfMonth(selectedDate);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
    const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

    const rows = [];
    let day = startDate;

    while (day <= endDate) {
        const days = [];
        const weekKey = day.toISOString();

        for (let i = 0; i < 7; i++) {
            const currentDay = new Date(day);
            const formattedDate = format(currentDay, 'd');
            const isCurrentMonth = isSameMonth(currentDay, monthStart);
            const isToday = isSameDay(currentDay, new Date());
            const eventsForDay = calendarEvents.filter(event => isSameDay(new Date(event.start), currentDay));
            const count = eventsForDay.length;

            days.push(
                <div
                    key={currentDay.toISOString()}
                    className={[
                        "calendar-month-day",
                        isToday ? "today" : "",
                        !isCurrentMonth ? "not-current" : ""
                    ].join(" ")}
                    onClick={() => isCurrentMonth && handleSelectDay(currentDay)}
                >
                    <div>{formattedDate}</div>
                    {count > 0 && (
                        <div className="calendar-month-day-count">{count} wizyt</div>
                    )}
                </div>
            );
            day = addDays(day, 1);
        }
        rows.push(
            <div key={weekKey} className="calendar-month-row">
                {days}
            </div>
        );
    }

    const weekDays = ['pon', 'wto', 'śro', 'czw', 'pią', 'sob', 'nie'];

    return (
        <div className="calendar-month-container">
            <div className="calendar-month-nav">
                <button onClick={handlePrevMonth} className="calendar-month-nav-btn">‹</button>
                <div className="calendar-month-nav-title">
                    {format(selectedDate, 'LLLL yyyy', { locale: pl })}
                </div>
                <button onClick={handleNextMonth} className="calendar-month-nav-btn">›</button>
            </div>
            <div className="calendar-month-weekdays">
                {weekDays.map(d => (
                    <div key={d} className="calendar-month-weekday">{d}</div>
                ))}
            </div>
            <div className="calendar-month-grid">
                {rows}
            </div>
            <div className="calendar-month-today-btn-wrap">
                <button onClick={handleToday} className="calendar-month-today-btn">Dziś</button>
            </div>
        </div>
    );
};

export default MonthView;
