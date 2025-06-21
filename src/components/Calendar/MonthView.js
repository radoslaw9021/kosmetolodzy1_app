import React, { useState } from 'react';
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
}) => {
    // Dodaję lokalny stan do nawigacji miesiącami
    const [viewDate, setViewDate] = useState(selectedDate);

    // Zmiana miesiąca
    const handlePrevMonth = () => setViewDate(prev => subMonths(prev, 1));
    const handleNextMonth = () => setViewDate(prev => addMonths(prev, 1));
    const handleToday = () => setViewDate(new Date());

    // Wyznacz zakres miesięczny
    const monthStart = startOfMonth(viewDate);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
    const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

    // Tworzymy siatkę dni
    const rows = [];
    let days = [];
    let day = startDate;
    let formattedDate = '';

    while (day <= endDate) {
        for (let i = 0; i < 7; i++) {
            formattedDate = format(day, 'd');
            const isCurrentMonth = isSameMonth(day, monthStart);
            const isToday = isSameDay(day, new Date());
            const eventsForDay = calendarEvents.filter(event => isSameDay(new Date(event.start), day));
            const count = eventsForDay.length;
            days.push(
                <div
                    key={day}
                    onClick={() => isCurrentMonth && handleSelectDay(day)}
                    style={{
                        background: getDayColor(count),
                        borderRadius: 10,
                        minHeight: 54,
                        minWidth: 54,
                        margin: 2,
                        cursor: isCurrentMonth ? 'pointer' : 'default',
                        opacity: isCurrentMonth ? 1 : 0.4,
                        border: isToday ? '2px solid #0077cc' : '1px solid #e5e7eb',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: isToday ? 700 : 500,
                        color: count >= 3 ? '#fff' : '#222',
                        transition: 'background 0.2s',
                    }}
                >
                    <div>{formattedDate}</div>
                    {count > 0 && (
                        <div style={{ fontSize: 11, marginTop: 2 }}>{count} wizyt</div>
                    )}
                </div>
            );
            day = addDays(day, 1);
        }
        rows.push(
            <div key={day} style={{ display: 'flex', justifyContent: 'center' }}>
                {days}
            </div>
        );
        days = [];
    }

    // Nazwy dni tygodnia
    const weekDays = ['pon', 'wto', 'śro', 'czw', 'pią', 'sob', 'nie'];

    return (
        <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 2px 12px #e5e7eb', padding: 32, maxWidth: 480, margin: '0 auto' }}>
            {/* Nawigacja miesiącami */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                <button onClick={handlePrevMonth} style={{ background: '#f3f4f6', border: 'none', borderRadius: 8, padding: '6px 14px', fontSize: 20, cursor: 'pointer' }}>{'‹'}</button>
                <div style={{ fontWeight: 700, fontSize: 22 }}>
                    {format(viewDate, 'LLLL yyyy', { locale: pl })}
                </div>
                <button onClick={handleNextMonth} style={{ background: '#f3f4f6', border: 'none', borderRadius: 8, padding: '6px 14px', fontSize: 20, cursor: 'pointer' }}>{'›'}</button>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 8, gap: 2 }}>
                {weekDays.map(d => (
                    <div key={d} style={{ width: 54, textAlign: 'center', color: '#888', fontWeight: 600 }}>{d}</div>
                ))}
            </div>
            <div>
                {rows}
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: 18 }}>
                <button onClick={handleToday} style={{ background: '#0077cc', color: '#fff', border: 'none', borderRadius: 8, padding: '7px 18px', fontWeight: 600, fontSize: 15, cursor: 'pointer' }}>Dziś</button>
            </div>
        </div>
    );
};

export default MonthView;
