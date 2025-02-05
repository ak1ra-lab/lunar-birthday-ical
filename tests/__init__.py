config = {
    "global": {
        "calendar": "Test Calendar",
        "timezone": "Asia/Shanghai",
        "skip_days": 180,
        "event_time": "10:00:00",
        "event_hours": 2,
        "reminders": [1, 3, 7],
        "attendees": ["test@example.com"],
        "max_events": 20,
        "max_days": 30000,
        "interval": 1000,
        "max_ages": 80,
        "solar_birthday": True,
        "lunar_birthday": True,
    },
    "persons": [
        {
            "username": "testuser",
            "startdate": "2006-02-01",
        }
    ],
    "pastebin": {"enabled": False},
}
