import React from 'react';
import Calendar from "react-calendar";

const MyCalendar = () => {
    const getBlocksForDate = (date) => {
        // Mock data for demonstration; replace with your dynamic logic
        const mockEvents = {
            "2024-12-30": ["New Year Celebration", "Brunch with Friends"],
            "2024-12-28": ["Workout", "Team Meeting", "Dinner"],
            "2024-01-03": ["Project Deadline"],
        };
        const formattedDate = date.toISOString().split('T')[0];
        return mockEvents[formattedDate] || [];
    };

    return (
        <div className="p-3">
            <Calendar
                locale="us-US"
                tileContent={({ date, view }) => {
                    if (view === "month") {
                        const blocks = getBlocksForDate(date);
                        return (
                            <div className="mt-3">
                                {blocks.slice(0, 3).map((block, index) => (
                                    <div
                                        key={index}
                                        className="bg-primary text-white rounded-pill text-truncate mb-1 px-2"
                                        style={{ maxWidth: "100%", fontSize: "0.75em", lineHeight: "1.3"}}
                                    >
                                        {block}
                                    </div>
                                ))}
                                {blocks.length > 3 && (
                                    <div className="bg-secondary text-white rounded-pill text-truncate small px-2">
                                        +{blocks.length - 3} more
                                    </div>
                                )}
                            </div>
                        );
                    }
                    return null;
                }}
                tileDisabled={({activeStartDate, date, view}) => {
                    return view === "month" && date.getMonth() !== activeStartDate.getMonth();
                }}
                onClickDay={(value) => console.log("Day clicked: ", value)}
            />
        </div>
    );
};

export default MyCalendar;